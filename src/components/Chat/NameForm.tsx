import { createSignal } from "solid-js";

export default function NameForm(props: { joinRoom: (name: string) => void }) {
	const [name, setName] = createSignal("");

	const handleNameChange = (e: Event) => {
		const value = (e.target as HTMLInputElement).value;
		setName(value);
	};

	const joinRoom = (e: SubmitEvent) => {
		e.preventDefault();
		const formEl = e.target as HTMLFormElement;
		const formData = new FormData(formEl);

		console.log(formData.get("name"));

		props.joinRoom(formData.get("name") as string);
	};

	return (
		<form
			class="mx-auto flex w-48 flex-col items-center gap-2 p-4 text-center"
			onsubmit={joinRoom}
		>
			<p>enter your name</p>
			<input
				name="name"
				class="rounded-md bg-ctp-surface0 p-2 text-center"
				type="text"
				value={name()}
				onchange={handleNameChange}
				placeholder="your name"
			/>
			<button
				class=" w-24 rounded-md border border-ctp-surface0 bg-ctp-blue/20 p-2 hover:border-ctp-blue"
				type="submit"
			>
				join
			</button>
		</form>
	);
}
