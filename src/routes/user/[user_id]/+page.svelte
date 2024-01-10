<script lang="ts">
	import { page } from '$app/stores';
	const videos = $page.data.videos;
</script>

<div class="flex w-full flex-col items-center gap-3 bg-base-200 p-3">
	<div class="avatar">
		<div class="w-48 rounded-full">
			<img src={$page.data.user?.image} alt="User avatar" />
		</div>
	</div>
	<h2 class="text-2xl font-semibold">{$page.data.user?.name}</h2>
	<h4 class="text-lg">{$page.data.user?.email}</h4>
	<button class="btn btn-active">follow</button>
	<button class="btn btn-active">support</button>
	<div class="divider my-0"></div>
	<div class="flex">
	{#each videos as video}
	<a href={`/video/${video.id}`}>
		<div class="card w-96 bg-base-100 shadow-xl">
			<figure><img src={video.thumbnail} alt="Shoes" /></figure>
			<div class="card-body">
				<h2 class="card-title">{video.name}</h2>
			</div>
		</div>
	</a>
	{/each}
</div>
</div>
