import { For } from "solid-js";

export default function ChatMembers(props: { members: string[] }) {
	return (
		<div class="flex flex-col">
			online members:
			<div>
				<For each={props.members}>
					{(member, i) => <span>{`${i() + 1}. ${member} `}</span>}
				</For>
			</div>
		</div>
	);
}
