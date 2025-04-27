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
		// visibleColumns?: Set<string | number | symbol>; // Prop for column visibility (Phase 7+)
	}

	const {
		rowData,
		columns,
		// rowIndex, // Included but maybe not directly used in render yet
		rowKey,
		actions = [],
		isSelected = false,
		showSelection = false
		// expanded = false, // For future use
		// visibleColumns = new Set(columns.map(c => c.key)), // For future use
	}: Props = $props();

	const dispatch = createEventDispatcher<{ toggleSelection: void }>();

	function handleSelectionChange() {
		dispatch('toggleSelection');
	}

	// Phase 7 preparation: Filter columns based on visibility state if passed down
	// For now, just use all columns that aren't explicitly hidden
	// const finalColumns = $derived(columns.filter(c => !c.hidden && visibleColumns.has(c.key)));
	// Simplified for now until Phase 7 column visibility UI is done:
	const displayColumns = columns.filter((c) => !c.hidden);

	const rowId = $derived(rowData[rowKey] ?? `row-${Math.random()}`); // Fallback ID if key is missing
</script>

<tr class:active={isSelected} class="hover">
	{#if showSelection}
		<!-- Selection Checkbox Cell (Phase 5) -->
		<td class="sticky left-0 z-10 w-1">
			<!-- Needs sticky background handling - DaisyUI themes might handle this or require override -->
			<label class="flex h-full items-center justify-center">
				<input
					type="checkbox"
					class="checkbox checkbox-sm"
					checked={isSelected}
					onchange={handleSelectionChange}
					aria-label={`Select row ${rowId}`}
				/>
			</label>
		</td>
	{/if}

	{#each displayColumns as column (column.key)}
		<!-- Pass rowData, column definition, and computed cell value -->
		<TableCell cellValue={rowData[column.key]} {rowData} {column} />
	{/each}

	{#if actions.length > 0}
		<!-- Actions Cell (Phase 5) -->
		<td class="sticky right-0">
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
	/* Ensure sticky cells have appropriate background, especially when row is active/hovered */
	/* DaisyUI's 'active' class on TR might need help styling sticky TD backgrounds */
	/* The 'group' utility might be needed on TR if not already applied by DaisyUI */
	tr.active td.sticky {
		/* Use DaisyUI color variables for consistency */
		background-color: hsl(var(--a) / var(--tw-bg-opacity, 1));
		/* DaisyUI v4+ approach might differ slightly, test themes */
		/* Using group-[.active] in the class attribute is likely better */
	}
	tr.hover td.sticky {
		background-color: hsl(var(--b2, var(--b1)) / var(--tw-bg-opacity, 1));
		/* Ensure hover background applies to sticky cells */
	}
	/* Base sticky cell styling - may need adjustment based on theme */
	td.sticky {
		background-color: hsl(var(--b1) / 0.95); /* Default background with slight transparency */
	}
</style>
