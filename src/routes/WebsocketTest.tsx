import { createSignal } from "solid-js";

function WebsocketTest() {
	const [name, setName] = createSignal("");
	const [message, setMessage] = createSignal("");

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
			console.log(msg.data);
		});
	};

	const handleNameChange = (e: Event) => {
		const val = (e.target as HTMLInputElement).value;
		setName(val);
	};

	const sendName = () => {
		ws.send(JSON.stringify({ name: name() }));
	};

	const handleMessageChange = (e: Event) => {
		const val = (e.target as HTMLInputElement).value;
		setMessage(val);
	};

	const sendMessage = (e: SubmitEvent) => {
		e.preventDefault();
		ws.send(JSON.stringify({ message: message() }));
		setMessage("");
	};

	return (
		<div>
			<div>
				<form onsubmit={joinRoom}>
					<p>enter your name</p>
					<input
						class="bg-ctp-surface0 p-2 rounded-md"
						type="text"
						value={name()}
						onchange={handleNameChange}
					/>
					<button type="submit">connect</button>
				</form>
				<button onclick={sendName}>join</button>
				<form onsubmit={sendMessage}>
					<input
						class="bg-ctp-surface0 p-2 rounded-md"
						type="text"
						value={message()}
						onchange={handleMessageChange}
					/>
					<button type="submit">send message</button>
				</form>
			</div>
		</div>
	);
}

export default WebsocketTest;
