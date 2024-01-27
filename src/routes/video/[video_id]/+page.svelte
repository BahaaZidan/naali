<script lang="ts">
	import ThumbUpIcon from 'virtual:icons/tabler/thumb-up';
	import ThumbDownIcon from 'virtual:icons/tabler/thumb-down';
	import ShareIcon from 'virtual:icons/tabler/share';
	import SendIcon from 'virtual:icons/tabler/send';

	export let data;
	const video = data.video;
</script>

<main class="h-screen">
	<div class="h-[65%] min-h-[400px] w-full">
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
					<div class="line-clamp-1 text-lg">{video.creator.name}</div>
					<div class="line-clamp-1 text-xs">1,000 Followers</div>
				</div>
				<button class="btn">Follow</button>
				<button class="btn">Sponsor</button>
			</div>
			<div class="flex gap-2">
				<div class="join">
					<button class="btn join-item">
						<ThumbUpIcon class="size-5" />
					</button>
					<button class="btn join-item">
						<ThumbDownIcon class="size-5" />
					</button>
				</div>
				<button class="btn">
					<ShareIcon class="size-5" />
					Repost
				</button>
				<button class="btn">
					<SendIcon class="size-5" />
					Send
				</button>
			</div>
		</div>
	</div>
</main>
