<script lang="ts">
	import VideoCard from '$lib/components/video-card.svelte';

	export let data;
	const videos = data.videos;
	const private_videos = videos.filter((v) => v.publish_status === 'private');
	const public_videos = videos.filter((v) => v.publish_status === 'public');
	const user = data.user;
	const is_own_profile = data.is_own_profile;
</script>

<div class="flex w-full gap-3 p-3">
	<div class="avatar">
		<div class="w-28 rounded-full">
			<img src={user.image} alt="User avatar" />
		</div>
	</div>
	<div class="flex flex-col gap-1">
		<p class="font-bold">{user.name}</p>
		<p>{user.email}</p>
		{#if !is_own_profile}
			<div class="flex gap-2">
				<button class="btn btn-sm">follow</button>
				<button class="btn btn-sm">support</button>
			</div>
		{/if}
	</div>
</div>
<div class="divider my-0"></div>

{#if is_own_profile && private_videos.length}
	<div class="p-3">
		<h3 class="text-xl font-bold">Private Videos</h3>
		<h4 class="mb-2 text-sm">
			Videos you upload are private by default. You can publish them here or from your <a
				href="/studio"
				class="link-hover link">studio</a
			>.
		</h4>
		<div class="flex flex-wrap gap-3">
			{#each private_videos as video}
				<VideoCard
					id={video.id}
					name={video.name}
					created_at={video.created_at}
					thumbnail={video.thumbnail}
					is_private
					on_publish_click={() => {
						const dialog = document.querySelector(`#publish_vid_${video.id}_dialog`);
						// @ts-ignore
						dialog?.showModal();
					}}
				/>
				<dialog id={`publish_vid_${video.id}_dialog`} class="modal">
					<div class="modal-box">
						<h3 class="text-lg font-bold">Edit info before publishing!</h3>
						<form method="POST" id={`publish_vid_${video.id}_form`}>
							<input name="id" type="text" class="hidden" value={video.id} />
							<label>
								<div class="label">
									<span class="label-text">Name</span>
								</div>
								<input
									name="name"
									type="text"
									class="input input-bordered w-full max-w-xs"
									value={video.name}
								/>
							</label>
							<label>
								<div class="label">
									<span class="label-text">Description</span>
								</div>
								<textarea
									name="description"
									class="textarea textarea-bordered h-52 w-full"
									value={video.description}
								/>
							</label>
						</form>
						<div class="modal-action">
							<form method="dialog">
								<!-- if there is a button in form, it will close the modal -->
								<button class="btn">Close</button>
							</form>
							<button class="btn" type="submit" form={`publish_vid_${video.id}_form`}
								>Publish</button
							>
						</div>
					</div>
				</dialog>
			{/each}
		</div>
	</div>
	<div class="divider my-0"></div>
{/if}

<div class="p-3">
	{#if is_own_profile}
		<h3 class="mb-2 text-xl font-bold">Public Videos</h3>
	{/if}
	<div class="flex flex-wrap gap-3">
		{#each public_videos as video}
			<VideoCard
				id={video.id}
				name={video.name}
				created_at={video.created_at}
				thumbnail={video.thumbnail}
			/>
		{/each}
	</div>
</div>
