import { For, Show, createSignal } from "solid-js";
import NameForm from "~/components/Chat/NameForm";
import { PageStates } from "~/types";
import { ChatMessage } from "../../../reflect/mutators";
import Messages from "~/components/Chat/Messages";

export default function Chat() {
	const [inputMessage, setInputMessage] = createSignal("");
	const [messages, setMessages] = createSignal<ChatMessage[]>([]);

	const [members, setMembers] = createSignal<string[]>([]);
	const [pageState, setPageState] = createSignal(0);
	const [ping, setPing] = createSignal(0);

	const [username, setUsername] = createSignal("");

	let ws: WebSocket;
	let time: number;

	const joinRoom = async (username: string) => {
		console.log("calling server");

		const roomName = "testing";

		const url = new URL(
			(import.meta.env.VITE_SOCKET_SERVICE as string) +
				"/api/room/" +
				roomName +
				"/websocket",
		);
		url.protocol = "wss";
		// url.pathname = "/ws";

		console.log("url", url);

		ws = new WebSocket(url);

		if (!ws) {
			throw new Error("server didn't accept WebSocket");
		}

		console.log("ws", ws);

		// Call accept() to indicate that you'll be handling the socket here
		// in JavaScript, as opposed to returning it on to a client.

		// Now you can send and receive messages like before.
		ws.addEventListener("message", (msg) => {
			const newMessage = JSON.parse(msg.data);
			console.log(newMessage);
			if (newMessage.action) {
				console.log(newMessage.action);
				setMessages([
					{ name: newMessage.name, message: "deleted chat" },
				]);
				return;
			} else if (newMessage.joined) {
				console.log(newMessage.joined);
				const newMembers = [...members()];
				newMembers.push(newMessage.joined);
				setMembers(newMembers);
				return;
			}
			const newMessages = [...messages()];
			newMessages.push({
				name: newMessage.name,
				message: newMessage.message,
			});
			setMessages(newMessages);

			if (newMessage.name == username) setPing(Date.now() - time);
		});
		console.log("wait for socket", username);
		setUsername(username);

		await waitForSocket(username);
	};

	const getSocketReadyState = () => {
		if (ws.readyState == 1) return true;
		else return false;
	};

	const waitForSocket = async (username: string) => {
		setPageState(PageStates.Joining);
		await until(getSocketReadyState);

		ws.send(JSON.stringify({ name: username }));
		setPageState(PageStates.Chatting);
		console.log("connected");
	};

	function until(condition: () => boolean) {
		//@ts-expect-error
		const poll = (resolve) => {
			if (condition()) resolve();
			else setTimeout(() => poll(resolve), 400);
		};

		return new Promise(poll);
	}

	const handleMessageChange = (e: Event) => {
		const val = (e.target as HTMLInputElement).value;
		setInputMessage(val);
	};

	const sendMessage = (e: SubmitEvent) => {
		e.preventDefault();
		ws.send(JSON.stringify({ message: inputMessage() }));
		setInputMessage("");
		time = Date.now();
	};

	const deleteChat = () => {
		ws.send(JSON.stringify({ action: "delete" }));
	};

	return (
		<div class="flex h-svh w-screen flex-col">
			<div class="flex h-0 w-screen max-w-lg grow flex-col gap-2 self-center p-4">
				<Show when={pageState() == PageStates.NameInput}>
					<NameForm joinRoom={joinRoom} />
				</Show>
				<Show when={pageState() == PageStates.Chatting}>
					<Messages messages={messages()} username={username()} />
					<form onsubmit={sendMessage}>
						<input
							class="rounded-md bg-ctp-surface0 p-2"
							type="text"
							value={inputMessage()}
							onchange={handleMessageChange}
						/>
						<button type="submit">send message</button>
					</form>
					<button
						onclick={deleteChat}
						class=" rounded-md bg-ctp-red p-2"
					>
						delete chat
					</button>
					<div>ping: last message sent in {ping()}ms</div>
					<div class="flex flex-col">
						members:
						<For each={members()}>
							{(member, i) => (
								<ol>
									<li>
										{i() + 1}.{member}
									</li>
								</ol>
							)}
						</For>
					</div>
				</Show>
			</div>
		</div>
	);
}
