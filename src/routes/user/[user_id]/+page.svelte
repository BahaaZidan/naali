<script lang="ts">
	import VideoCard from '$lib/components/video-card.svelte';
	import { enhance } from '$app/forms';

	export let data;
	$: videos = data.videos;
	$: user = data.user;
	$: is_own_profile = data.is_own_profile;
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
				{#if data.is_followed}
					<form method="post" action="?/unfollow" use:enhance>
						<input type="hidden" value={user.id} name="id" />
						<button class="btn btn-sm" type="submit">Unfollow</button>
					</form>
				{:else}
					<form method="post" action="?/follow" use:enhance>
						<input type="hidden" value={user.id} name="id" />
						<button class="btn btn-sm" type="submit">Follow</button>
					</form>
				{/if}
				<button class="btn btn-sm">Sponsor</button>
			</div>
		{:else}
			<div class="flex gap-2">
				<a class="btn btn-sm" href="/studio">Edit profile</a>
				<a class="btn btn-sm" href="/studio/videos">Manage videos</a>
			</div>
		{/if}
	</div>
</div>
<div class="divider my-0"></div>

<div class="p-3">
	<div class="flex flex-wrap gap-3">
		{#each videos as video}
			<VideoCard
				id={video.id}
				duration={video.duration}
				name={video.name}
				createdAt={video.createdAt}
				thumbnail={video.thumbnail}
			/>
		{/each}
	</div>
</div>
