<script lang="ts">
	import AdvancedTable from '$lib/components/Table/AdvancedTable.svelte';
	import type {
		ColumnDefinition,
		ActionDefinition,
		FetchParams,
		FetchResult,
		TableRowData
	} from '$lib/components/Table/types';
	import { getProperty } from '$lib/components/Table/utils';
	import type { UserData } from '$lib/components/Table/Demo/demoData';
	import {
		sampleClientData,
		clientColumns,
		userActions
	} from '$lib/components/Table/Demo/demoData';

	// Client-side bulk delete handler
	const handleClientBulkDelete = (items: UserData[]) => {
		if (confirm(`Are you sure you want to delete ${items.length} users?`)) {
			console.log(
				'Deleting users:',
				items.map((item) => item.id)
			);
		}
	};

	// --- Product type definition
	type Product = {
		id: number;
		title: string;
		description: string;
		price: number;
		discountPercentage: number;
		rating: number;
		stock: number;
		brand: string;
		category: string;
		thumbnail: string;
	};

	// Server data (initial load)
	// export let data: { products: Product[]; total: number; page: number; limit: number; search: string };
	// Define the async fetchData function for products
	const fetchProducts = async (params: FetchParams<Product>): Promise<FetchResult<Product>> => {
		const { page, pageSize, sortKey, sortDirection, filters } = params;
		const skip = (page - 1) * pageSize;
		const search = filters.global || ''; // Assuming global filter is used for search

		const apiUrl = new URL('https://dummyjson.com/products/search');
		apiUrl.searchParams.set('limit', String(pageSize));
		apiUrl.searchParams.set('skip', String(skip));
		if (search) {
			apiUrl.searchParams.set('q', search);
		}

		// Note: DummyJSON search doesn't support sorting or column filters directly in the API.
		// For a real backend, you would add sortKey, sortDirection, and other filters to the API call.
		// For this demo, sorting and column filters will still happen client-side on the fetched page.
		// A more robust server-side implementation would require a backend that supports these parameters.

		try {
			const res = await fetch(apiUrl.toString());
			if (!res.ok) {
				throw new Error('Failed to fetch products from DummyJSON');
			}
			const data = await res.json();

			// DummyJSON returns total items matching the search, which is correct for server-side pagination
			return {
				data: data.products,
				totalItems: data.total
			};
		} catch (error) {
			console.error('Error fetching products:', error);
			// Return empty data and 0 total on error
			return {
				data: [],
				totalItems: 0
			};
		}
	};
	// Column definitions for products
	const productColumns: ColumnDefinition<Product>[] = [
		{ key: 'id', label: 'ID', sortable: true, cellClass: 'text-center' },
		{
			key: 'thumbnail',
			label: 'Image',
			formatter: (value) => `<img src="${value}" alt="" class="w-12 h-12 object-cover rounded" />`,
			sortable: false,
			cellClass: 'w-16'
		},
		{ key: 'title', label: 'Product', sortable: true },
		{ key: 'brand', label: 'Brand', sortable: true },
		{ key: 'category', label: 'Category', sortable: true },
		{
			key: 'price',
			label: 'Price',
			sortable: true,
			formatter: (value) => `$${value.toFixed(2)}`,
			cellClass: 'text-right font-mono'
		},
		{
			key: 'rating',
			label: 'Rating',
			sortable: true,
			formatter: (value) => {
				const stars = '★'.repeat(Math.floor(value)) + '☆'.repeat(5 - Math.floor(value));
				return `<span class="text-warning">${stars}</span> ${value.toFixed(1)}`;
			},
			cellClass: 'text-center'
		},
		{
			key: 'stock',
			label: 'Stock',
			sortable: true,
			formatter: (value) => {
				const color = value < 10 ? 'badge-error' : value < 50 ? 'badge-warning' : 'badge-success';
				return `<span class="badge ${color} badge-sm">${value}</span>`;
			},
			cellClass: 'text-center'
		}
	];

	// Product actions
	const productActions: ActionDefinition<Product>[] = [
		{
			label: 'View Details',
			handler: (product) => alert(`View details for ${product.title}`)
		},
		{
			label: 'Edit Product',
			handler: (product) => alert(`Edit ${product.title}`)
		},
		{
			label: 'Delete Product',
			class: 'text-error',
			handler: (product) => {
				if (confirm(`Delete ${product.title}?`)) {
					console.log('Deleting product:', product.id);
				}
			},
			hidden: (product) => product.stock > 0 // Can't delete products in stock
		}
	];
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
	<!-- DummyJSON Products Demo -->
	<!-- ========================== -->
	<section>
		<h2 class="mb-4 border-b pb-2 text-2xl font-semibold">
			Server-Side Data Demo (DummyJSON Products)
		</h2>
		<p class="mb-4 text-sm opacity-80">
			This table fetches real product data from <a href="https://dummyjson.com" class="link"
				>DummyJSON</a
			>'s API server-side. Features pagination, sorting, search, and dynamic formatting.
		</p>

		<AdvancedTable
			columns={productColumns}
			rowKey="id"
			actions={productActions}
			allowSelection={true}
			pagination={true}
			defaultPageSize={10}
			tableClass="table-sm table-zebra w-full"
			tableId="products-table"
			fetchData={fetchProducts}
		>
			<!-- Loading State -->
			{#snippet loadingState()}
				<tr>
					<td colspan={productColumns.length + 2} class="p-8 text-center">
						<div class="flex flex-col items-center gap-4">
							<span class="loading loading-spinner loading-lg text-primary"></span>
							<span>Loading products...</span>
						</div>
					</td>
				</tr>
			{/snippet}

			<!-- Empty State -->
			{#snippet emptyState()}
				<tr>
					<td colspan={productColumns.length + 2} class="p-10 text-center">
						<div class="flex flex-col items-center gap-4">
							<span class="text-4xl">🛍️</span>
							<p class="text-lg font-semibold">No products found</p>
							<p class="text-sm opacity-70">Try adjusting your search filters</p>
						</div>
					</td>
				</tr>
			{/snippet}

			<!-- Bulk Actions -->
			{#snippet bulkActionsRenderer(params)}
				<div class="flex items-center gap-4">
					<button
						class="btn btn-sm btn-outline"
						onclick={() => {
							const total = params.selectedItems.reduce((sum, item) => sum + item.price, 0);
							alert(`Total value: $${total.toFixed(2)}`);
						}}
					>
						Calculate Total Value
					</button>
				</div>
			{/snippet}
		</AdvancedTable>
	</section>
</div>
