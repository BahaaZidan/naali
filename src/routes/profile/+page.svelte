<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="flex w-full flex-col items-center gap-3 bg-base-200 p-3">
	<div class="avatar">
		<div class="w-48 rounded-full">
			<img src={$page.data.session?.user?.image} alt="User avatar" />
		</div>
	</div>
	<h2 class="text-2xl font-semibold">{$page.data.session?.user?.name}</h2>
	<h4 class="text-lg">{$page.data.session?.user?.email}</h4>
	<button class="btn btn-active">follow</button>
	<button class="btn btn-active">support</button>
	<div class="divider my-0"></div>
	<span class="text-lg">Should we show followers count ?</span>
</div>
