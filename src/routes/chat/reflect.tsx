import { ClientID } from "@rocicorp/reflect";
import { Reflect } from "@rocicorp/reflect/client";
import { For, Show, createEffect, createSignal, onMount } from "solid-js";
import {
	ChatMessage,
	Client,
	listClients,
	listMessage,
	mutators,
} from "../../../reflect/mutators";
import NameForm from "~/components/Chat/NameForm";
import { PageStates } from "~/types";
import { nanoid } from "nanoid";
import Messages from "~/components/Chat/Messages";
import MessageForm from "~/components/Chat/MessageForm";
import ChatMembers from "~/components/Chat/ChatMembers";
import DeleteChat from "~/components/Chat/DeleteChat";

const server: string | undefined = import.meta.env.VITE_REFLECT_URL;
if (!server) {
	throw new Error("VITE_REFLECT_URL required");
}

export default function () {
	const [username, setUsername] = createSignal("");
	const [count, setCount] = createSignal(0);
	const [ping, setPing] = createSignal(0);

	const [messages, setMessages] = createSignal<ChatMessage[]>([]);
	const [pageState, setPageState] = createSignal(0);
	const [members, setMembers] = createSignal<string[]>([]);

	const [presentClientIDs, setPresentClientIDs] = createSignal<
		readonly ClientID[]
	>([]);

	let time: number;

	let r: Reflect<typeof mutators>;
	// let presentClientIDs: readonly ClientID[] = [];
	const initJoin = async () => {
		r = new Reflect({
			server,
			roomID: "myRoom",
			userID: nanoid(),
			mutators,
		});
		r.subscribe(
			(tx) => tx.get<number>("count"),
			(data) => setCount(data ?? 0),
		);
		r.subscribe(listMessage, (data) => {
			const sorted = data.sort((a, b) => (a.time ?? 0) - (b.time ?? 0));
			setMessages(sorted);
		});

		r.subscribeToPresence((clientIDs) => {
			setPresentClientIDs(clientIDs);
			console.log("present", clientIDs);
			updateClients();
			// presentClientIDs = clientIDs;
		});

		// r.subscribe(
		// 	async (tx) => {
		// 		const result: Record<ClientID, Client> = {};
		// 		for (const client of await listClients(tx)) {
		// 			result[client.clientID] = client;
		// 		}
		// 		return result;
		// 	},
		// 	(result) => {
		// 		const IDs = Object.keys(result);
		// 		const names: string[] = [];
		// 		presentClientIDs().forEach((presentID) => {
		// 			const index = IDs.findIndex((id) => id == presentID);
		// 			if (index) names.push(result[IDs[index]].name);
		// 		});
		// 		setMembers(names);
		// 	},
		// );

		// r.subscribe(listClients, (result) => {
		// 	const names: string[] = [];
		// 	result.forEach((client) => {
		// 		names.push(client.name);
		// 	});
		// 	setMembers(names);
		// });
	};

	const updateClients = async () => {
		const presentClients = presentClientIDs() as ClientID[];
		const clients = await r.query(listClients);
		const names: string[] = [];
		console.log("updating", clients, presentClients);
		presentClients.forEach((presentID) => {
			const index = clients.findIndex((id) => id.clientID == presentID);
			if (index) names.push(clients[index].name);
		});
		setMembers(names);
	};

	const onClick = () => {
		r.mutate.increment({ key: "count", delta: 1 });
	};

	const sendMessage = async (message: string) => {
		time = Date.now();
		r.mutate.sendMessage({
			id: nanoid(),
			name: username(),
			message: message,
			time: Date.now(),
		});
	};

	const joinRoom = async (username: string) => {
		setUsername(username);
		await initJoin();
		r.mutate.initClient({ clientID: r.clientID, name: username });
		// r.mutate.addClient({ clientID: r.clientID, name: username });
		setPageState(PageStates.Chatting);
	};

	const deleteChat = async () => {
		messages().forEach((message) => {
			r.mutate.deleteMessage(message.id);
		});
	};

	return (
		<div class="flex h-0 w-screen grow flex-col">
			<div class="flex h-0 w-screen max-w-lg grow flex-col gap-2 self-center p-4">
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
