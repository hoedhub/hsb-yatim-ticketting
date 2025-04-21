<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<div class="container mx-auto p-4">
	<h1 class="mb-6 text-2xl font-bold">Tambah Institusi Baru</h1>

	{#if form?.error}
		<div role="alert" class="alert alert-error mb-4">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 shrink-0 stroke-current"
				fill="none"
				viewBox="0 0 24 24"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
				/></svg
			>
			<span>{form.error}</span>
		</div>
	{/if}

	<div class="card bg-base-100 w-full max-w-lg shadow-xl">
		<div class="card-body">
			<form method="POST" use:enhance>
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
