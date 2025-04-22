<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { showToast } from '$lib/stores/toastStore';

	export let data: PageData;
	// Declare variables
	// Declare variables, allowing for initial undefined state
	let nama: string | undefined;
	let pic: string | null | undefined;
	let kontak: string | null | undefined;
	let alamat: string | null | undefined;

	// Assign values reactively when data.institution is available
	$: if (data.institution) {
		nama = data.institution.name;
		pic = data.institution.picName;
		kontak = data.institution.contact;
		alamat = data.institution.address;
	}
</script>

<div class="container mx-auto p-4">
	<h1 class="mb-4 text-2xl font-bold">Edit Institution</h1>

	<form
		method="POST"
		use:enhance={() => {
			return async ({ result }) => {
				if (result.type === 'redirect') {
					// Server action initiated a redirect (e.g., Update & Close)
					// The redirect is handled automatically by SvelteKit, no need for manual goto
					// We might not get a message back in this case, or the message could be in a cookie/session
					// For now, we won't show a toast on redirect unless the server sets a flash message.
					// If a flash message pattern is implemented later, this is where you'd read it.
				} else if (result.type === 'success' || result.type === 'failure') {
					// Server action returned data (success or validation failure)
					const serverResponse = result.data as
						| { success?: boolean; message?: string; action?: string }
						| undefined;

					if (serverResponse?.message) {
						showToast(serverResponse.message, serverResponse.success ? 'success' : 'error');
					} else {
						// Fallback message if server response doesn't include one
						showToast(
							result.type === 'success' ? 'Operation successful.' : 'Operation failed.',
							result.type === 'success' ? 'success' : 'error'
						);
					}

					// If the action was 'updateAndClose' and the operation was successful, redirect
					if (serverResponse?.action === 'updateAndClose' && serverResponse?.success) {
						goto('/institutions');
					}
				} else if (result.type === 'error') {
					// Server action threw an unexpected error
					// The error object might contain a message
					const errorMessage = (result.error as any)?.message || 'An unexpected error occurred.';
					showToast(errorMessage, 'error');
				}
			};
		}}
	>
		<div class="mb-4">
			<label for="nama" class="block text-sm font-medium text-gray-700">Nama</label>
			<input
				type="text"
				id="nama"
				name="nama"
				bind:value={nama}
				class="input input-bordered w-full"
				required
			/>
		</div>

		<div class="mb-4">
			<label for="pic" class="block text-sm font-medium text-gray-700">PIC</label>
			<input
				type="text"
				id="pic"
				name="pic"
				bind:value={pic}
				class="input input-bordered w-full"
				required
			/>
		</div>

		<div class="mb-4">
			<label for="kontak" class="block text-sm font-medium text-gray-700">Kontak</label>
			<input
				type="text"
				id="kontak"
				name="kontak"
				bind:value={kontak}
				class="input input-bordered w-full"
				required
			/>
		</div>

		<div class="mb-4">
			<label for="alamat" class="block text-sm font-medium text-gray-700">Alamat</label>
			<textarea
				id="alamat"
				name="alamat"
				bind:value={alamat}
				class="textarea textarea-bordered w-full"
				required
			></textarea>
		</div>

		<div class="flex space-x-2">
			<button type="submit" class="btn btn-primary">Update Institution</button>
			<button type="submit" name="action" value="updateAndClose" class="btn btn-secondary"
				>Update & Close</button
			>
		</div>
	</form>
</div>
