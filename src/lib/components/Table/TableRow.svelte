<script lang="ts" generics="T extends Record<string, any>">
	import { createEventDispatcher } from 'svelte';
	import type { ColumnDefinition, ActionDefinition } from './types';
	import TableCell from './TableCell.svelte';
	// Import ActionMenu if it's created as a separate component
	import ActionMenu from './ActionMenu.svelte'; // Assuming ActionMenu handles the dropdown

	interface Props {
		rowData: T;
		columns: ColumnDefinition<T>[];
		rowIndex: number;
		rowKey: keyof T; // Key field for unique identification
		actions?: ActionDefinition<T>[];
		isSelected: boolean;
		showSelection: boolean; // Controls if the selection checkbox cell is rendered
		// expanded?: boolean; // Prop for future expansion state (Phase 7+)
		visibleColumnKeys: Set<string | number | symbol>; // Prop for column visibility
	}

	const {
		rowData,
		columns,
		// rowIndex, // Included but maybe not directly used in render yet
		rowKey,
		actions = [],
		isSelected = false,
		showSelection = false,
		// expanded = false, // For future use
		visibleColumnKeys // Use the new prop
	}: Props = $props();

	const dispatch = createEventDispatcher<{ toggleSelection: void }>();

	function handleSelectionChange() {
		dispatch('toggleSelection');
	}

	// Filter columns based on the passed visibleColumnKeys set
	const displayColumns = $derived(columns.filter((c) => visibleColumnKeys.has(c.key)));

	const rowId = $derived(rowData[rowKey] ?? `row-${Math.random()}`); // Fallback ID if key is missing
</script>

<tr
	class:active={isSelected}
	class="group hover border-base-300 mb-4 block rounded-lg border p-4 shadow-md md:mb-0 md:table-row md:rounded-none md:border-0 md:p-0"
>
	{#if showSelection}
		<!-- Selection Checkbox Cell (Phase 5) -->
		<td class="flex w-full justify-center py-2 md:sticky md:z-10">
			<!-- Needs sticky background handling - DaisyUI themes might handle this or require override -->
			<label class="flex h-full w-full items-center justify-center">
				<input
					type="checkbox"
					class="checkbox checkbox-sm transition-opacity group-hover:opacity-100"
					class:opacity-0={!isSelected}
					checked={isSelected}
					onchange={handleSelectionChange}
					aria-label={`Select row ${rowId}`}
				/>
			</label>
		</td>
	{/if}

	{#each displayColumns as column (column.key)}
		<!-- Pass rowData, column definition, and computed cell value -->
		<td class="mb-2 block p-3 md:mb-0 md:table-cell md:p-0">
			<div class="mb-1 block text-sm font-bold md:hidden">
				{column.label}
			</div>
			<TableCell cellValue={rowData[column.key]} {rowData} {column} />
		</td>
	{/each}

	{#if actions.length > 0}
		<!-- Actions Cell (Phase 5) -->
		<td class="flex w-full justify-end py-2 md:sticky md:right-0">
			<!-- Needs sticky background handling -->
			<div class="flex h-full items-center justify-end pr-2">
				<ActionMenu {rowData} {actions} />
			</div>
		</td>
	{/if}
</tr>

<!-- Placeholder for Row Expansion Content (Phase 7) -->
{#if false}
	<!-- {#if expanded} -->
	<tr class="row-expansion">
		<td colspan={displayColumns.length + (showSelection ? 1 : 0) + (actions.length > 0 ? 1 : 0)}>
			<!-- {@render expansionSnippet({rowData})} -->
			<div>Expanded Content for row {rowId}</div>
		</td>
	</tr>
	<!-- {/if} -->
{/if}

<style>
	/* No custom CSS needed for mobile card view with Tailwind/DaisyUI */
</style>
