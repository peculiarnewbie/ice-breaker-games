import { For, Show, createSignal } from "solid-js";
import NameForm from "~/components/Chat/NameForm";
import { PageStates } from "~/types";
import { ChatMessage } from "../../../reflect/mutators";
import Messages from "~/components/Chat/Messages";
import MessageForm from "~/components/Chat/MessageForm";
import DeleteChat from "~/components/Chat/DeleteChat";
import ChatMembers from "~/components/Chat/ChatMembers";
import { nanoid } from "nanoid";

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
				setMessages([
					{
						id: nanoid(),
						name: newMessage.name,
						message: "deleted chat",
					},
				]);
				return;
			} else if (newMessage.joined) {
				const newMembers = [...members()];
				newMembers.push(newMessage.joined);
				setMembers(newMembers);
				return;
			} else if (newMessage.quit) {
				const newMembers = members().filter(
					(name) => name !== newMessage.quit,
				);
				setMembers(newMembers);
				return;
			} else if (
				(newMessage.name && !newMessage.message) ||
				newMessage.ready
			)
				return;
			const newMessages = [...messages()];
			newMessages.push({
				id: nanoid(),
				name: newMessage.name,
				message: newMessage.message,
				time: newMessage.time,
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

	const sendMessage = (message: string) => {
		time = Date.now();
		ws.send(JSON.stringify({ message: message }));
	};

	const deleteChat = () => {
		ws.send(JSON.stringify({ action: "delete" }));
	};

	return (
		<div class="flex h-0 w-screen grow flex-col">
			<div class="flex h-0 w-screen max-w-lg grow flex-col gap-2 self-center p-4">
				<p class="text-center">
					using cloudflare workers and durable objects
				</p>
				<Show when={pageState() == PageStates.NameInput}>
					<NameForm joinRoom={joinRoom} />
				</Show>

				<Show when={pageState() == PageStates.Chatting}>
					<Messages messages={messages()} username={username()} />
					<MessageForm sendMessage={sendMessage} />
					<ChatMembers members={members()} />

					<div class="flex items-center gap-2">
						<DeleteChat deleteChat={deleteChat} />
						<div>last message sent in {ping()}ms</div>
					</div>
				</Show>
			</div>
		</div>
	);
}
