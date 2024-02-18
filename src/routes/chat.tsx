import type { RouteSectionProps } from "@solidjs/router";

export default function UsersLayout(props: RouteSectionProps) {
	return (
		<div class="absolute top-0 -z-10 flex h-svh w-screen flex-col">
			<div class=" h-12"></div>
			{/* insert the child route */ props.children}
		</div>
	);
}
