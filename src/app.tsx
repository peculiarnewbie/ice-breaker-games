// @refresh reload
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start";
import { Suspense, createSignal } from "solid-js";
import Nav from "~/components/Nav";
import "./app.css";

export default function App() {
	return (
		<Router
			root={(props) => (
				<div class={` text-ctp-text bg-ctp-base`}>
					<Nav />
					<Suspense>{props.children}</Suspense>
				</div>
			)}
		>
			<FileRoutes />
		</Router>
	);
}
