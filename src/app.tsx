// @refresh reload
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start";
import { Suspense, createSignal } from "solid-js";
import Nav from "~/components/Nav";
import "./app.css";

export default function App() {
	const [darkTheme, setDarkTheme] = createSignal(false);
	return (
		<Router
			root={(props) => (
				<div
					class={` text-ctp-text bg-ctp-base ${
						darkTheme() ? "ctp-mocha dark" : "ctp-latte"
					}`}
				>
					<Nav
						darkTheme={darkTheme()}
						setDarkTheme={(dark: boolean) => {
							setDarkTheme(dark);
						}}
					/>
					<Suspense>{props.children}</Suspense>
				</div>
			)}
		>
			<FileRoutes />
		</Router>
	);
}
