<script>
	import { navigating, page, updated } from '$app/stores';
	import { signOut } from '@auth/sveltekit/client';
	import '../app.css';
	import { onMount } from 'svelte';

	onMount(() => {
		const navbarElement = document.getElementById('main-navbar')?.offsetHeight;
		if (navbarElement)
			document.documentElement.style.setProperty('--nav-height', `${navbarElement}px`);
	});
</script>

{#if $navigating}
	<div class="h-1.5 max-h-1.5 w-full">
		<progress class="progress mb-3 h-1.5 w-full rounded-none"></progress>
	</div>
{:else}
	<div class="h-1.5 w-full"></div>
{/if}

<nav id="main-navbar" class="navbar flex justify-between bg-base-100">
	<div class="flex">
		<a
			class="link-hover font-mono text-2xl font-bold"
			href="/"
			aria-current={$page.url.pathname === '/'}>naali</a
		>
	</div>
	<div class="flex flex-1 justify-center">
		<input type="text" placeholder="Search" class="input input-bordered w-full max-w-md" />
		<button></button>
	</div>
	<div class="flex flex-none gap-4 pr-3">
		{#if $page.data.session?.user}
			<a
				class="link-hover font-mono"
				href="/upload"
				aria-current={$page.url.pathname === '/upload'}
			>
				upload
			</a>
			<div class="dropdown dropdown-end">
				<div tabindex="0" role="button" class="avatar btn btn-circle btn-ghost">
					<div class="w-10 rounded-full">
						<img alt="User avatar" src={$page.data.session.user.image} />
					</div>
				</div>
				<ul
					class="menu dropdown-content menu-md z-[9999] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
				>
					<li>
						<a class="link-hover" href="/user/{$page.data.session?.user.id}">Profile</a>
					</li>
					<li><a class="link-hover" href="/studio">Settings</a></li>
					<div class="divider m-0"></div>
					<li><button class="link-hover" on:click={() => signOut()}>Logout</button></li>
				</ul>
			</div>
		{:else}
			<a class="link-hover font-mono" href="/login" aria-current={$page.url.pathname === '/login'}>
				login
			</a>
		{/if}
	</div>
</nav>

{#if $updated}
	<div class="toast toast-end">
		<div class="alert alert-success">
			<span>A new version of the app is available!</span>
			<button
				class="btn btn-neutral btn-active"
				on:click={() => {
					location.reload();
				}}
			>
				Reload
			</button>
		</div>
	</div>
{/if}

<slot />
