<script lang="ts">
	import { tick } from 'svelte';
	import { POSTS_IN_HOME_LIMIT } from '$lib/constants';
	import VideoCard from '$lib/components/video-card.svelte';
	import groupBy from 'lodash/groupBy';

	export let data;

	type MappedPosts = NonNullable<typeof data.posts>;
	$: loaded = data.posts;
	$: paginationDone = loaded && loaded.length < POSTS_IN_HOME_LIMIT;
	let loadingMore = false;
	$: posts = (data.posts || []);
	$: grouped = Object.entries(groupBy(posts, (p) => p.video.id));

	async function loadMore() {
		loadingMore = true;
		const offset = posts.length;

		try {
			const result = await fetch(`/api/posts?limit=${POSTS_IN_HOME_LIMIT}&offset=${offset}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});
			const postsResult = (await result.json())?.posts as MappedPosts;
			loaded = postsResult;
			posts = posts.concat(postsResult);
			await tick();
			if (postsResult[0]?.id)
				document.getElementById(postsResult[0].id)?.scrollIntoView({ behavior: 'smooth' });
		} catch (e) {
			paginationDone = true;
		} finally {
			loadingMore = false;
		}
	}
</script>

<div class="p-4">
	{#if posts.length}
		<div class="flex flex-wrap gap-3">
			{#each grouped as group}
				{@const video = group[1][0].video}
				{@const reposts = group[1].map(p => ({ id: p.id, createdAt: p.createdAt, creator: p.creator }))}
				{#if video.id && video.duration && video.name}
					<VideoCard
						id={video.id}
						duration={video.duration}
						name={video.name}
						createdAt={video.createdAt}
						thumbnail={video.thumbnail}
						creator={video.creator}
						posts={reposts}
					/>
				{/if}
			{/each}
		</div>
		{#if !paginationDone}
			<div class="m-4">
				<button class="btn btn-lg" on:click={loadMore} disabled={loadingMore}>Load more</button>
			</div>
		{/if}
	{:else}
		<div class="my-4 flex w-full flex-col items-center">
			<h1 class="text-5xl">Your feed is empty</h1>
			<h3 class="text-xl">Follow creators to fill it up!</h3>
		</div>
	{/if}
</div>