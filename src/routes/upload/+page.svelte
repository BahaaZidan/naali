<script lang="ts">
	import { onMount } from 'svelte';
	import Uppy from '@uppy/core';
	import Tus from '@uppy/tus';
	import DragAndDrop from '@uppy/drag-drop';
	import ProgressBar from '@uppy/progress-bar';

	import '@uppy/core/dist/style.css';
	import '@uppy/drag-drop/dist/style.css';
	import '@uppy/progress-bar/dist/style.css';

	onMount(() => {
		const uppy = new Uppy({
			allowMultipleUploads: false,
			debug: true,
			autoProceed: true,
			restrictions: { maxNumberOfFiles: 1, allowedFileTypes: ['.mp4'] }
		});

		const onUploadSuccess = el => (file, response) => {
				const li = document.createElement('li');
				const a = document.createElement('a');
				a.href = response.uploadURL;
				a.target = '_blank';
				a.appendChild(document.createTextNode(file.name));
				li.appendChild(a);

				document.querySelector(el).appendChild(li);
			};

		
			uppy
				.use(DragAndDrop, { target: '#drag-drop-area' })
				.use(Tus, { endpoint: '/api/upload-url', chunkSize: 150 * 1024 * 1024 })
				.use(ProgressBar, { target: '.for-ProgressBar', hideAfterFinish: false })
				.on('upload-success', onUploadSuccess('.uploaded-files ol'));
	});
</script>

<div class="flex h-screen flex-col items-center justify-center">
	<h1 class="mb-3 text-3xl">Upload video</h1>
	<div id="drag-drop-area" style="height: 300px"></div>
		<div class="for-ProgressBar"></div>
		<button class="upload-button" style="font-size: 30px; margin: 20px">Upload</button>
		<div class="uploaded-files" style="margin-top: 50px">
			<ol></ol>
		</div>
</div>