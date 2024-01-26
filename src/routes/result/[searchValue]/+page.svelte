<script lang="ts">
	import VideoCard from '$lib/components/video-card.svelte';
	import { PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE } from '$env/static/public';

	export let data;
</script>

<div class="flex gap-2 p-4">
	{#each data.videos as video}
		<VideoCard
			id={video.id}
			name={video.name}
			createdAt={video.createdAt}
			duration={video.duration}
			thumbnail="https://customer-{PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE}.cloudflarestream.com/{video.id}/thumbnails/thumbnail.jpg"
		/>
	{/each}
</div>