<script lang="ts">
	import { parseIsoDurationString } from '$lib/utils/date';
	import { formatDistanceToNow, formatISODuration } from 'date-fns';

	export let id: string;
	export let name: string;
	export let thumbnail: string;
	export let duration: number;
	export let createdAt: Date | undefined | null;
	export let creator: {
		id?: string | null;
		handle?: string | null;
		name?: string | null;
		image?: string | null;
	} | undefined | null;
	export let posts: {
		id?: string | null;
		caption?: string | null;
		createdAt?: Date | null;
		creator?: { id?: string | null; name?: string | null; handle?: string | null; } | null
	}[] | undefined | null;

	function formatSeconds(seconds: number) {
		const isoDuration = formatISODuration({ seconds });
		const parsed = parseIsoDurationString(isoDuration);
		const base = `${parsed.minutes}:${Math.trunc(parsed.seconds || 0)}`;
		if (parsed.hours) return `${parsed.hours}:${base}`;
		return base;
	}
</script>

<a href="/video/{id}" class="w-64 max-w-64 flex flex-col gap-1">
	<div class="relative h-36 w-full rounded-sm bg-black">
		<img class="h-36 w-64 object-contain" src={thumbnail} alt="" />
		<div class="absolute bottom-1 right-2 bg-black bg-opacity-40 text-white">
			{formatSeconds(duration)}
		</div>
	</div>
	<div class="flex gap-2">
		{#if creator?.image}
			<a href="/{creator.handle || creator.id}">
				<img src={creator.image} alt={creator.name} class="w-11 object-fill rounded-full" />
			</a>
		{/if}
		<div class="text-md flex flex-col leading-tight tracking-tighter">
			<div class="text-black dark:text-white line-clamp-2">{name}</div>
			{#if creator}
				<a href="/{creator.handle || creator.id}" class="text-gray-400">{creator.name}</a>
			{/if}
			{#if createdAt}
				<div class="text-gray-400">{formatDistanceToNow(createdAt, { addSuffix: true })}</div>
			{/if}
		</div>
	</div>
</a>
