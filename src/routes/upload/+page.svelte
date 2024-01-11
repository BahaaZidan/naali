<script lang="ts">
	import { onMount } from 'svelte';
	import Tus from '@uppy/tus';
	import Uppy from '@uppy/core';
	import Dashboard from '@uppy/dashboard';
	import { page } from '$app/stores';

	import '@uppy/core/dist/style.min.css';
	import '@uppy/dashboard/dist/style.min.css';

	onMount(() => {
		const uppy = new Uppy({
			restrictions: { allowedFileTypes: ['.mp4'] },
		});
		uppy
			.use(Dashboard, { inline: true, target: '#uppy-dashboard', proudlyDisplayPoweredByUppy: false, 
				showProgressDetails: true,
				metaFields: [
					{ id: 'name', name: 'Name', placeholder: 'file name' },
				],
		 	})
			.use(Tus, { endpoint: '/api/upload-url', chunkSize: 150 * 1024 * 1024 })
			.on("complete", () => {
				window.location.href = `/user/${$page.data.session?.user?.id}`;
			})
	});
</script>

<div class="flex flex-col items-center">
	<div id="uppy-dashboard"></div>
</div>