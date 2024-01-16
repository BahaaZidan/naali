<script lang="ts">
	import ArrowLeftIcon from 'virtual:icons/tabler/arrow-left';
	export let data;
</script>

<div class="breadcrumbs text-sm">
	<a class="btn btn-ghost btn-md" href="/studio/videos"><ArrowLeftIcon />Back</a>
</div>
<h1 class="text-3xl">Video details</h1>
<form method="POST" class="flex w-full flex-col gap-4">
	<input name="id" type="hidden" value={data.video.id} />
	<label class="w-full">
		<div class="label">
			<span class="label-text">Name</span>
		</div>
		<input
			name="name"
			type="text"
			class="input input-bordered w-full max-w-lg"
			value={data.video.name}
		/>
	</label>
	<label class="w-full">
		<div class="label">
			<span class="label-text">Description</span>
		</div>
		<textarea
			name="description"
			class="textarea textarea-bordered h-40 w-full max-w-lg"
			value={data.video.description}
		/>
	</label>

	<label class="w-full">
		<div class="label">
			<span class="label-text">Visibility</span>
		</div>
		<select
			class="select select-bordered w-full max-w-lg"
			name="publish_status"
			value={data.video.publish_status}
		>
			<option value="private">Private</option>
			<option value="public">Public</option>
		</select>
	</label>

	<button type="submit" class="btn btn-primary btn-block max-w-lg">Save changes</button>
</form>
