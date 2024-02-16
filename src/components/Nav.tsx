import { useLocation } from "@solidjs/router";
import { moon, sun, github } from "./Icons";
import { createEffect, createSignal } from "solid-js";

export default function Nav(props: {}) {
	const location = useLocation();
	const active = (path: string) =>
		path == location.pathname
			? "border-ctp-blue"
			: "border-transparent hover:border-ctp-blue";

	const [darkTheme, setDarkTheme] = createSignal(false);

	createEffect(() => {
		if (darkTheme()) document.body.className = "bg-ctp-base ctp-mocha dark";
		else document.body.className = "bg-ctp-base ctp-latte";
	});

	return (
		<nav class="bg-ctp-crust flex">
			<ul class="container flex items-center p-3 ">
				<li class={`border-b-2 ${active("/")} mx-1.5 sm:mx-3`}>
					<a href="/">Home</a>
				</li>
				<li
					class={`border-b-2 ${active(
						"/chat/workers"
					)} mx-1.5 sm:mx-3`}
				>
					<a href="/chat/workers">Chat</a>
				</li>
			</ul>
			<div class="flex gap-4 items-center px-3">
				<button
					class=" flex items-center rounded-full bg-ctp-base border border-ctp-surface0 hover:border-ctp-blue w-12 h-8"
					onClick={() => setDarkTheme(!darkTheme())}
				>
					<div
						class={` flex px-1 transition-all h-8 justify-end ${
							darkTheme() ? "w-8" : "w-12"
						} `}
					>
						<div class=" flex justify-center items-center scale-75">
							{darkTheme() ? moon : sun}
						</div>
					</div>
				</button>
				<div class="h-8 w-[2px] bg-ctp-surface0 rounded-full" />
				<a
					target="_blank"
					href="https://github.com/peculiarnewbie/ice-breaker-games"
					class="bg-ctp-surface0 rounded-full p-1 border-ctp-surface0 hover:border-ctp-blue border"
				>
					<div class="scale-75">{github}</div>
				</a>
			</div>
		</nav>
	);
}
