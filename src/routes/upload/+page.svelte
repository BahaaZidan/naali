<script lang="ts">
	import { onMount } from 'svelte';
	import Uppy from '@uppy/core';
	import Tus from '@uppy/tus';
	import DragAndDrop from '@uppy/drag-drop';
	import ProgressBar from '@uppy/progress-bar';
	import StatusBar from '@uppy/status-bar';
	import { PUBLIC_TUS_URL } from '$env/static/public';

	onMount(() => {
		const uppy = new Uppy({
			allowMultipleUploads: false,
			restrictions: { maxNumberOfFiles: 1, allowedFileTypes: ['.mp4'] }
		});
		uppy
			.use(DragAndDrop, { target: '#drag-drop' })
			.use(StatusBar, { target: '#status-bar' })
			.use(Tus, { endpoint: PUBLIC_TUS_URL, limit: 6 });
	});
</script>

<div class="flex h-screen flex-col items-center justify-center">
	<h1 class="mb-3 text-3xl">Upload video</h1>
	<!-- <input
		type="file"
		accept="video/*"
		class="file-input file-input-bordered w-full max-w-xs"
		on:change={handleFileUpload}
	/> -->
	<div id="drag-drop"></div>
	<div id="status-bar"></div>
</div>

<style scoped>
	@import '@uppy/core/dist/style.css';
	@import '@uppy/drag-drop/dist/style.css';
	@import '@uppy/progress-bar/dist/style.css';
	@import '@uppy/status-bar/dist/style.css';
</style>
