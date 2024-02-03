<script lang="ts">
	import { enhance } from '$app/forms';
	import CircleCheckIcon from 'virtual:icons/tabler/circle-check';
	import ErrorLabel from '$lib/components/error-label.svelte';

	export let data;
	$: user = data.user;
	export let form;
	$: errors = form?.errors?.nested;
</script>

<div class="flex flex-col gap-2">
	<h1 class="text-3xl">Settings</h1>
	{#if form?.success}
		<div role="alert" class="alert">
			<CircleCheckIcon />
			<span>Profile info changed successfully!</span>
		</div>
	{/if}
	<form method="POST" enctype="multipart/form-data" class="flex w-full flex-col gap-4" use:enhance>
		<label class="w-full">
			<div class="label">
				<span class="label-text">Picture</span>
			</div>
			<input type="file" name="picture" accept="image/jpeg, image/png"
						 class="file-input file-input-bordered w-full max-w-lg" class:input-error={!!errors?.picture?.length} />
			<ErrorLabel errorMessages={errors?.picture} />
		</label>
		<label class="w-full">
			<div class="label">
				<span class="label-text">Email</span>
			</div>
			<input
				type="email"
				class="input input-bordered w-full max-w-lg"
				bind:value={user.email}
				disabled
			/>
		</label>
		<label class="w-full">
			<div class="label">
				<span class="label-text">Handle</span>
			</div>
			<input
				name="handle"
				type="text"
				class="input input-bordered w-full max-w-lg"
				bind:value={user.handle}
				class:input-error={!!errors?.handle?.length}
				required
				minlength={1}
				maxlength={16}
			/>
			<ErrorLabel errorMessages={errors?.handle} />
		</label>
		<label class="w-full">
			<div class="label">
				<span class="label-text">Name</span>
			</div>
			<input
				name="name"
				type="text"
				class="input input-bordered w-full max-w-lg"
				class:input-error={!!errors?.name?.length}
				bind:value={user.name}
				required
				minlength={1}
				maxlength={20}
			/>
			<ErrorLabel errorMessages={errors?.name} />
		</label>

		<button type="submit" class="btn btn-primary btn-block max-w-lg">Save changes</button>
	</form>
</div>
