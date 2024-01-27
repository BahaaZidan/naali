<script lang="ts">
	import { enhance } from '$app/forms';

	export let data;
	$: user = data.user;
</script>

<h1 class="text-3xl">Settings</h1>

<form method="POST" class="flex w-full flex-col gap-4" use:enhance>
	<label class="w-full">
		<div class="label">
			<span class="label-text">Name</span>
		</div>
		<input name="name" type="text" class="input input-bordered w-full max-w-lg" value={user.name} />
	</label>
	<button type="submit" class="btn btn-primary btn-block max-w-lg">Save changes</button>
</form>
