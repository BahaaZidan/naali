<script lang="ts">
	import { onMount } from 'svelte';
	import Tus from '@uppy/tus';
	import Uppy from '@uppy/core';
	import Dashboard from '@uppy/dashboard';
	import { page } from '$app/stores';

	import '@uppy/core/dist/style.min.css';
	import '@uppy/dashboard/dist/style.min.css';

	let status: 'pendingupload' | 'downloading' | 'queued' | 'inprogress' | 'ready' | 'error' =
		'queued';

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
			allowMultipleUploads: false,
			restrictions: {
				allowedFileTypes,
				maxNumberOfFiles: 1
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
			.use(Tus, { endpoint: '/api/video/upload-url', chunkSize: 150 * 1024 * 1024 })
			.on('file-added', (file) => {
				uppy.getPlugin('Dashboard')?.setPluginState({
					fileCardFor: file.id || null,
					activeOverlayType: file.id ? 'FileCard' : null
				});
			})
			.on('complete', async (result) => {
				const creator = $page.data.session?.user?.id;
				// TODO: -_-
				if (!creator) throw new Error('Something went wrong!');
				const video = result.successful.map((r) => {
					return {
						name: r.meta.name,
						description: r.meta.description,
						id: new URL(r.uploadURL).pathname.split('/')[2],
						creator
					};
				})[0];

				// @ts-expect-error wrong ts types
				document.getElementById('processing_modal')?.showModal();
				let interval = setInterval(() => {
					fetch(`/api/video/${video.id}/details`, {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json'
						}
					}).then(async (res) => {
						const result = await res.json<{ status: typeof status; duration: number }>();
						status = result?.status;

						// TODO: handle errors (lol)
						if (result?.status === 'ready') {
							clearInterval(interval);
							const video_entry = await fetch('/api/video/create-entry', {
								method: 'POST',
								body: JSON.stringify({ video: { ...video, duration: result.duration } }),
								headers: {
									'Content-Type': 'application/json'
								}
							});
							if (video_entry.ok) return (window.location.href = `/video/${video.id}`);
						}
					});
				}, 500);
			});
	});
</script>

<div id="uppy-dashboard"></div>
<dialog id="processing_modal" class="modal">
	<div class="modal-box">
		<h3 class="text-lg font-bold">We're preparing your video for streaming</h3>
		<ul class="steps steps-vertical">
			<li
				class="step"
				class:step-primary={status === 'queued' || status === 'inprogress' || status === 'ready'}
			>
				<div class="flex gap-2">
					Queued
					{#if status === 'queued'}<span class="loading loading-spinner loading-md"></span>
					{/if}
				</div>
			</li>
			<li class="step" class:step-primary={status === 'inprogress' || status === 'ready'}>
				<div class="flex gap-2">
					In progress
					{#if status === 'inprogress'}<span class="loading loading-spinner loading-md"></span>
					{/if}
				</div>
			</li>
			{#if status === 'error'}
				<li class="step" class:step-error={status === 'error'}>Error</li>
			{:else}
				<li class="step" class:step-primary={status === 'ready'}>Ready</li>
			{/if}
		</ul>
	</div>
</dialog>
