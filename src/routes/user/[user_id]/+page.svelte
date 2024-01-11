<script lang="ts">
	export let data;
	const videos = data.videos;
	const user = data.user;
</script>

<div class="flex w-full flex-col items-center gap-3 bg-base-200 p-3">
	<div class="avatar">
		<div class="w-48 rounded-full">
			<img src={user?.image} alt="User avatar" />
		</div>
	</div>
	<h2 class="text-2xl font-semibold">{user?.name}</h2>
	<h4 class="text-lg">{user?.email}</h4>
	<button class="btn btn-active">follow</button>
	<button class="btn btn-active">support</button>
	<div class="divider my-0"></div>
	{#if videos}
		<div class="flex flex-wrap justify-center gap-3">
			{#each videos as video}
				<a href={`/video/${video.id}`}>
					<div class="card w-96 bg-base-100 p-3 shadow-xl">
						<figure>
							<img src={video.thumbnail} class="h-52 w-96 object-contain" alt="Thumbnail" />
						</figure>
						<div class="card-body">
							<h2 class="card-title line-clamp-2">{video.name}</h2>
						</div>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</div>
