<script lang="ts">
	import { formatDistance } from 'date-fns';
	import { tick } from 'svelte';

	export let data;
	$: posts = data.posts || [];
	type MappedPosts = NonNullable<typeof posts>;
	const limit = 20;
	$: paginationPossible = posts.length >= limit;
	let noMore = false;
	let loadingMore = false;

	async function loadMore() {
		loadingMore = true;
		const offset = posts.length;

		try {
			const result = await fetch(`/api/posts?limit=${limit}&offset=${offset}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});
			const postsResult = (await result.json())?.posts as MappedPosts;
			posts = posts.concat(postsResult);
			noMore = postsResult.length < limit;
			await tick();
			if (postsResult[0]?.id)
				document.getElementById(postsResult[0].id)?.scrollIntoView({ behavior: 'smooth' });
		} catch (e) {
			noMore = true;
		} finally {
			loadingMore = false;
		}
	}
</script>

{#if posts.length}
	<div class="flex w-full flex-col items-center">
		{#each posts as post}
			<div
				class="m-1 flex max-w-xl flex-col items-center rounded bg-accent-content p-5"
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
		{#if paginationPossible}

			<div class="m-4">
				{#if noMore}
					<div class="text-lg">No more posts!</div>
				{:else}
					<button class="btn btn-lg" on:click={loadMore} disabled={loadingMore}>Load more</button>
				{/if}
			</div>
		{/if}
	</div>
{:else}
	<div class="my-4 flex w-full flex-col items-center">
		<h1 class="text-5xl">Your feed is empty</h1>
		<h3 class="text-xl">Follow creators to fill it up!</h3>
	</div>
{/if}
