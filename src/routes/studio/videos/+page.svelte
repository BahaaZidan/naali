<script lang="ts">
	import { STUDIO_VIDEO_LIMIT } from '$lib/constants';
	import { browser } from '$app/environment';
	import TablerDotsVertical from 'virtual:icons/tabler/dots-vertical';
	import { format } from 'date-fns';
	import { enhance } from '$app/forms';

	export let form;
	$: {
		if (form?.success || form?.errors) document.querySelector('dialog')?.close();
	}
	export let data;

	$: count = data.count;
	$: pageCount = Math.ceil(count / STUDIO_VIDEO_LIMIT);
	let currentPage = 1;
	$: offset = (currentPage - 1) * STUDIO_VIDEO_LIMIT;
	$: loading = false;

</script>

<h1 class="text-3xl">Videos</h1>
<table class="table">
	<thead>
	<tr>
		<th>Thumbnail</th>
		<th>Name</th>
		<th>Uploaded at</th>
		<th>Actions</th>
	</tr>
	</thead>
	<tbody>
	{#if browser}
		{#await (fetch(`/api/users/${data.authenticatedUserId}/videos?limit=${STUDIO_VIDEO_LIMIT}&offset=${offset}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		})) then value}
			{#await value.json() then videos}
				{#each videos.videos as video}
					<tr class="hover">
						<td>
							<img src={video.thumbnail} alt="thumbnail" class="h-16 w-28 object-contain" />
						</td>
						<td>{video.name}</td>
						{#if video.createdAt}
							<td>{format(video.createdAt, 'MM/dd/yyyy')}</td>
						{:else}
							<td></td>
						{/if}
						<td class="p-0 px-3">
							<div class="dropdown">
								<div tabindex="0" role="button" class="btn btn-ghost">
									<TablerDotsVertical />
								</div>
								<ul class="menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow">
									<li>
										<button
											on:click={() => {
										// @ts-ignore
										document.getElementById(`dialog_delete_${video.id}`)?.showModal();
									}}
										>Delete
										</button>
									</li>
									<li><a href="/studio/videos/{video.id}">Edit</a></li>
								</ul>
							</div>
						</td>
					</tr>
					<dialog id="dialog_delete_{video.id}" class="modal">
						<div class="modal-box">
							<h3 class="text-lg font-bold">Are you sure ?</h3>
							<p>
								You're about to delete <span class="font-bold italic">{video.name}</span>. This action
								is irreversible! Are you sure you want to continue ?
							</p>
							<form method="POST" action="?/delete" id="form_delete_{video.id}" use:enhance>
								<input name="id" type="hidden" value={video.id} />
							</form>
							<div class="modal-action">
								<form method="dialog">
									<button class="btn">Close</button>
								</form>
								<button class="btn btn-error" type="submit" form="form_delete_{video.id}"
								>Delete
								</button>
							</div>
						</div>
					</dialog>
				{/each}
			{/await}
		{:catch error}
			<p>Something went wrong: {error.message}</p>
		{/await}
	{/if}


	</tbody>
</table>
{#if pageCount > 1}
	<div class="join">
		{#each Array.from({ length: pageCount }, (_, index) => index + 1) as pageNumber}
			<button disabled={loading} class="join-item btn" class:btn-active={pageNumber === currentPage}
							on:click={() => currentPage = pageNumber}>{pageNumber}</button>
		{/each}
	</div>
{/if}