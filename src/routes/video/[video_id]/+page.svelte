<script lang="ts">
	export let data;
	const video = data.video;
</script>

<div style="position: relative; padding-top: 56.25%">
	<iframe
		title="video"
		src={video.stream_url}
		style="border: none; position: absolute; top: 0; height: 100%; width: 100%"
		allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
		allowfullscreen={true}
	></iframe>
</div>
<div class="flex flex-col">
	<h2 class="text-3xl">{video.name}</h2>
</div>
