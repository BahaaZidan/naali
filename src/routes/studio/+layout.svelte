<script lang="ts">
	import FullScreenContainer from '$lib/components/full-screen-container.svelte';
</script>

<FullScreenContainer>
	<div class="flex h-full">
		<ul class="menu w-56 rounded-box bg-base-200">
			<li><a href="/studio">Settings</a></li>
			<li><a href="/studio/videos">Videos</a></li>
			<li><a href="/studio/analytics">Analytics</a></li>
			<li><a href="/studio/subtitles">Subtitles</a></li>
		</ul>
		<slot />
	</div>
</FullScreenContainer>
