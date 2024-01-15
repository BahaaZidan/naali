<script lang="ts">
	import { onMount } from 'svelte';
	import Tus from '@uppy/tus';
	import Uppy from '@uppy/core';
	import Dashboard from '@uppy/dashboard';
	import { page } from '$app/stores';

	import '@uppy/core/dist/style.min.css';
	import '@uppy/dashboard/dist/style.min.css';

	const allowedFileTypes = [
		'MP4',
		'MKV',
		'MOV',
		'AVI',
		'FLV',
		'MPEG-2 TS',
		'MPEG-2 PS',
		'MXF',
		'LXF',
		'GXF',
		'3GP',
		'WebM',
		'MPG',
		'QuickTime'
	].map((t) => '.' + t);
	onMount(() => {
		const uppy = new Uppy({
			restrictions: {
				allowedFileTypes
			}
		});
		uppy
			.use(Dashboard, {
				inline: true,
				width: '100%',
				// TODO: make a css variable for progress bar instead of "-6px"
				height: 'calc(100vh - var(--nav-height) - 6px)',
				theme: 'auto',
				target: '#uppy-dashboard',
				proudlyDisplayPoweredByUppy: false,
				showProgressDetails: true,
				metaFields: [
					{ id: 'name', name: 'Name', placeholder: 'file name' },
					{
						id: 'description',
						name: 'Description',
						render({ fieldCSSClasses, onChange, value, form }, h) {
							return h('textarea', {
								id: 'description',
								name: 'description',
								class: fieldCSSClasses.text,
								onChange: (
									e: Event & {
										currentTarget: EventTarget & HTMLTextAreaElement;
									}
								) => {
									onChange(e.currentTarget?.value);
								},
								value,
								form
							});
						}
					}
				]
			})
			.use(Tus, { endpoint: '/api/upload-url', chunkSize: 150 * 1024 * 1024 })
			.on('complete', async (result) => {
				const creator = $page.data.session?.user?.id;
				// TODO: -_-
				if (!creator) throw new Error('Something went wrong!');
				const videos = result.successful.map((r) => {
					return {
						name: r.meta.name,
						description: r.meta.description,
						id: new URL(r.uploadURL).pathname.split('/')[2],
						creator
					};
				});
				const result_videos = await fetch('/api/create-video-entry', {
					method: 'POST',
					body: JSON.stringify({ videos }),
					headers: {
						'Content-Type': 'application/json'
					}
				});
				if (result_videos.ok)
					return (window.location.href = `/user/${$page.data.session?.user?.id}`);
			});
	});
</script>

<div id="uppy-dashboard"></div>
