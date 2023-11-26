<script>
	import { signIn, signOut } from '@auth/sveltekit/client';
	import { page } from '$app/stores';
</script>

{#if $page.data.session?.user}
	<p>Signed in as {$page.data.session.user.email}</p>
	<button on:click={() => signOut()}>Sign out</button>
	<img src="https://cdn.pixabay.com/photo/2017/08/11/19/36/vw-2632486_1280.png" />
{:else}
	<div class="flex items-center gap-3 p-3">
		<p class="text-2xl">Not signed in.</p>
		<button class="btn" on:click={() => signIn('github')}>Sign in</button>
	</div>
{/if}

<div class="hero bg-base-200 py-5">
	<div class="hero-content text-center">
		<div class="max-w-md">
			<h1 class="text-5xl font-bold">Write, earn, and support your favorite creators</h1>
			<h2 class="text-5xl">All for $1</h2>
			<p class="py-6">
				Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
				quasi. In deleniti eaque aut repudiandae et a id nisi.
			</p>
			<button class="btn btn-primary">Get Started</button>
		</div>
	</div>
</div>

<div
	class="hero h-80"
	style="background-image: url(https://daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.jpg);"
>
	<div class="hero-overlay bg-opacity-60"></div>
	<div class="hero-content text-neutral-content text-center">
		<div class="max-w-md">
			<h1 class="mb-5 text-5xl font-bold">Hello there</h1>
			<p class="mb-5">
				Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
				quasi. In deleniti eaque aut repudiandae et a id nisi.
			</p>
			<button class="btn btn-primary">Get Started</button>
		</div>
	</div>
</div>
