import { Show, createSignal } from "solid-js";

export default function DeleteChat(props: { deleteChat: () => void }) {
	const [deleteDialog, setDeleteDialog] = createSignal(false);

	const deleteChat = () => {
		setDeleteDialog(true);
	};

	return (
		<div>
			<button onclick={deleteChat} class=" rounded-md bg-ctp-red p-2">
				delete chat
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
							<button class=" rounded-md bg-ctp-red p-2">
								<p class=" ctp-mocha text-ctp-text">delete</p>
							</button>
						</div>
					</div>
				</div>
			</Show>
		</div>
	);
}
