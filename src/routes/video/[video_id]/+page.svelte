<script lang="ts">
	import ThumbUpIcon from 'virtual:icons/tabler/thumb-up';
	import ThumbUpFilledIcon from 'virtual:icons/tabler/thumb-up-filled';
	import ThumbDownIcon from 'virtual:icons/tabler/thumb-down';
	import ThumbDownFilledIcon from 'virtual:icons/tabler/thumb-down-filled';
	import ShareIcon from 'virtual:icons/tabler/share';
	import SendIcon from 'virtual:icons/tabler/send';
	import { enhance } from '$app/forms';

	export let data;
	$: ({ video } = data);
</script>

<main>
	<div class="h-[63vh] min-h-[400px] w-full">
		<iframe
			title="video"
			src={video.stream_url}
			class="h-full w-full border-none"
			allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
			allowfullscreen={true}
		></iframe>
	</div>
	<div class="flex flex-col gap-2 px-4 py-2">
		<h2 class="text-2xl md:text-3xl">{video.name}</h2>
		<div class="flex flex-col gap-2 md:flex-row md:justify-between">
			<div class="flex gap-2">
				<div class="avatar">
					<div class="w-16 rounded-full">
						<img src={video.creator.image} alt="video creator pp" />
					</div>
				</div>
				<div class="flex flex-col">
					<div class="line-clamp-1 text-lg">{video.creator.name}</div>
					<div class="line-clamp-1 text-xs">1,000 Followers</div>
				</div>
				{#if video.isOwn}
					<a href="/studio/videos/{video.id}" class="btn">Edit video</a>
				{:else}
					<button class="btn">Follow</button>
					<button class="btn">Sponsor</button>
				{/if}
			</div>
			<div class="flex gap-2">
				<div class="flex">
					<form method="post" action="?/like" use:enhance>
						<input type="hidden" value={video.id} name="id" />
						<input type="hidden" value={video.like === true ? 'delete' : 'true'} name="value" />
						<button class="btn rounded-e-none" type="submit" disabled={video.isOwn}>
							{#if video.like === true}
								<ThumbUpFilledIcon class="size-5" />
							{:else}
								<ThumbUpIcon class="size-5" />
							{/if}
						</button>
					</form>
					<form method="post" action="?/like" use:enhance>
						<input type="hidden" value={video.id} name="id" />
						<input type="hidden" value={video.like === false ? 'delete' : 'false'} name="value" />
						<button class="btn rounded-s-none" type="submit" disabled={video.isOwn}>
							{#if video.like === false}
								<ThumbDownFilledIcon class="size-5" />
							{:else}
								<ThumbDownIcon class="size-5" />
							{/if}
						</button>
					</form>
				</div>
				<button class="btn">
					<ShareIcon class="size-5" />
					Repost
				</button>
				<button class="btn">
					<SendIcon class="size-5" />
					Send
				</button>
			</div>
		</div>
	</div>
</main>
