<script lang="ts">
	import { page } from '$app/stores';
	import FullScreenContainer from '$lib/components/full-screen-container.svelte';

	const routes = [
		{
			name: 'Settings',
			route: '/studio'
		},
		{
			name: 'Videos',
			route: '/studio/videos'
		},
		{
			name: 'Analytics',
			route: '/studio/analytics'
		},
		{
			name: 'Subtitles',
			route: '/studio/subtitles'
		}
	];
</script>

<FullScreenContainer>
	<div class="flex h-full">
		<ul class="menu menu-lg w-56 border-r border-gray-600">
			{#each routes as route}
				<li class="mb-2">
					<a href={route.route} class:active={$page.url.pathname === route.route}>{route.name}</a>
				</li>
			{/each}
		</ul>
		<slot />
	</div>
</FullScreenContainer>
