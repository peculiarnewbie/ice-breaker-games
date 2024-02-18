import { MutatorDefs } from "@rocicorp/reflect";
import { Reflect } from "@rocicorp/reflect/client";
import { For, Show, createSignal, onMount } from "solid-js";
import { ChatMessage, mutators } from "../../../reflect/mutators";
import NameForm from "~/components/Chat/NameForm";
import { PageStates } from "~/types";
import { nanoid } from "nanoid";

const server: string | undefined = import.meta.env.VITE_REFLECT_URL;
if (!server) {
	throw new Error("VITE_REFLECT_URL required");
}

export default function () {
	const [inputMessage, setInputMessage] = createSignal("");
	const [chatName, setChatName] = createSignal("");
	const [count, setCount] = createSignal(0);

	const [chatMessages, setChatMessages] = createSignal<ChatMessage[]>([]);
	const [pageState, setPageState] = createSignal(0);

	let r: Reflect<typeof mutators>;
	onMount(() => {
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
		r.subscribe(
			(tx) => tx.get<ChatMessage[]>("chat"),
			//@ts-expect-error
			(data) => setChatMessages(data ?? []),
		);
	});

	const onClick = () => {
		r.mutate.increment({ key: "count", delta: 1 });
	};

	const handleMessageChange = (e: Event) => {
		const val = (e.target as HTMLInputElement).value;
		setInputMessage(val);
	};

	const sendMessage = (e: SubmitEvent) => {
		e.preventDefault();
		r.mutate.appendChat({ name: chatName(), message: inputMessage() });
		setInputMessage("");
	};

	const joinRoom = (username: string) => {
		setChatName(username);
		setPageState(PageStates.Chatting);
	};

	return (
		<div>
			<button onclick={onClick} class="rounded-full bg-ctp-surface0 p-2">
				count: {count()}
			</button>

			<Show when={pageState() == PageStates.NameInput}>
				<NameForm joinRoom={joinRoom} />
			</Show>

			<Show when={pageState() == PageStates.Chatting}>
				<form onsubmit={sendMessage}>
					<input
						class="rounded-md bg-ctp-surface0 p-2"
						type="text"
						value={inputMessage()}
						onchange={handleMessageChange}
					/>
					<button type="submit">send message</button>
				</form>
				<div>
					<For each={chatMessages()}>
						{(message, i) => (
							<div class="flex">
								<div>{message.name}: </div>
								<div>{message.message}</div>
							</div>
						)}
					</For>
				</div>
			</Show>
		</div>
	);
}
