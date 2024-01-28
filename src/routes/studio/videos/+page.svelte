<script lang="ts">
	import TablerDotsVertical from 'virtual:icons/tabler/dots-vertical';
	import { format } from 'date-fns';
	import { enhance } from '$app/forms';

	export let data;
	export let form;
	$: {
		if (form?.success || form?.errors) document.querySelector('dialog')?.close();
	}
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
		{#each data.videos as video}
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
	</tbody>
</table>
