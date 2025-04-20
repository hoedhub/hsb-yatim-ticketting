<script lang="ts">
	import type { PageData } from './$types';
	// No need for Flowbite Svelte components if using raw DaisyUI classes
	// import { Table, TableHead, TableBody, TableRow, TableHeadCell, TableDataCell } from 'flowbite-svelte';
	// import { Button } from 'flowbite-svelte';
	// import { goto } from '$app/navigation'; // Not strictly needed for simple <a> tags

	export let data: PageData;

	const institutions = data.institutions;

	// Placeholder for delete action - will be implemented later in C-04
	// Using a simple console log for now
	const handleDelete = (id: number) => {
		console.log('Delete institution with ID:', id);
		// TODO: Implement delete logic (form action)
		// This will likely involve a form submission or fetch request to a server endpoint/action
	};
</script>

<div class="container mx-auto p-4">
	<h1 class="mb-4 text-2xl font-bold">Daftar Institusi</h1>

	<div class="mb-4">
		<a href="/institutions/new" class="btn btn-primary">Tambah Institusi Baru</a>
	</div>

	<div class="overflow-x-auto">
		<table class="table w-full">
			<thead>
				<tr>
					<th>Nama</th>
					<th>PIC</th>
					<th>Kontak</th>
					<th>Alamat</th>
					<th>Aksi</th>
				</tr>
			</thead>
			<tbody>
				{#each institutions as institution (institution.id)}
					<tr>
						<td>{institution.name}</td>
						<td>{institution.picName}</td>
						<td>{institution.contact}</td>
						<td>{institution.address}</td>
						<td>
							<a href="/institutions/{institution.id}/edit" class="btn btn-sm btn-ghost">Edit</a>
							<!-- Using a button with click handler for delete -->
							<button class="btn btn-sm btn-ghost" on:click={() => handleDelete(institution.id)}
								>Hapus</button
							>
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="5" class="text-center">Belum ada data institusi.</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
