<script lang="ts">
	import VideoCard from '$lib/components/video-card.svelte';
	import { enhance } from '$app/forms';
	import InfoCircleIcon from 'virtual:icons/tabler/info-circle';
	import { tick } from 'svelte';

	const limit = 20;
	export let data;
	$: user = data.user;
	$: is_own_profile = data.is_own_profile;
	type MappedVideos = NonNullable<typeof data.videos>;
	let loaded: MappedVideos = [];
	$: videos = (data.videos || []).concat(loaded);

	let noMore = false;
	let loadingMore = false;

	async function loadMore() {
		loadingMore = true;
		const offset = videos.length;
		try {
			const result = await fetch(`/api/users/${user.id}/videos?limit=${limit}&offset=${offset}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});
			const videosResult = (await result.json())?.videos as MappedVideos;
			console.log({ videosResult });
			loaded = loaded.concat(videosResult);
			noMore = videosResult.length < limit;
			await tick();
			if (videosResult[0]?.id)
				document.getElementById(videosResult[0].id)?.scrollIntoView({ behavior: 'smooth' });
		} catch (e) {
			noMore = true;
		} finally {
			loadingMore = false;
		}
	}
</script>

{#if !user.handle}
	<div role="alert" class="alert">
		<InfoCircleIcon />
		<span>You need to set your @handle in <a href="/studio" class="link-hover">settings.</a></span>
	</div>
{/if}

<div class="flex w-full gap-3 p-3">
	<div class="avatar">
		<div class="w-28 rounded-full">
			<img src={user.image} alt="User avatar" />
		</div>
	</div>
	<div class="flex flex-col gap-1">
		<p class="font-bold">{user.name}</p>
		{#if user.handle}<p>@{user.handle}</p>{/if}
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
<div class="m-3">
	{#if noMore}
		<div class="text-lg">No more videos!</div>
	{:else}
		<button class="btn btn-lg" on:click={loadMore} disabled={loadingMore}>Load more</button>
	{/if}
</div>
