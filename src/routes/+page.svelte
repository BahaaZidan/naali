<script lang="ts">
	import { formatDistance } from 'date-fns';

	export let data;
</script>

<div class="flex flex-col w-full items-center">
	{#each data.posts || [] as post}
		<div class="flex flex-col max-w-xl m-1 p-5 rounded bg-accent-content items-center">
			<div class="flex gap-2">
				<img src="{post.creator?.image}" alt="{post.creator?.name} profile picture" class="w-6 h-6 rounded-full" />
				<p><a href="/user/{post.creator?.id}">{post.creator?.name}</a> shared this
					video {post.createdAt && formatDistance(post.createdAt, new Date(), { addSuffix: true })}</p>
			</div>
			<div class="divider m-0"></div>
			<a class="flex flex-col items-center gap-2" href="/video/{post.video.id}">
				<img src="{post.video.thumbnail}" alt="thumbnail" class="w-80 object-contain" />
				<div class="text-2xl">{post.video.name}</div>
			</a>
		</div>
	{/each}
</div>
