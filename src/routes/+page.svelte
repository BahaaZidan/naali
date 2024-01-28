<script lang="ts">
	import { formatDistance } from 'date-fns';

	export let data;
</script>

{#if data.posts?.length}
	<div class="flex w-full flex-col items-center">
		{#each data.posts as post}
			<div class="m-1 flex max-w-xl flex-col items-center rounded bg-accent-content p-5">
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
	</div>
{:else}
	<div class="my-4 flex w-full flex-col items-center">
		<h1 class="text-5xl">Your feed is empty</h1>
		<h3 class="text-xl">Follow creators to fill it up!</h3>
	</div>
{/if}
