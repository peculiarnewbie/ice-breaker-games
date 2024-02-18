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
			class="flex flex-col w-48 mx-auto items-center p-4 gap-2"
			onsubmit={joinRoom}
		>
			<p>enter your name</p>
			<input
				name="name"
				class="bg-ctp-surface0 p-2 rounded-md"
				type="text"
				value={name()}
				onchange={handleNameChange}
			/>
			<button
				class=" bg-ctp-blue/20 p-2 w-24 rounded-md hover:border-ctp-blue border border-ctp-surface0"
				type="submit"
			>
				join
			</button>
		</form>
	);
}
