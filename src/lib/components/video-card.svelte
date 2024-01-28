<script lang="ts">
	import { parseIsoDurationString } from '$lib/utils/date';
	import { formatDistanceToNow, formatISODuration } from 'date-fns';

	export let id: string;
	export let name: string;
	export let thumbnail: string;
	export let duration: number;
	export let createdAt: Date | undefined | null;

	function formatSeconds(seconds: number) {
		const isoDuration = formatISODuration({ seconds });
		const parsed = parseIsoDurationString(isoDuration);
		const base = `${parsed.minutes}:${Math.trunc(parsed.seconds || 0)}`;
		if (parsed.hours) return `${parsed.hours}:${base}`;
		return base;
	}
</script>

<a class="w-64" href="/video/{id}">
	<div class="relative h-36 w-full rounded-sm bg-black">
		<img class="h-36 w-64 object-contain" src={thumbnail} alt="" />
		<div class="absolute bottom-1 right-2 bg-black bg-opacity-40 text-white">
			{formatSeconds(duration)}
		</div>
	</div>
	<div class="text-md flex flex-col leading-tight tracking-tighter">
		<div class="overflow-hidden overflow-ellipsis text-black dark:text-white">{name}</div>
		<!-- <div class="mt-1 flex items-baseline space-x-1">
			<div class="text-gray-400">the bootleg boy</div>
			<div class="h-3 w-3 pt-0.5">
				<svg viewBox="0 0 24 24" class="text-gray-400" fill="currentColor">
					<g
						><path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10 S17.52,2,12,2z M9.92,17.93l-4.95-4.95l2.05-2.05l2.9,2.9l7.35-7.35l2.05,2.05L9.92,17.93z"
						></path></g
					>
				</svg>
			</div>
		</div> -->
		{#if createdAt}
			<div class="text-gray-400">{formatDistanceToNow(createdAt, { addSuffix: true })}</div>
		{/if}
		<!-- <div
			class="mt-1 w-max rounded-sm border border-red-500 px-1 py-0.5 text-xs font-bold tracking-wide text-red-600"
		>
			LIVE NOW
		</div> -->
	</div>
</a>
