import { For, Show } from "solid-js";
import { ChatMessage } from "../../../reflect/mutators";
import dayjs from "dayjs";

export default function Messages(props: {
	messages: ChatMessage[];
	username: string;
}) {
	return (
		<div class="min-h-0 grow overflow-auto rounded-md bg-ctp-surface0">
			<div class="flex flex-col gap-1 p-4">
				<For each={props.messages}>
					{(message, i) => (
						<div
							data-self={message.name == props.username ?? "true"}
							class={`group flex w-full flex-col items-start gap-[2px] self-start data-[self=true]:items-end data-[self=true]:self-end `}
						>
							<Show
								when={
									props.messages[i() - 1]?.name !=
									message.name
								}
							>
								<div class="flex items-end gap-2 pt-2 group-data-[self=true]:flex-row-reverse">
									<div class=" text-lg font-medium">
										{message.name}
									</div>
									<div class=" text-xs text-ctp-subtext1">
										{dayjs(message.time).format("HH:mm")}
									</div>
								</div>
							</Show>
							<div class=" min-w-0 max-w-[75%] rounded-md bg-ctp-crust p-2 group-data-[self=true]:bg-ctp-blue/20">
								{message.message}
							</div>
						</div>
					)}
				</For>
			</div>
		</div>
	);
}
