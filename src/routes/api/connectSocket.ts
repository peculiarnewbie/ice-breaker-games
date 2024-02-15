export async function GET({ request }) {
	const upgradeHeader = request.headers.get("Upgrade");
	if (!upgradeHeader || upgradeHeader !== "websocket") {
		return new Response("Expected Upgrade: websocket", { status: 426 });
	}

	const webSocketPair = new WebSocketPair();
	const [client, server] = Object.values(webSocketPair);
	server.accept();
	let num = 0;
	server.addEventListener("message", (event) => {
		num++;
		const message = event.data + `${num} from server`;
		server.send(message);
	});

	return new Response(null, {
		status: 101,
		webSocket: client,
	});
}
