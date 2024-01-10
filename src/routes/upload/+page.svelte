<script lang="ts">
	import { onMount } from 'svelte';
	import Tus from '@uppy/tus';
	import Uppy from '@uppy/core';
import Dashboard from '@uppy/dashboard';

import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';


	onMount(() => {
		const uppy = new Uppy({
			allowMultipleUploads: false,
			debug: true,
			autoProceed: true,
			restrictions: { maxNumberOfFiles: 1, allowedFileTypes: ['.mp4'] }
		});


			uppy
				.use(Dashboard, { inline: true, target: '#uppy-dashboard',  })
				.use(Tus, { endpoint: '/api/upload-url', chunkSize: 150 * 1024 * 1024 })
	});
</script>

<div class="flex flex-col items-center">
	<div id="uppy-dashboard"></div>
</div>