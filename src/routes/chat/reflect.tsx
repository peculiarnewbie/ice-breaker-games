import { MutatorDefs } from "@rocicorp/reflect";
import { Reflect } from "@rocicorp/reflect/client";
import { createSignal, onMount } from "solid-js";
import { mutators } from "~/components/reflect-chat/mutators";

export default function () {
	let r: Reflect<typeof mutators>;
	onMount(() => {
		r = new Reflect({
			server: "http://localhost:8080",
			roomID: "myRoom",
			userID: crypto.randomUUID(),
			mutators,
		});
		r.subscribe(
			(tx) => tx.get<number>("count"),
			(data) => setCount(data ?? 0)
		);
	});
	const [count, setCount] = createSignal(0);

	const onClick = () => {
		r.mutate.increment(1);
	};

	return (
		<div>
			<button onclick={onClick} class="bg-ctp-surface0 p-2 rounded-full">
				count: {count()}
			</button>
		</div>
	);
}
