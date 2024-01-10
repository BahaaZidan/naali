<script lang="ts">
	import { page } from '$app/stores';
	import { PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE } from '$env/static/public';
	const video = $page.data.video;
</script>

<div style="position: relative; padding-top: 56.25%">
  <iframe
		title="video"
    src={`https://customer-${PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE}.cloudflarestream.com/${video.uid}/iframe`}
    style="border: none; position: absolute; top: 0; height: 100%; width: 100%"
    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
    allowfullscreen={true}
  ></iframe>
</div>
<div class="flex flex-col">
	<h2 class="text-3xl">{video.meta.name}</h2>
</div>