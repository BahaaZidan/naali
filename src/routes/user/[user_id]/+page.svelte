<script lang="ts">
	import VideoCard from '$lib/components/video-card.svelte';

	export let data;
	const videos = data.videos;
	const private_videos = videos.filter((v) => v.publish_status === 'private');
	const public_videos = videos.filter((v) => v.publish_status === 'public');
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

{#if is_own_profile}
	<div class="p-3">
		<h3 class="text-xl font-bold">Private Videos</h3>
		<h4 class="mb-2 text-sm">
			Videos you upload are private by default. You can publish them anytime you want.
		</h4>
		<div class="flex flex-wrap gap-3">
			{#each private_videos as video}
				<VideoCard
					id={video.id}
					name={video.name}
					created_at={video.created_at}
					thumbnail={video.thumbnail}
				/>
			{/each}
		</div>
	</div>
	<div class="divider my-0"></div>
{/if}

<div class="p-3">
	{#if is_own_profile}
		<h3 class="mb-2 text-xl font-bold">Public Videos</h3>
	{/if}
	<div class="flex flex-wrap gap-3">
		{#each public_videos as video}
			<VideoCard
				id={video.id}
				name={video.name}
				created_at={video.created_at}
				thumbnail={video.thumbnail}
			/>
		{/each}
	</div>
</div>
