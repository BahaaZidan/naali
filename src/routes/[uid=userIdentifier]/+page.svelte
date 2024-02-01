<script lang="ts">
	import VideoCard from '$lib/components/video-card.svelte';
	import { tick } from 'svelte';
	import { VIDEOS_IN_PROFILE_LIMIT } from '$lib/constants';

	export let data;
	$: user = data.user;

	type MappedVideos = NonNullable<typeof data.videos>;
	$: loaded = data.videos;
	$: paginationDone = loaded && loaded.length < VIDEOS_IN_PROFILE_LIMIT;
	let loadingMore = false;
	$: videos = (data.videos || []);

	async function loadMore() {
		loadingMore = true;
		const offset = videos.length;
		try {
			const result = await fetch(`/api/users/${user.id}/videos?limit=${VIDEOS_IN_PROFILE_LIMIT}&offset=${offset}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});
			const videosResult = (await result.json())?.videos as MappedVideos;
			loaded = videosResult;
			videos = videos.concat(videosResult);
			await tick();
			if (videosResult[0]?.id)
				document.getElementById(videosResult[0].id)?.scrollIntoView({ behavior: 'smooth' });
		} catch (e) {
			paginationDone = true;
		} finally {
			loadingMore = false;
		}
	}
</script>

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
{#if !paginationDone}
	<div class="m-3">
		<button class="btn btn-lg" on:click={loadMore} disabled={loadingMore}>Load more</button>
	</div>
{/if}
