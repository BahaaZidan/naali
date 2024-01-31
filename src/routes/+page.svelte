<script lang="ts">
	import { formatDistance } from 'date-fns';
	import { tick } from 'svelte';
	import { POSTS_IN_HOME_LIMIT } from '$lib/constants';

	export let data;

	type MappedPosts = NonNullable<typeof data.posts>;
	$: loaded = data.posts;
	$: paginationDone = loaded && loaded.length < POSTS_IN_HOME_LIMIT;
	let loadingMore = false;
	$: posts = (data.posts || []);

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

{#if posts.length}
	<div class="flex w-full flex-col items-center">
		{#each posts as post}
			<div
				class="m-1 flex max-w-xl flex-col items-center rounded bg-accent-content p-5 gap-1"
				id={post.id}
			>
				<div class="flex gap-2">
					<img
						src={post.creator?.image}
						alt="{post.creator?.name} profile picture"
						class="h-6 w-6 rounded-full"
					/>
					<p>
						<a class="link-hover" href="/{post.creator?.handle || post.creator?.id}"
						>{post.creator?.name}</a
						>
						shared this video {post.createdAt &&
					formatDistance(post.createdAt, new Date(), { addSuffix: true })}
					</p>
				</div>
				<div class="divider m-0"></div>
				<a class="flex flex-col items-center gap-2" href="/video/{post.video.id}">
					<img src={post.video.thumbnail} alt="thumbnail" class="w-80 object-contain" />
					<div class="text-2xl">{post.video.name}</div>
				</a>
			</div>
		{/each}
		{#if !paginationDone}
			<div class="m-4">
				<button class="btn btn-lg" on:click={loadMore} disabled={loadingMore}>Load more</button>
			</div>
		{/if}
	</div>
{:else}
	<div class="my-4 flex w-full flex-col items-center">
		<h1 class="text-5xl">Your feed is empty</h1>
		<h3 class="text-xl">Follow creators to fill it up!</h3>
	</div>
{/if}
