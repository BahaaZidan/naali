<script lang="ts">
	import { enhance } from '$app/forms';
	import InfoCircleIcon from 'virtual:icons/tabler/info-circle';
	import { page } from '$app/stores';

	export let data;

	$: baseProfileUrl = `/${data.user.handle || data.user.id}`;
</script>

<svelte:head>
	<title>{data.seo.title}</title>
	{#each Object.entries(data.seo.og) as [key, value]}
		<meta property="og:{key}" content={value} />
	{/each}
</svelte:head>

{#if !data.user.handle}
	<div role="alert" class="alert">
		<InfoCircleIcon />
		<span>You need to set your @handle in <a href="/studio" class="link-hover">settings.</a></span>
	</div>
{/if}

<div class="flex w-full gap-3 p-3">
	<div class="avatar">
		<div class="w-28 rounded-full">
			<img src={data.user.image} alt="User avatar" />
		</div>
	</div>
	<div class="flex flex-col gap-1">
		<p class="font-bold">{data.user.name}</p>
		{#if data.user.handle}<p>@{data.user.handle}</p>{/if}
		{#if !data.is_own_profile}
			<div class="flex gap-2">
				{#if data.is_followed}
					<form
						method="post"
						action="?/unfollow"
						use:enhance={() => {
							return async ({ result, update }) => {
									if (result.type !== "success") return update();
									data.is_followed = false;
								}
							}
						}
					>
						<input type="hidden" value={data.user.id} name="id" />
						<button class="btn btn-sm" type="submit">Unfollow</button>
					</form>
				{:else}
					<form
						method="post"
						action="?/follow"
						use:enhance={() => {
							return async ({ result, update }) => {
									if (result.type !== "success") return update();
									data.is_followed = true;
								}
							}
						}
					>
						<input type="hidden" value={data.user.id} name="id" />
						<button class="btn btn-sm" type="submit">Follow</button>
					</form>
				{/if}
				<button class="btn btn-sm">Sponsor</button>
			</div>
		{:else}
			<div class="flex gap-2">
				<a class="btn btn-sm" href="/studio">Edit profile</a>
				<a class="btn btn-sm" href="/studio/videos">Manage videos</a>
			</div>
		{/if}
	</div>
</div>
<div role="tablist" class="tabs tabs-bordered">
	<a role="tab" class="tab" class:tab-active={!$page.url.pathname.includes('activity')} href={baseProfileUrl}>Videos</a>
	<a role="tab" class="tab tab-active" class:tab-active={$page.url.pathname.includes('activity')}
		 href="{baseProfileUrl}/activity">Activity</a>
</div>
<slot />