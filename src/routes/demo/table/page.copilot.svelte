<script lang="ts">
	import AdvancedTable from '$lib/components/Table/AdvancedTable.svelte';
	import type { ColumnDefinition } from '$lib/components/Table/types';

	// Sample Data
	const users = [
		{ id: 1, name: 'Alice', email: 'alice@example.com', status: 'Active' },
		{ id: 2, name: 'Bob', email: 'bob@example.com', status: 'Inactive' },
		{ id: 3, name: 'Charlie', email: 'charlie@example.com', status: 'Pending' },
		{ id: 4, name: 'Diana', email: 'diana@example.com', status: 'Active' },
		{ id: 5, name: 'Eve', email: 'eve@example.com', status: 'Inactive' },
		{ id: 6, name: 'Frank', email: 'frank@example.com', status: 'Active' },
		{ id: 7, name: 'Grace', email: 'grace@example.com', status: 'Pending' },
		{ id: 8, name: 'Heidi', email: 'heidi@example.com', status: 'Active' },
		{ id: 9, name: 'Ivan', email: 'ivan@example.com', status: 'Inactive' },
		{ id: 10, name: 'Judy', email: 'judy@example.com', status: 'Active' }
	];

	// Column Definitions
	const columns: ColumnDefinition<(typeof users)[0]>[] = [
		{ key: 'name', label: 'User Name', sortable: true },
		{ key: 'email', label: 'Email Address' },
		{
			key: 'status',
			label: 'Status',
			sortable: true,
			formatter: (value) => {
				const color =
					value === 'Active'
						? 'badge-success'
						: value === 'Inactive'
							? 'badge-error'
							: 'badge-warning';
				return `<span class=\"badge ${color} badge-sm\">${value}</span>`;
			}
		}
	];

	// Example bulk action handler
	function handleBulkExport(selectedItems: typeof users) {
		alert(`Exporting: ${selectedItems.map((u) => u.name).join(', ')}`);
	}
</script>

<div class="prose mx-auto my-8 max-w-2xl">
	<h1>AdvancedTable Demo</h1>
	<p>This page demonstrates the features of the <code>AdvancedTable</code> Svelte component.</p>
</div>

<div class="mx-auto max-w-4xl p-4">
	<AdvancedTable
		data={users}
		{columns}
		rowKey="id"
		allowSelection={true}
		pagination={true}
		defaultPageSize={5}
		tableClass="table-zebra w-full"
	>
		{#snippet loadingState()}
			<div class="flex items-center justify-center p-8">
				<span class="loading loading-spinner loading-lg mr-2"></span>
				<span>Loading users...</span>
			</div>
		{/snippet}
		{#snippet emptyState()}
			<div class="p-10 text-center">
				<img src="/favicon.png" alt="No data" class="mx-auto mb-4 h-16 w-16 opacity-60" />
				<p>No users found.</p>
			</div>
		{/snippet}
		{#snippet filterRenderer(params)}
			<input
				class="input input-bordered input-sm mb-2 w-full max-w-xs"
				placeholder="Search users..."
				on:input={(e) => params.updateFilter('global', e.currentTarget.value)}
			/>
		{/snippet}
		{#snippet bulkActionsRenderer(params)}
			<span class="mr-2">{params.selectedItems.length} selected</span>
			<button
				class="btn btn-sm btn-primary"
				on:click={() => handleBulkExport(params.selectedItems)}
			>
				Export Selected
			</button>
		{/snippet}
	</AdvancedTable>
</div>
