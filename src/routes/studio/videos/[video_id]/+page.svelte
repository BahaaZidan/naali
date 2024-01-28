<script lang="ts">
	import ArrowLeftIcon from 'virtual:icons/tabler/arrow-left';
	import { enhance } from '$app/forms';
	import ErrorLabel from '$lib/components/error-label.svelte';
	import CircleCheckIcon from 'virtual:icons/tabler/circle-check';

	export let data;
	export let form;
	$: errors = form?.errors?.nested;
</script>

<div class="breadcrumbs text-sm">
	<a class="btn btn-ghost btn-md" href="/studio/videos">
		<ArrowLeftIcon />
		Back</a
	>
</div>
<h1 class="text-3xl">Video details</h1>
{#if form?.success}
	<div role="alert" class="alert">
		<CircleCheckIcon />
		<span>Video info changed successfully!</span>
	</div>
{/if}
<form method="POST" class="flex w-full flex-col gap-4" use:enhance>
	<input name="id" type="hidden" bind:value={data.video.id} />
	<label class="w-full">
		<div class="label">
			<span class="label-text">Name</span>
		</div>
		<input
			name="name"
			type="text"
			class="input input-bordered w-full max-w-lg"
			bind:value={data.video.name}
			class:input-error={!!errors?.name?.length}
			required
			minlength={1}
			maxlength={80}
		/>
		<ErrorLabel errorMessages={errors?.name} />
	</label>
	<label class="w-full">
		<div class="label">
			<span class="label-text">Description</span>
		</div>
		<textarea
			name="description"
			class="textarea textarea-bordered h-40 w-full max-w-lg"
			bind:value={data.video.description}
			maxlength={5000}
			class:textarea-error={!!errors?.description?.length}
		/>
		<ErrorLabel errorMessages={errors?.description} />
	</label>

	<button type="submit" class="btn btn-primary btn-block max-w-lg">Save changes</button>
</form>
