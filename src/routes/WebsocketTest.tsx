function WebsocketTest() {
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

	const sendMessage = () => {
		ws.send(JSON.stringify({ name: "bolt" }));
	};

	return (
		<div>
			<div>
				<form onsubmit={joinRoom}>
					<p>enter room name</p>
					<input class="bg-ctp-surface0 p-2 rounded-md" type="text" />
					<button type="submit">join</button>
				</form>
				<button onclick={sendMessage}>send message</button>
			</div>
		</div>
	);
}

export default WebsocketTest;
