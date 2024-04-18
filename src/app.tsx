// @refresh reload
import { Router } from "@solidjs/router";
import { Suspense } from "solid-js";
import { FileRoutes } from "@solidjs/start/router";
import Nav from "~/components/Nav";
import "./app.css";

export default function App() {
	return (
		<Router
			root={(props) => (
				<div class={` bg-ctp-base text-ctp-text`}>
					<Nav />
					<Suspense>{props.children}</Suspense>
				</div>
			)}
		>
			<FileRoutes />
		</Router>
	);
}
