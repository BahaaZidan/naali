<script lang="ts">
	import TablerDotsVertical from 'virtual:icons/tabler/dots-vertical';
	export let data;
</script>

<h1 class="text-3xl">Videos</h1>
<table class="table">
	<thead>
		<tr>
			<th></th>
			<th>Thumbnail</th>
			<th>Name</th>
			<th>Uploaded at</th>
			<th>Status</th>
		</tr>
	</thead>
	<tbody>
		{#each data.videos as video}
			<tr class="hover">
				<td class="p-0 px-3">
					<div class="dropdown">
						<div tabindex="0" role="button" class="btn btn-ghost"><TablerDotsVertical /></div>
						<ul class="menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow">
							<li><button>Delete</button></li>
							<li><button>Edit</button></li>
						</ul>
					</div>
				</td>
				<td>
					<img src={video.thumbnail} alt="thumbnail" class="h-16 w-28 object-contain" />
				</td>
				<td>{video.name}</td>
				<td>{video.created_at}</td>
				<td>{video.publish_status}</td>
			</tr>
		{/each}
	</tbody>
</table>
