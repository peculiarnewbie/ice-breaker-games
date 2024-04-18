import { A } from "@solidjs/router";
import Counter from "~/components/Counter";

export default function Home() {
	return (
		<main class="mx-auto p-4 text-center text-gray-700">
			<p>chat using:</p>
			<p class="my-4">
				<A href="/chat/workers" class="text-sky-600 hover:underline">
					Workers
				</A>
				{" - "}
				<A href="/chat/reflect" class="text-sky-600 hover:underline">
					Reflect
				</A>{" "}
			</p>
		</main>
	);
}
