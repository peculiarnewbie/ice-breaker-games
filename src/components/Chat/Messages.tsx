import { For } from "solid-js";
import { ChatMessage } from "../../../reflect/mutators";

export default function Messages(props: {
	messages: ChatMessage[];
	username: string;
}) {
	return (
		<div class="min-h-0 grow overflow-auto rounded-md bg-ctp-surface0">
			<div class="flex flex-col gap-4 p-4">
				<For each={props.messages}>
					{(message) => (
						<div
							data-self={message.name == props.username ?? "true"}
							class={`group flex w-full flex-col items-start gap-1 self-start data-[self=true]:items-end data-[self=true]:self-end`}
						>
							<div class="flex group-data-[self=true]:flex-row-reverse">
								<div class=" text-lg font-medium">
									{message.name}
								</div>
								<div>{message.time}</div>
							</div>
							<div class=" min-w-0 max-w-[75%] rounded-md bg-ctp-crust p-2">
								{message.message}
							</div>
						</div>
					)}
				</For>
			</div>
		</div>
	);
}
