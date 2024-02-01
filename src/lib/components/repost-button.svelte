<script lang="ts">
	import ShareIcon from 'virtual:icons/tabler/share';
	import * as v from 'valibot';

	export let id: string;

	let content: string | undefined;
	let reposting = false;
	let error: Error | undefined;

	async function repost() {
		reposting = true;
		try {
			const caption = v.parse(v.optional(v.string([v.maxLength(1000)])), content);
			await fetch('/api/posts', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					videoId: id,
					caption,
					createdAt: new Date()
				})
			});
		} finally {
			document.querySelector('dialog')?.close();
			reposting = false;
		}
	}

	function showModal() {
		// @ts-expect-error ts can't narrow down the type
		document.getElementById(`repost_dialog_${id}`)?.showModal();
	}
</script>

<button class="btn" on:click={showModal}>
	<ShareIcon class="size-5" />
	Repost
</button>
<dialog id="repost_dialog_{id}" class="modal">
	<div class="modal-box">
		<h3 class="font-bold text-lg">Repost</h3>
		{#if error}
			<div role="alert" class="alert alert-error">
				<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<span>Error reposting this video!</span>
			</div>
		{/if}
		<textarea bind:value={content} class="my-2 textarea textarea-bordered w-full" maxlength={1000}
							placeholder="Optional caption" />
		<div class="modal-action">
			<form method="dialog">
				<button class="btn">Close</button>
			</form>
			<button class="btn" on:click={repost} disabled={reposting}>Repost</button>
		</div>
	</div>
</dialog>
