<script>
	import { navigating, page, updated } from '$app/stores';
	import '../app.css';
</script>

{#if $navigating}
	<progress class="progress w-full"></progress>
{/if}

<nav class="navbar bg-base-100">
	<div class="flex flex-1 gap-4">
		<a class="btn btn-ghost text-2xl" href="/" aria-current={$page.url.pathname === '/'}>naali</a>
		<a class="link-hover" href="/about" aria-current={$page.url.pathname === '/about'}>about</a>
		<a class="link-hover" href="/pricing" aria-current={$page.url.pathname === '/pricing'}>
			pricing
		</a>
	</div>
	<div class="flex flex-none gap-4">
		<a class="link-hover" href="/signup" aria-current={$page.url.pathname === '/signup'}
			>create an account</a
		>
		<a class="link-hover" href="/login" aria-current={$page.url.pathname === '/login'}>login</a>
	</div>
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
