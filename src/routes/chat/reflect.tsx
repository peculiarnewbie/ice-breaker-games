import { MutatorDefs } from "@rocicorp/reflect";
import { Reflect } from "@rocicorp/reflect/client";
import { For, createSignal, onMount } from "solid-js";
import { ChatMessage, mutators } from "../../../reflect/mutators";

const server: string | undefined = import.meta.env.VITE_REFLECT_URL;
if (!server) {
	throw new Error("VITE_REFLECT_URL required");
}

export default function () {
	const [inputMessage, setInputMessage] = createSignal("");
	const [chatName, setChatName] = createSignal("");
	const [count, setCount] = createSignal(0);

	const [chatMessages, setChatMessages] = createSignal<ChatMessage[]>([]);

	let r: Reflect<typeof mutators>;
	onMount(() => {
		r = new Reflect({
			server,
			roomID: "myRoom",
			userID: crypto.randomUUID(),
			mutators,
		});
		r.subscribe(
			(tx) => tx.get<number>("count"),
			(data) => setCount(data ?? 0)
		);
		r.subscribe(
			(tx) => tx.get<ChatMessage[]>("chat"),
			(data) => setChatMessages(data ?? [])
		);
	});

	const onClick = () => {
		r.mutate.increment({ key: "count", delta: 1 });
	};

	const handleMessageChange = (e: Event) => {
		const val = (e.target as HTMLInputElement).value;
		setInputMessage(val);
	};

	const handleNameChange = (e: Event) => {
		const val = (e.target as HTMLInputElement).value;
		setChatName(val);
	};

	const sendMessage = (e: SubmitEvent) => {
		e.preventDefault();
		r.mutate.appendChat({ name: chatName(), message: inputMessage() });
		setInputMessage("");
	};

	return (
		<div>
			<button onclick={onClick} class="bg-ctp-surface0 p-2 rounded-full">
				count: {count()}
			</button>

			<div>name</div>
			<input type="text" value={chatName()} onchange={handleNameChange} />

			<form onsubmit={sendMessage}>
				<input
					class="bg-ctp-surface0 p-2 rounded-md"
					type="text"
					value={inputMessage()}
					onchange={handleMessageChange}
				/>
				<button type="submit">send message</button>
			</form>
			<div>
				<For each={chatMessages()}>
					{(message, i) => <div>{message.message}</div>}
				</For>
			</div>
		</div>
	);
}
