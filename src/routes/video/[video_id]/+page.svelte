<script lang="ts">
	import { enhance } from '$app/forms';
	import { browser } from '$app/environment';
	import ThumbUpIcon from 'virtual:icons/tabler/thumb-up';
	import ThumbUpFilledIcon from 'virtual:icons/tabler/thumb-up-filled';
	import ThumbDownIcon from 'virtual:icons/tabler/thumb-down';
	import ThumbDownFilledIcon from 'virtual:icons/tabler/thumb-down-filled';
	import SendIcon from 'virtual:icons/tabler/send';
	import ShareIcon from 'virtual:icons/tabler/share';
	import ShareOffIcon from 'virtual:icons/tabler/share-off';
	import EditIcon from 'virtual:icons/tabler/edit';
	import XIcon from 'virtual:icons/tabler/brand-x';
	import RedditIcon from 'virtual:icons/tabler/brand-reddit';
	import WhatsappIcon from 'virtual:icons/tabler/brand-whatsapp';
	import { page } from '$app/stores';
	import type { CommentsSelect, UsersSelect } from '$lib/db/schema';
	import { formatDistanceToNow } from 'date-fns';
	import DotsVerticalIcons from 'virtual:icons/tabler/dots-vertical';

	type Comment = Omit<CommentsSelect, 'creator'> & { creator: UsersSelect };

	export let data;
	$: ({ video } = data);
	let commentValue = '';
	let newComments: Comment[] = [];
	let deletedComments: string[] = [];

	const shareTarget = [
		{
			icon: XIcon,
			urlPrefix: 'https://twitter.com/intent/tweet?url='
		},
		{
			icon: RedditIcon,
			urlPrefix: 'https://reddit.com/submit?url='
		},
		{
			icon: WhatsappIcon,
			urlPrefix: 'https://api.whatsapp.com/send/?text='
		}
	];

	function openSendDialog() {
		if (typeof navigator.share !== 'function') return (document.querySelector(`#send_dialog_${video.id}`) as HTMLDialogElement | null)?.showModal?.();
		navigator.share({ url: `/videos/${video.id}` });
	}

	function clearCommentValue() {
		commentValue = '';
	}

	async function submitComment() {
		const response = await fetch(`/api/video/${video.id}/comments`, {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ content: commentValue })
		});
		const { comment } = await response.json();
		comment.creator = $page.data.session?.user;
		newComments.unshift(comment);
		newComments = newComments;
		commentValue = '';
	}

	async function getComments() {
		const response = await fetch(`/api/video/${video.id}/comments`);
		const { comments } = await response.json() as { comments: Comment[] };
		return comments;
	}

	async function deleteComment(commentId: string) {
		const response = await fetch(`/api/video/${video.id}/comments/${commentId}`, { method: 'DELETE' });
		const { success } = await response.json();
		if (success) {
			deletedComments.push(commentId);
			deletedComments = deletedComments;
			(document.querySelector(`#delete_comment_dialog_${commentId}`) as HTMLDialogElement | null)?.close();
		}
	}

	const openDeleteCommentDialog = (commentId: string) => () => {
		(document.querySelector(`#delete_comment_dialog_${commentId}`) as HTMLDialogElement | null)?.showModal();
	};

</script>

<main>
	<div class="h-[63vh] min-h-[400px] w-full">
		<iframe
			title="video"
			src={video.stream_url}
			class="h-full w-full border-none"
			allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
			allowfullscreen={true}
		></iframe>
	</div>
	<div class="flex flex-col gap-2 px-4 py-2">
		<h2 class="text-2xl md:text-3xl">{video.name}</h2>
		<div class="flex flex-col gap-2 md:flex-row md:justify-between">
			<div class="flex gap-2">
				<div class="avatar">
					<div class="w-16 rounded-full">
						<img src={video.creator.image} alt="video creator pp" />
					</div>
				</div>
				<div class="flex flex-col">
					<a
						class="link-hover line-clamp-1 text-lg"
						href="/{video.creator.handle || video.creator.id}"
					>
						{video.creator.name}
					</a>
					<div class="line-clamp-1 text-xs">1,000 Followers</div>
				</div>
				{#if !video.isOwn}
					<button class="btn">Follow</button>
					<button class="btn">Sponsor</button>
				{/if}
			</div>
			<div class="flex gap-2">
				{#if !video.isOwn}
					<div class="flex">
						<form method="post" action="?/like" use:enhance>
							<input type="hidden" value={video.id} name="id" />
							<input type="hidden" value={video.like === true ? 'delete' : 'true'} name="value" />
							<button class="btn rounded-e-none" type="submit">
								{#if video.like === true}
									<ThumbUpFilledIcon class="size-5" />
								{:else}
									<ThumbUpIcon class="size-5" />
								{/if}
							</button>
						</form>
						<form method="post" action="?/like" use:enhance>
							<input type="hidden" value={video.id} name="id" />
							<input type="hidden" value={video.like === false ? 'delete' : 'false'} name="value" />
							<button class="btn rounded-s-none" type="submit">
								{#if video.like === false}
									<ThumbDownFilledIcon class="size-5" />
								{:else}
									<ThumbDownIcon class="size-5" />
								{/if}
							</button>
						</form>
					</div>

					{#if video.isRepostedByAuthenticatedUser}
						<form method="post" action="?/undo_repost" use:enhance>
							<input type="hidden" value={video.id} name="videoId" />
							<button class="btn" type="submit">
								<ShareOffIcon class="size-5" />
								Undo repost
							</button>
						</form>
					{:else}
						<form method="post" action="?/repost" use:enhance>
							<input type="hidden" value={video.id} name="videoId" />
							<input type="hidden" value={(new Date()).toISOString()} name="createdAt" />
							<button class="btn" type="submit">
								<ShareIcon class="size-5" />
								Repost
							</button>
						</form>
					{/if}
				{:else}
					<a href="/studio/videos/{video.id}" class="btn">
						<EditIcon class="size-5" />
						Edit
					</a>
				{/if}
				<button class="btn" on:click={openSendDialog}>
					<SendIcon class="size-5" />
					Send
				</button>
				<dialog id="send_dialog_{video.id}" class="modal">
					{#if browser}
						<div class="modal-box">
							<h3 class="font-bold text-lg mb-2">Send</h3>
							<div class="flex flex-wrap gap-4">
								{#each shareTarget as target}
									<a class="btn btn-lg" href="{target.urlPrefix}{encodeURIComponent(window.location.href)}"
										 target="_blank">
										<svelte:component this={target.icon} class="size-14" />
									</a>
								{/each}
							</div>
							<div class="modal-action">
								<form method="dialog">
									<button class="btn">Close</button>
								</form>
							</div>
						</div>
					{/if}
				</dialog>
			</div>
		</div>
	</div>
	<div class="max-w-3xl flex flex-col gap-4 px-4 mt-4 mb-10">
		<h3 class="text-xl font-bold">Comments</h3>
		<div class="flex flex-col gap-3">
			<div class="flex gap-2">
				<img src={$page.data.session?.user?.image} class="size-12 rounded-full" alt="pp" />
				<span class="textarea flex-1 whitespace-pre" role="textbox" data-placeholder="Write a comment..."
							contenteditable
							bind:textContent={commentValue}></span>
			</div>
			{#if commentValue.length > 0}
				<div class="flex justify-end gap-3">
					<button class="btn btn-ghost btn-sm" on:click={clearCommentValue}>Cancel</button>
					<button class="btn btn-sm" on:click={submitComment}>Submit</button>
				</div>
			{/if}
		</div>
		{#await getComments()}
			<div>Loading...</div>
		{:then comments}
			{@const allComments = newComments.concat(comments).filter(c => !deletedComments.includes(c.id))}
			{#each allComments as comment}
				<div class="group flex gap-2">
					<img src={comment.creator.image} class="size-12 rounded-full" alt="pp" />
					<div class="flex-1 flex flex-col">
						<div class="flex gap-1">
							<div class="font-bold">@{comment.creator.handle}</div>
							<div class="text-neutral-content/50">{formatDistanceToNow(comment.createdAt, { addSuffix: true })}</div>
						</div>
						<div class="whitespace-pre-wrap">{comment.content}</div>
					</div>
					{#if $page.data.session?.user?.id === comment.creator.id}
						<div class="dropdown dropdown-end">
							<div tabindex="0" role="button" class="btn btn-sm btn-ghost opacity-0 group-hover:opacity-100">
								<DotsVerticalIcons class="size-5" />
							</div>
							<ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
								<li>
									<button>Edit</button>
								</li>
								<li>
									<button on:click={openDeleteCommentDialog(comment.id)}>Delete</button>
								</li>
							</ul>
						</div>
					{/if}
				</div>
				<dialog id="delete_comment_dialog_{comment.id}" class="modal">
					<div class="modal-box">
						<h3 class="font-bold text-lg">Delete comment ?</h3>
						<p class="py-4">This action is irreversible! <br> Are you sure you want to delete this comment ?</p>
						<div class="modal-action">
							<form method="dialog">
								<button class="btn">Cancel</button>
							</form>
							<button class="btn btn-ghost" on:click={() => { deleteComment(comment.id) }}>Delete</button>
						</div>
					</div>
					<form method="dialog" class="modal-backdrop">
						<button></button>
					</form>
				</dialog>
			{/each}
		{/await}
	</div>

</main>

<style>
    span[contenteditable]:empty:focus::before,
    span[contenteditable]:empty::before {
        content: attr(data-placeholder);
    }
</style>