import { action } from "@solidjs/router";
import { For, Show, createSignal } from "solid-js";

const PageStates = {
	NameInput: 0,
	Joining: 1,
	Chatting: 2,
};

export default function Chat() {
	const [name, setName] = createSignal("");
	const [inputMessage, setInputMessage] = createSignal("");
	const [messages, setMessages] = createSignal<
		{
			name: string;
			message: string;
		}[]
	>([]);

	const [pageState, setPageState] = createSignal(0);

	let ws: WebSocket;

	const joinRoom = async (e: SubmitEvent) => {
		e.preventDefault();
		console.log("calling server");

		const roomName = "testing";

		const url = new URL(
			(import.meta.env.VITE_SOCKET_SERVICE as string) +
				"/api/room/" +
				roomName +
				"/websocket"
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
			if (newMessage.action) {
				console.log(action);
				setMessages([
					{ name: newMessage.name, message: "deleted chat" },
				]);
				return;
			}
			const newMessages = [...messages()];
			newMessages.push({
				name: newMessage.name,
				message: newMessage.message,
			});
			console.log(newMessages);
			setMessages(newMessages);
		});

		await waitForSocket();
	};

	const getSocketReadyState = () => {
		if (ws.readyState == 1) return true;
		else return false;
	};

	const waitForSocket = async () => {
		setPageState(PageStates.Joining);
		await until(getSocketReadyState);

		sendName();
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

	const handleNameChange = (e: Event) => {
		const val = (e.target as HTMLInputElement).value;
		setName(val);
	};

	const sendName = () => {
		ws.send(JSON.stringify({ name: name() }));
	};

	const handleMessageChange = (e: Event) => {
		const val = (e.target as HTMLInputElement).value;
		setInputMessage(val);
	};

	const sendMessage = (e: SubmitEvent) => {
		e.preventDefault();
		ws.send(JSON.stringify({ message: inputMessage() }));
		setInputMessage("");
	};

	const deleteChat = () => {
		ws.send(JSON.stringify({ action: "delete" }));
	};

	return (
		<div>
			<div>
				<Show when={pageState() == PageStates.NameInput}>
					<form onsubmit={joinRoom}>
						<p>enter your name</p>
						<input
							class="bg-ctp-surface0 p-2 rounded-md"
							type="text"
							value={name()}
							onchange={handleNameChange}
						/>
						<button class="pl-2" type="submit">
							join
						</button>
					</form>
				</Show>
				<Show when={pageState() == PageStates.Chatting}>
					<form onsubmit={sendMessage}>
						<input
							class="bg-ctp-surface0 p-2 rounded-md"
							type="text"
							value={inputMessage()}
							onchange={handleMessageChange}
						/>
						<button type="submit">send message</button>
					</form>
					<div class="p-4"></div>
					<div class="bg-ctp-surface0 p-2">
						<For each={messages()}>
							{(message, i) => (
								<div class="flex">
									<div class=" font-bold">
										{message.name}:
									</div>
									<div>{message.message}</div>
								</div>
							)}
						</For>
					</div>
					<button
						onclick={deleteChat}
						class=" bg-ctp-red p-2 rounded-md"
					>
						delete chat
					</button>
				</Show>
			</div>
		</div>
	);
}
