<script lang="ts">
	import VideoCard from '$lib/components/video-card.svelte';

	export let data;
	const videos = data.videos;
	const user = data.user;
	const is_own_profile = data.is_own_profile;
</script>

<div class="flex w-full gap-3 p-3">
	<div class="avatar">
		<div class="w-28 rounded-full">
			<img src={user.image} alt="User avatar" />
		</div>
	</div>
	<div class="flex flex-col gap-1">
		<p class="font-bold">{user.name}</p>
		<p>{user.email}</p>
		{#if !is_own_profile}
			<div class="flex gap-2">
				<button class="btn btn-sm">follow</button>
				<button class="btn btn-sm">support</button>
			</div>
		{/if}
	</div>
</div>

<div class="divider my-0"></div>
{#if videos}
	<div class="flex flex-wrap gap-3 p-3">
		{#each videos as video}
			<VideoCard
				id={video.id}
				name={video.name}
				created_at={video.created_at}
				thumbnail={video.thumbnail}
			/>
		{/each}
	</div>
{/if}
