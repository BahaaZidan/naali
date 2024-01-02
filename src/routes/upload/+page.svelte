<script lang="ts">
	import { PUBLIC_R2_PUBLIC_ACCESS_URL } from '$env/static/public';

	const handleFileUpload = async (e: Event) => {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];

		if (file) {
			const getPresignedUrlResponse = await fetch('/upload', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					fileName: file.name,
					fileType: file.type
				})
			});

			if (!getPresignedUrlResponse.ok) {
				console.error('Failed to get presigned URL');
			}

			const { presignedUrl, objectKey } = await getPresignedUrlResponse.json();

			const uploadToR2Response = await fetch(presignedUrl, {
				method: 'PUT',
				headers: {
					'Content-Type': file.type
				},
				body: file
			});

			if (!uploadToR2Response.ok) {
				console.error('Failed to upload file to R2');
			} else {
				console.log(`${PUBLIC_R2_PUBLIC_ACCESS_URL}/${objectKey}`);
			}
		}
	};
</script>

<div class="flex h-screen flex-col items-center justify-center">
	<h1 class="mb-3 text-3xl">Upload video</h1>
	<input
		type="file"
		accept="video/*"
		class="file-input file-input-bordered w-full max-w-xs"
		on:change={handleFileUpload}
	/>
</div>
