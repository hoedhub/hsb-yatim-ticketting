<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { /*invalidate*/ goto } from '$app/navigation'; // Import invalidate for data refresh
	import { toast } from '$lib/components/toast/toast.service.svelte';
	import AdvancedTable from '$lib/components/Table/AdvancedTable.svelte';
	import type { ColumnDefinition, ActionDefinition } from '$lib/components/Table/types';

	export let data: PageData;
	// Reactive statement to watch the incoming data prop
	// $: console.log(`[Page Component - ${new Date().toISOString()}] Data prop updated:`, data);

	// Reactive statement deriving the list used in the template
	$: institutions = data.institutions;
	// $: console.log(
	// 	`[Page Component - ${new Date().toISOString()}] Reactive institutions list updated:`,
	// 	institutions
	// );

	const columns: ColumnDefinition<(typeof institutions)[0]>[] = [
		{ key: 'name', label: 'Nama' },
		{ key: 'picName', label: 'PIC' },
		{ key: 'contact', label: 'Kontak' },
		{ key: 'address', label: 'Alamat' }
	];

	const actions: ActionDefinition<(typeof institutions)[0]>[] = [
		{
			label: 'Edit',
			handler: (institution) => goto('/institutions/' + institution.id + '/edit')
		},
		{
			label: 'Hapus',
			class: 'text-error',
			handler: (institution) => {
				const modal = document.getElementById(
					`delete_modal_${institution.id}`
				) as HTMLDialogElement;
				if (modal) {
					modal.showModal();
				}
			}
		}
	];

	const rowKey = 'id';
	// No need for Flowbite Svelte components if using raw DaisyUI classes
	// import { Table, TableHead, TableBody, TableRow, TableHeadCell, TableDataCell } from 'flowbite-svelte';
	// import { Button } from 'flowbite-svelte';
	// import { goto } from '$app/navigation'; // Not strictly needed for simple <a> tags

	// No need for a client-side handleDelete function anymore,
	// deletion will be handled by a server form action triggered via modal.
</script>

<div class="container mx-auto p-4">
	<h1 class="mb-4 text-2xl font-bold">Daftar Institusi</h1>

	<div class="mb-4">
		<a href="/institutions/new" class="btn btn-primary">Tambah Institusi Baru</a>
	</div>

	<AdvancedTable data={institutions} {columns} {rowKey} {actions} tableClass="table w-full">
		{#snippet emptyState()}
			<tr class="text-center">
				<td colspan={columns.length + (actions.length > 0 ? 1 : 0)} class="p-10">
					<p class="text-warning text-lg font-semibold">⚠️ Belum ada data institusi.</p>
				</td>
			</tr>
		{/snippet}
	</AdvancedTable>
</div>

<!-- DaisyUI Modal for Delete Confirmation -->
{#each institutions as institution (institution.id)}
	<dialog id="delete_modal_{institution.id}" class="modal">
		<div class="modal-box">
			<h3 class="text-lg font-bold">Konfirmasi Penghapusan</h3>
			<p class="py-4">
				Apakah Anda yakin ingin menghapus institusi "<span class="font-semibold"
					>{institution.name}</span
				>"? Tindakan ini tidak dapat dibatalkan.
			</p>
			<div class="modal-action">
				<form method="dialog">
					<!-- Button to close the modal -->
					<button class="btn">Batal</button>
				</form>
				<!-- Form to trigger the delete server action -->
				<form
					method="POST"
					action="?/delete"
					use:enhance={() => {
						// This function runs *before* the request is sent.
						// Good place for optimistic UI start if needed.
						// console.log('Submitting delete form for ID:', institution.id);

						return async ({ result }) => {
							// This function runs *after* the server action responds.

							// Always try to close the modal first, regardless of outcome
							const modal = document.getElementById(
								`delete_modal_${institution.id}`
							) as HTMLDialogElement;
							if (modal) {
								modal.close();
							} else {
								console.warn(`Modal delete_modal_${institution.id} not found.`);
							}

							if (result.type === 'success') {
								// console.log('Delete successful. Result:', result);
								const serverResponse = result.data as
									| { success?: boolean; message?: string }
									| undefined;

								// Show success toast (use ?? for a default message)
								toast.success(serverResponse?.message ?? 'Institusi berhasil dihapus.');

								// Inside the use:enhance callback, replace the invalidate line:
								// await invalidate(() => true);
								// console.log('Attempting to refresh via goto...');
								await goto(window.location.href, {
									invalidateAll: true, // Force all load functions for the page to re-run
									keepFocus: true // Try to keep focus where it was (good UX)
									// replaceState: true // Optional: Prevents adding a new history entry
								});
								// console.log('goto refresh called.');
							} else if (result.type === 'failure') {
								console.error('Delete failed. Result:', result);
								const serverResponse = result.data as
									| { success?: boolean; message?: string }
									| undefined;
								toast.error(serverResponse?.message ?? 'Gagal menghapus institusi.');
							} else if (result.type === 'error') {
								// Handle unexpected errors during the action
								console.error('Delete error. Result:', result);
								toast.error(result.error.message ?? 'Terjadi kesalahan saat menghapus.');
							}
						};
					}}
				>
					<input type="hidden" name="id" value={institution.id} />
					<button type="submit" class="btn btn-error">Hapus</button>
				</form>
			</div>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button>close</button>
		</form>
	</dialog>
{/each}
