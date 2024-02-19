import { Show, createSignal } from "solid-js";
import { darkThemeStore } from "../Nav";

export default function DeleteChat(props: { deleteChat: () => void }) {
	const [deleteDialog, setDeleteDialog] = createSignal(false);
	const { darkTheme } = darkThemeStore;

	const deleteChat = () => {
		setDeleteDialog(true);
	};

	return (
		<div>
			<button onclick={deleteChat} class=" rounded-md bg-ctp-red p-2">
				<p
					class={`text-ctp-text ${darkTheme() ? "ctp-latte" : "ctp-mocha"}`}
				>
					delete chat
				</p>
			</button>
			<Show when={deleteDialog()}>
				<div class=" fixed left-0 top-0 flex h-screen w-screen items-center justify-center bg-black/50">
					<div class=" flex flex-col gap-2 rounded-md bg-ctp-surface0 p-4 px-8 text-center">
						<p>delete chat?</p>
						<div class="flex gap-2">
							<button
								class="rounded-md bg-ctp-surface2 p-2"
								onclick={() => setDeleteDialog(false)}
							>
								cancel
							</button>
							<button
								onclick={() => {
									props.deleteChat();
									setDeleteDialog(false);
								}}
								class={` rounded-md bg-ctp-red p-2`}
							>
								<p
									class={` ${darkTheme() ? "ctp-latte" : "ctp-mocha"}`}
								>
									<span class="text-ctp-text">delete</span>
								</p>
							</button>
						</div>
					</div>
				</div>
			</Show>
		</div>
	);
}
