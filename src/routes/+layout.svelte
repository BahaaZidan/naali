<script>
	import { navigating, page, updated } from '$app/stores';
	import '../app.css';
</script>

{#if $navigating}
	<progress class="progress w-full"></progress>
{/if}

<nav>
	<a href="/" aria-current={$page.url.pathname === '/'}>home</a>
	<a href="/about" data-sveltekit-preload-data aria-current={$page.url.pathname === '/about'}
		>about</a
	>
	<a href="/blog" aria-current={$page.url.pathname === '/blog'}>blog</a>
</nav>

{#if $updated}
	<div class="toast toast-end">
		<div class="alert alert-info">
			<span>A new version of the app is available!</span>
			<button
				class="btn btn-primary"
				on:click={() => {
					location.reload();
				}}>Reload</button
			>
		</div>
	</div>
{/if}

<slot />
