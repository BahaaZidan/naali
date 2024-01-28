<script lang="ts">
	export let errorMessages: string[] | undefined;
</script>

{#if errorMessages?.length}
	<div class="label">
		<span class="label-text-alt">{errorMessages.join(', ')}</span>
	</div>
{/if}
