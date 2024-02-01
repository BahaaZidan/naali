<script lang="ts">
	import { formatDistanceToNow } from 'date-fns';

	export let data;
</script>

{#each data.posts as post}
	<div class="p-2 hover:bg-neutral">{data.user.name} {post.video.creator === data.user.id ? "posted" : "reposted"} <a
		href="/video/{post.videoId}" class="link-hover">this
		video</a> {formatDistanceToNow(post.createdAt, { addSuffix: true })}
	</div>
{/each}