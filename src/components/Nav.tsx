import { useLocation } from "@solidjs/router";
import { moon, sun, github } from "./Icons";
import { createEffect, createRoot, createSignal } from "solid-js";

const createDarkTheme = () => {
	const [darkTheme, setDarkTheme] = createSignal(false);
	return { darkTheme, setDarkTheme };
};

export const darkThemeStore = createRoot(createDarkTheme);

export default function Nav(props: {}) {
	const location = useLocation();
	const active = (path: string) =>
		path == location.pathname
			? "border-ctp-blue"
			: "border-transparent hover:border-ctp-blue";

	const { darkTheme, setDarkTheme } = darkThemeStore;

	createEffect(() => {
		if (darkTheme()) document.body.className = "bg-ctp-base ctp-mocha dark";
		else document.body.className = "bg-ctp-base ctp-latte";
	});

	return (
		<nav class="flex justify-between bg-ctp-crust">
			<ul class="container flex items-center p-3 ">
				<li class={`border-b-2 ${active("/")} mx-1.5 sm:mx-3`}>
					<a href="/">Home</a>
				</li>
				<li
					class={`border-b-2 ${active(
						"/chat/workers",
					)} mx-1.5 sm:mx-3`}
				>
					<a href="/chat/workers">Chat</a>
				</li>
			</ul>
			<div class="flex items-center gap-4 px-3">
				<button
					class=" flex h-8 w-12 items-center rounded-full border border-ctp-surface0 bg-ctp-base hover:border-ctp-blue"
					onClick={() => setDarkTheme(!darkTheme())}
				>
					<div
						class={` flex h-8 justify-end px-1 transition-all ${
							darkTheme() ? "w-8" : "w-12"
						} `}
					>
						<div class=" flex scale-75 items-center justify-center">
							{darkTheme() ? moon : sun}
						</div>
					</div>
				</button>
				<div class="h-8 w-[2px] rounded-full bg-ctp-surface0" />
				<a
					target="_blank"
					href="https://github.com/peculiarnewbie/ice-breaker-games"
					class="rounded-full border border-ctp-surface0 bg-ctp-surface0 p-1 hover:border-ctp-blue"
				>
					<div class="scale-75">{github}</div>
				</a>
			</div>
		</nav>
	);
}
