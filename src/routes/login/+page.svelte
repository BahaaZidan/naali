<script>
	import GoogleIcon from 'virtual:icons/tabler/brand-google-filled';
	import AppleIcon from 'virtual:icons/tabler/brand-apple-filled';
	import GitHubIcon from 'virtual:icons/tabler/brand-github-filled';
	import { signIn } from '@auth/sveltekit/client';
	import FullScreenContainer from '$lib/components/full-screen-container.svelte';
</script>

<div class="hero bg-base-200">
	<FullScreenContainer>
		<div class="hero-content min-h-[50vh] flex-col lg:flex-row-reverse">
			<div class="card w-80 max-w-sm shrink-0 items-center bg-base-100 p-7 shadow-2xl">
				<h2 class="text-2xl">Login</h2>
				<div class="form-control mt-6 w-full">
					<button class="btn btn-error btn-active text-white" on:click={() => signIn('google')}>
						<GoogleIcon width={32} height={32} />
						Google
					</button>
				</div>
				<div class="form-control mt-6 w-full">
					<button class="btn btn-active">
						<AppleIcon width={32} height={32} />
						Apple
					</button>
				</div>
				<div class="form-control mt-6 w-full">
					<button class="btn btn-neutral btn-active" on:click={() => signIn('github')}>
						<GitHubIcon width={32} height={32} />
						GitHub
					</button>
				</div>
			</div>
		</div>
	</FullScreenContainer>
</div>
