<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation'; // Import goto for redirection
	import type { ActionData } from './$types';
	import { toast } from '$lib/components/toast/toast.service.svelte';
	import { ChevronLeft } from 'lucide-svelte';

	let { form }: { form: ActionData } = $props();
</script>

<div class="container mx-auto p-4">
	<div class="mb-6 flex items-center">
		<button class="btn btn-circle btn-ghost" onclick={() => history.back()}>
			<ChevronLeft />
		</button>
		<h1 class="text-2xl font-bold">Tambah Institusi Baru</h1>
	</div>

	<div class="card bg-base-100 w-full max-w-lg shadow-xl">
		<div class="card-body">
			<form
				method="POST"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.type === 'success') {
							const serverResponse = result.data as
								| { success?: boolean; message?: string }
								| undefined;
							if (serverResponse?.message) {
								toast.success(serverResponse.message);
								goto('/institutions'); // Redirect after showing success toast
							} else {
								toast.success('Operation successful.');
								goto('/institutions'); // Redirect even with fallback message
							}
						} else if (result.type === 'failure') {
							const serverResponse = result.data as
								| { success?: boolean; message?: string; errors?: any }
								| undefined;
							if (serverResponse?.message) {
								// Only show a general error toast if there's a message but no specific field errors
								if (!serverResponse.errors) {
									toast.error(serverResponse.message);
								}
							} else {
								// Fallback error message if no specific message from server action data
								toast.error('Operation failed.');
							}
						}
						// No explicit handling for result.type === 'redirect' needed here
					};
				}}
			>
				<!-- Nama Institusi -->
				<div class="form-control mb-4 w-full">
					<label class="label" for="nama">
						<span class="label-text">Nama Institusi</span>
					</label>
					<input
						type="text"
						id="nama"
						name="nama"
						class="input input-bordered w-full"
						class:input-error={form?.errors?.nama}
						value={form?.nama ?? ''}
						required
						aria-invalid={form?.errors?.nama ? 'true' : undefined}
						aria-describedby={form?.errors?.nama ? 'nama-error' : undefined}
					/>
					{#if form?.errors?.nama}
						<div class="label" id="nama-error">
							<span class="label-text-alt text-error">{form.errors.nama}</span>
						</div>
					{/if}
				</div>

				<!-- Nama PIC -->
				<div class="form-control mb-4 w-full">
					<label class="label" for="pic">
						<span class="label-text">Nama PIC</span>
					</label>
					<input
						type="text"
						id="pic"
						name="pic"
						class="input input-bordered w-full"
						class:input-error={form?.errors?.pic}
						value={form?.pic ?? ''}
						aria-invalid={form?.errors?.pic ? 'true' : undefined}
						aria-describedby={form?.errors?.pic ? 'pic-error' : undefined}
					/>
					{#if form?.errors?.pic}
						<div class="label" id="pic-error">
							<span class="label-text-alt text-error">{form.errors.pic}</span>
						</div>
					{/if}
				</div>

				<!-- Kontak -->
				<div class="form-control mb-4 w-full">
					<label class="label" for="kontak">
						<span class="label-text">Kontak</span>
					</label>
					<input
						type="text"
						id="kontak"
						name="kontak"
						class="input input-bordered w-full"
						class:input-error={form?.errors?.kontak}
						value={form?.kontak ?? ''}
						aria-invalid={form?.errors?.kontak ? 'true' : undefined}
						aria-describedby={form?.errors?.kontak ? 'kontak-error' : undefined}
					/>
					{#if form?.errors?.kontak}
						<div class="label" id="kontak-error">
							<span class="label-text-alt text-error">{form.errors.kontak}</span>
						</div>
					{/if}
				</div>

				<!-- Alamat -->
				<div class="form-control mb-4 w-full">
					<label class="label" for="alamat">
						<span class="label-text">Alamat</span>
					</label>
					<textarea
						id="alamat"
						name="alamat"
						class="textarea textarea-bordered w-full"
						class:textarea-error={form?.errors?.alamat}
						aria-invalid={form?.errors?.alamat ? 'true' : undefined}
						aria-describedby={form?.errors?.alamat ? 'alamat-error' : undefined}
						>{form?.alamat ?? ''}</textarea
					>
					{#if form?.errors?.alamat}
						<div class="label" id="alamat-error">
							<span class="label-text-alt text-error">{form.errors.alamat}</span>
						</div>
					{/if}
				</div>

				<!-- Submit Button -->
				<div class="form-control mt-6">
					<button type="submit" class="btn btn-primary">Tambah Institusi</button>
				</div>
			</form>
		</div>
	</div>
</div>
