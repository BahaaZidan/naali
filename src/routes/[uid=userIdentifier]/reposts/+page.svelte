<script lang="ts">
	export let data;
</script>

{#each data.posts as post}
	<div class="flex gap-2">
		<div class="avatar">
			<div class="size-11 rounded-full">
				<img src={data.user.image} alt={data.user.name} />
			</div>
		</div>
		<div>posted</div>
		<a href="/video/{post.videoId}" class="link-hover">this video</a>
		<div>{post.createdAt}</div>
	</div>
{/each}