<script lang="ts">
	import AdvancedTable from '$lib/components/Table/AdvancedTable.svelte';
	import type {
		ColumnDefinition,
		ActionDefinition,
		FetchParams,
		FetchResult,
		TableRowData
	} from '$lib/components/Table/types';
	import BalanceCell from '$lib/components/Table/Demo/BalanceCell.svelte'; // Import custom cell
	import { getProperty } from '$lib/components/Table/utils'; // Import utility for server mock

	// --- Common Setup ---
	type UserData = {
		id: number;
		name: string;
		email: string;
		status: 'Active' | 'Inactive' | 'Pending';
		registrationDate: string; // ISO String date
		balance: number;
		isAdmin: boolean;
	};

	// Define actions once
	const userActions: ActionDefinition<UserData>[] = [
		{
			label: 'View Details',
			handler: (row) => alert(`Viewing ${row.name} (ID: ${row.id})`)
		},
		{
			label: 'Edit User',
			handler: (row) => alert(`Editing ${row.name}`),
			hidden: (row) => row.status === 'Inactive' // Hide edit for inactive users
		},
		{
			label: 'Toggle Admin',
			handler: (row) => console.log(`Toggling admin for ${row.name}`),
			disabled: (row) => row.id === 1 // Cannot toggle admin for user ID 1
		},
		{
			label: 'Delete',
			class: 'text-error', // Add custom class for styling
			handler: (row) => {
				if (confirm(`Are you sure you want to delete ${row.name}?`)) {
					console.log('Deleting user:', row.id);
					// In a real app, you'd update data source here
				}
			},
			hidden: (row) => row.isAdmin === true // Don't allow deleting admins
		}
	];

	// --- Client-Side Demo Data & Config ---
	const sampleClientData: UserData[] = [
		{
			id: 1,
			name: 'Alice Wonderland',
			email: 'alice@example.com',
			status: 'Active',
			registrationDate: '2023-01-15T10:00:00Z',
			balance: 1250.75,
			isAdmin: true
		},
		{
			id: 2,
			name: 'Bob The Builder',
			email: 'bob@sample.org',
			status: 'Active',
			registrationDate: '2023-03-22T14:30:00Z',
			balance: -50.0,
			isAdmin: false
		},
		{
			id: 3,
			name: 'Charlie Chaplin',
			email: 'charlie@domain.net',
			status: 'Pending',
			registrationDate: '2023-05-01T09:15:00Z',
			balance: 0,
			isAdmin: false
		},
		{
			id: 4,
			name: 'Diana Prince',
			email: 'diana@themyscira.org',
			status: 'Inactive',
			registrationDate: '2022-11-30T23:59:00Z',
			balance: 5000.0,
			isAdmin: false
		},
		{
			id: 5,
			name: 'Ethan Hunt',
			email: 'ethan@imf.gov',
			status: 'Active',
			registrationDate: '2023-07-10T11:00:00Z',
			balance: 750.25,
			isAdmin: false
		},
		{
			id: 6,
			name: 'Fiona Gallagher',
			email: 'fiona@southside.com',
			status: 'Active',
			registrationDate: '2023-02-18T16:45:00Z',
			balance: -200.5,
			isAdmin: false
		},
		{
			id: 7,
			name: 'George Constanza',
			email: 'george@pendant.com',
			status: 'Pending',
			registrationDate: '2023-08-01T12:00:00Z',
			balance: 10.0,
			isAdmin: false
		},
		{
			id: 8,
			name: 'Hannah Montana',
			email: 'hannah@secretstar.tv',
			status: 'Inactive',
			registrationDate: '2023-04-05T18:20:00Z',
			balance: 10000.0,
			isAdmin: false
		},
		{
			id: 9,
			name: 'Isaac Newton',
			email: 'isaac@gravity.uk',
			status: 'Active',
			registrationDate: '2023-06-12T08:00:00Z',
			balance: 999.99,
			isAdmin: false
		},
		{
			id: 10,
			name: 'Jane Doe',
			email: 'jane@anonymous.com',
			status: 'Active',
			registrationDate: '2023-09-01T00:00:00Z',
			balance: 300.0,
			isAdmin: false
		}
	];

	const clientColumns: ColumnDefinition<UserData>[] = [
		{ key: 'name', label: 'Name', sortable: true },
		{ key: 'email', label: 'Email', sortable: true },
		{
			key: 'status',
			label: 'Status',
			sortable: true,
			formatter: (value) => {
				// Custom Badge Formatter
				const color =
					value === 'Active'
						? 'badge-success'
						: value === 'Inactive'
							? 'badge-error'
							: 'badge-warning';
				return `<span class="badge ${color} badge-sm">${value}</span>`;
			}
		},
		{
			key: 'registrationDate',
			label: 'Registered On',
			sortable: true,
			formatter: (value) => (value ? new Date(value).toLocaleDateString() : '-') // Simple Date Formatting
		},
		{
			key: 'balance',
			label: 'Balance',
			sortable: true,
			component: BalanceCell, // Use Custom Component
			cellClass: 'text-right font-mono', // Align right
			headerClass: 'text-right'
		},
		{
			key: 'isAdmin',
			label: 'Admin',
			formatter: (value) => (value ? '✔️' : '❌'), // Simple boolean display
			cellClass: 'text-center',
			headerClass: 'text-center'
		}
	];

	function handleClientBulkDelete(selectedItems: UserData[]) {
		if (confirm(`Delete ${selectedItems.length} selected users? (Client Demo)`)) {
			console.log(
				'Client Bulk Deleting:',
				selectedItems.map((u) => u.id)
			);
			// NOTE: In a real client-side scenario, you would need to update the
			// 'sampleClientData' array (or signal) and potentially make it bindable ($props().data)
			alert('Simulated client-side delete. Data array not actually modified in this demo.');
		}
	}

	// --- Server-Side Demo Data & Config ---

	// Mock a larger dataset for server simulation
	const mockServerData: UserData[] = Array.from({ length: 103 }, (_, i) => {
		const id = i + 1;
		const statuses: UserData['status'][] = ['Active', 'Inactive', 'Pending'];
		const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
		const randomBalance = Math.round((Math.random() * 10000 - 2000) * 100) / 100;
		const registration = new Date(
			Date.now() - Math.floor(Math.random() * 365 * 2) * 24 * 60 * 60 * 1000
		);
		return {
			id: id,
			name: `Server User ${id}`,
			email: `user${id}@server.com`,
			status: randomStatus,
			registrationDate: registration.toISOString(),
			balance: randomBalance,
			isAdmin: id % 15 === 0 // Some admins randomly
		};
	});

	// Mock Server Fetch Function
	async function mockFetchData(params: FetchParams<UserData>): Promise<FetchResult<UserData>> {
		console.log('Server Fetch Params:', params);
		await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500)); // Simulate network delay

		// Simulate potential error
		if (params.filters.global?.toLowerCase().includes('error')) {
			throw new Error('Simulated server error!');
		}

		let filteredData = [...mockServerData];

		// Filtering
		if (params.filters.global) {
			const searchTerm = params.filters.global.toLowerCase();
			filteredData = filteredData.filter(
				(user) =>
					user.name.toLowerCase().includes(searchTerm) ||
					user.email.toLowerCase().includes(searchTerm)
			);
		}
		// Add more column filter logic here if implemented

		// Sorting
		if (params.sortKey) {
			const sk = params.sortKey;
			const dir = params.sortDirection === 'asc' ? 1 : -1;
			filteredData.sort((a, b) => {
				const valA = getProperty(a, String(sk));
				const valB = getProperty(b, String(sk));
				// Basic comparison, could use advanced sorter
				if (valA < valB) return -1 * dir;
				if (valA > valB) return 1 * dir;
				return 0;
			});
		}

		const totalItems = filteredData.length;

		// Pagination
		const start = (params.page - 1) * params.pageSize;
		const end = start + params.pageSize;
		const pageData = filteredData.slice(start, end);

		return {
			data: pageData,
			totalItems: totalItems
		};
	}

	// Columns can often be reused, but might differ slightly
	const serverColumns = clientColumns; // Reusing columns for simplicity
	const serverActions = userActions; // Reusing actions
</script>

<svelte:head>
	<title>Advanced Table Demo</title>
</svelte:head>

<div class="container mx-auto space-y-12 p-4 md:p-8">
	<h1 class="mb-6 text-3xl font-bold">Advanced Svelte 5 Table Demo</h1>

	<!-- ========================== -->
	<!-- Client-Side Processing Demo -->
	<!-- ========================== -->
	<section>
		<h2 class="mb-4 border-b pb-2 text-2xl font-semibold">Client-Side Data Demo</h2>
		<p class="mb-4 text-sm opacity-80">
			This table handles all sorting, filtering, and pagination directly in the browser using the
			provided `data` prop.
		</p>
		<AdvancedTable
			data={sampleClientData}
			columns={clientColumns}
			rowKey="id"
			actions={userActions}
			allowSelection={true}
			pagination={true}
			defaultPageSize={5}
			tableClass="table-sm table-zebra w-full"
			tableId="client-table"
		>
			<!-- Example: Custom Empty State Snippet -->
			{#snippet emptyState()}
				<tr class="text-center">
					<td colspan={clientColumns.length + 2} class="p-10">
						<p class="text-warning text-lg font-semibold">⚠️ Whoops! No matching users found.</p>
						<p class="text-sm opacity-70">Try adjusting your search or filters.</p>
					</td>
				</tr>
			{/snippet}

			<!-- Example: Custom Bulk Actions Snippet -->
			{#snippet bulkActionsRenderer(params)}
				<!-- params = { selectedItems: UserData[] } -->
				<div class="flex items-center gap-4">
					<span class="text-sm font-medium">{params.selectedItems.length} selected</span>
					<button
						class="btn btn-xs btn-outline btn-error"
						onclick={() => handleClientBulkDelete(params.selectedItems)}
					>
						Delete Selected (Client)
					</button>
					<button
						class="btn btn-xs btn-outline btn-info"
						onclick={() => console.log('Bulk Action:', params.selectedItems)}
					>
						Log Selected
					</button>
				</div>
			{/snippet}
		</AdvancedTable>
	</section>

	<!-- ========================== -->
	<!-- Server-Side Processing Demo -->
	<!-- ========================== -->
	<section>
		<h2 class="mb-4 border-b pb-2 text-2xl font-semibold">Server-Side Data Demo (Mocked)</h2>
		<p class="mb-4 text-sm opacity-80">
			This table uses the `fetchData` prop to simulate server interactions for sorting, filtering,
			and pagination. Check the console for fetch parameters. Try searching for "error" to simulate
			a fetch failure.
		</p>
		<AdvancedTable
			fetchData={mockFetchData}
			columns={serverColumns}
			rowKey="id"
			actions={serverActions}
			allowSelection={true}
			pagination={true}
			defaultPageSize={10}
			tableClass="table-md table-zebra w-full table-pin-rows"
			tableId="server-table"
		>
			<!-- You can also provide snippets for server-side table instances -->
			{#snippet loadingState()}
				<tr>
					<td colspan={serverColumns.length + 2} class="p-6 text-center">
						<div class="flex flex-col items-center gap-2">
							<span class="loading loading-dots loading-lg text-primary"></span>
							<span>Contacting Server...</span>
						</div>
					</td>
				</tr>
			{/snippet}
		</AdvancedTable>
	</section>
</div>
