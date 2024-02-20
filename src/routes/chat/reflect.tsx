import { ClientID } from "@rocicorp/reflect";
import { Reflect } from "@rocicorp/reflect/client";
import { For, Show, createEffect, createSignal, onMount } from "solid-js";
import {
	ChatMessage,
	Client,
	listClients,
	listMessage,
	listPresentClients,
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
	const [sentMessageID, setSentMessageID] = createSignal("");

	const [messages, setMessages] = createSignal<ChatMessage[]>([]);
	const [pageState, setPageState] = createSignal(0);
	const [members, setMembers] = createSignal<string[]>([]);

	const [presentClientIDs, setPresentClientIDs] = createSignal<
		readonly ClientID[]
	>([]);

	let time: number;

	let r: Reflect<typeof mutators>;
	const initJoin = async (clientName: string) => {
		r = new Reflect({
			server,
			roomID: "myRoom",
			userID: nanoid(),
			mutators,
		});

		r.mutate.addPresentClient({ id: r.clientID, name: clientName });
		r.mutate.initClient({ clientID: r.clientID });

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
		});
	};

	const updateClients = async (clientIDs: ClientID[]) => {
		if (!r) return;
		const clients = await r.query(listPresentClients);
		const names: string[] = [];

		for (let i = 0; i < clients.length; i++) {
			if (clientIDs.find((id) => id == clients[i].id))
				names.push(clients[i].name);
			else r.mutate.deletePresentClient(clients[i].id);
		}

		setMembers(names);
	};

	const sendMessage = async (message: string) => {
		time = Date.now();
		const generatedID = nanoid();
		setSentMessageID(generatedID);
		r.mutate.sendMessage({
			id: generatedID,
			name: username(),
			message: message,
		});
	};

	const joinRoom = async (username: string) => {
		setUsername(username);
		await initJoin(username);
		setPageState(PageStates.Chatting);
	};

	const deleteChat = async () => {
		messages().forEach((message) => {
			r.mutate.deleteMessage(message.id);
		});
	};

	createEffect(() => {
		updateClients(presentClientIDs() as ClientID[]);
	});

	createEffect(() => {
		let newMessages = messages().toReversed();
		if (sentMessageID() !== "" && Date.now() - time > 10) {
			const minimum = newMessages.length > 4 ? 5 : newMessages.length;
			for (let i = 0; i < minimum; i++) {
				if (newMessages[i].id == sentMessageID()) {
					setSentMessageID("");
					setPing(newMessages[i].time - time);
				}
			}
		}
	});

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
