import { useLocation } from "@solidjs/router";
import { moon, sun, github } from "./Icons";

export default function Nav(props: {
	darkTheme: boolean;
	setDarkTheme: (dark: boolean) => void;
}) {
	const location = useLocation();
	const active = (path: string) =>
		path == location.pathname
			? "border-ctp-blue"
			: "border-transparent hover:border-ctp-blue";
	return (
		<nav class="bg-ctp-crust flex">
			<ul class="container flex items-center p-3 ">
				<li class={`border-b-2 ${active("/")} mx-1.5 sm:mx-3`}>
					<a href="/">Home</a>
				</li>
				<li class={`border-b-2 ${active("/chat")} mx-1.5 sm:mx-3`}>
					<a href="/chat">Chat</a>
				</li>
			</ul>
			<div class="flex gap-4 items-center px-3">
				<button
					class=" flex items-center rounded-full bg-ctp-base border border-ctp-surface0 hover:border-ctp-blue w-12 h-8"
					onClick={() => props.setDarkTheme(!props.darkTheme)}
				>
					<div
						class={` flex px-1 transition-all h-8 justify-end ${
							props.darkTheme ? "w-8" : "w-12"
						} `}
					>
						<div class=" flex justify-center items-center scale-75">
							{props.darkTheme ? moon : sun}
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
