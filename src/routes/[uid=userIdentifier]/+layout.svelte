<script lang="ts">
	import { enhance } from '$app/forms';
	import InfoCircleIcon from 'virtual:icons/tabler/info-circle';

	export let data;
</script>


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
					<form method="post" action="?/unfollow" use:enhance>
						<input type="hidden" value={data.user.id} name="id" />
						<button class="btn btn-sm" type="submit">Unfollow</button>
					</form>
				{:else}
					<form method="post" action="?/follow" use:enhance>
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
<div class="divider my-0"></div>
<slot />