import { createSignal } from "solid-js";

export default function MessageForm(props: {
	sendMessage: (message: string) => void;
}) {
	const [inputMessage, setInputMessage] = createSignal("");

	const sendMessage = (e: SubmitEvent) => {
		e.preventDefault();
		props.sendMessage(inputMessage());
		setInputMessage("");
	};

	const handleMessageChange = (e: Event) => {
		const val = (e.target as HTMLInputElement).value;
		setInputMessage(val);
	};

	return (
		<form class="flex w-full gap-2" onsubmit={sendMessage}>
			<input
				class="w-0 grow rounded-md bg-ctp-surface0 p-2"
				placeholder="type your message"
				type="text"
				value={inputMessage()}
				onchange={handleMessageChange}
			/>
			<button type="submit" class="rounded-md bg-ctp-blue/20 p-2">
				send
			</button>
		</form>
	);
}
