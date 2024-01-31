<script lang="ts">
	import { parseIsoDurationString } from '$lib/utils/date';
	import { formatDistanceToNow, formatISODuration } from 'date-fns';
	import InfoCircleIcon from 'virtual:icons/tabler/info-circle';

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
		creator?: { id?: string | null; name?: string | null; handle?: string | null; image?: string | null; } | null
	}[] | undefined | null;

	function formatSeconds(seconds: number) {
		const isoDuration = formatISODuration({ seconds });
		const parsed = parseIsoDurationString(isoDuration);
		const base = `${parsed.minutes}:${Math.trunc(parsed.seconds || 0)}`;
		if (parsed.hours) return `${parsed.hours}:${base}`;
		return base;
	}

	function showRepostsModal() {
		// @ts-expect-error ts can't narrow the types to dialog element
		document.getElementById(`reposts_modal_${id}`)?.showModal?.();
	}
</script>

<div class="w-64 max-w-64 flex flex-col gap-1 group">
	<a href="/video/{id}" class="relative h-36 w-full rounded-sm bg-black">
		<img class="h-36 w-64 object-contain" src={thumbnail} alt="" />
		<div class="absolute bottom-1 right-2 bg-black bg-opacity-40 text-white">
			{formatSeconds(duration)}
		</div>
	</a>
	<div class="flex gap-2">
		{#if creator?.image}
			<a href="/{creator.handle || creator.id}" class="avatar">
				<div class="size-11 rounded-full">
					<img src={creator.image} alt={creator.name} />
				</div>
			</a>
		{/if}
		<div class="text-md flex flex-col leading-tight tracking-tighter flex-1">
			<a href="/video/{id}" class="text-black dark:text-white line-clamp-2">{name}</a>
			{#if creator}
				<a href="/{creator.handle || creator.id}" class="text-gray-400">{creator.name}</a>
			{/if}
			{#if createdAt}
				<div class="text-gray-400">{formatDistanceToNow(createdAt, { addSuffix: true })}</div>
			{/if}
		</div>
		{#if posts && posts.length > 1}
			<div class="tooltip opacity-0 group-hover:opacity-100" data-tip="Why is this in my feed ?">
				<button class="btn btn-ghost btn-sm" on:click|preventDefault|stopPropagation={showRepostsModal}>
					<InfoCircleIcon />
				</button>
			</div>
			<dialog id="reposts_modal_{id}" class="modal">
				<div class="modal-box">
					<h3 class="font-bold text-lg">Why is this in my feed ?</h3>
					<div class="py-4 flex flex-col gap-2">
						{#each posts as p}
							<div class="flex gap-2">
								<img
									src={p.creator?.image}
									alt="{p.creator?.name} profile picture"
									class="h-6 w-6 rounded-full"
								/>
								<p>
									<a class="link-hover" href="/{p.creator?.handle || p.creator?.id}">{p.creator?.name}</a>
									shared this video {p.createdAt &&
								formatDistanceToNow(p.createdAt, { addSuffix: true })}
								</p>
							</div>
						{/each}
					</div>
					<div class="modal-action">
						<form method="dialog">
							<button class="btn" on:click>Close</button>
						</form>
					</div>
				</div>
			</dialog>
		{/if}
	</div>
</div>
