# TODO: Advanced Svelte 5 + DaisyUI 5 Table Component

This document outlines the development steps for creating a reusable, responsive, and feature-rich table component. We'll start with the core structure and gradually layer in advanced functionality.

**Legend:**
- `[ ]`: Task to be done
- `[x]`: Task completed
- `[-]`: Task skipped/deferred

---

## Phase 1: Foundation & Core Display

**Goal:** Set up the project and display static data in a basic table structure using DaisyUI.

- [ ] **1.1. Project Setup:**
    - [ ] Initialize Svelte 5 project (e.g., using `npm create svelte@latest`).
    - [ ] Install dependencies: `tailwindcss`, `autoprefixer`, `postcss`, `daisyui`.
    - [ ] Configure Tailwind CSS (`tailwind.config.js`) and include DaisyUI plugin.
    - [ ] Configure `postcss.config.js`.
    - [ ] Configure `svelte.config.js` (ensure preprocessor is set up).
    - [ ] Set up base CSS (`app.css` or equivalent) importing Tailwind layers. Ensure DaisyUI themes are available.
- [ ] **1.2. TypeScript Setup (Recommended):**
    - [ ] Ensure project is configured for TypeScript.
    - [ ] Create `src/lib/components/Table/types.ts` (or similar path).
    - [ ] Define core interfaces:
        - `ColumnDefinition<T>`: `{ key: keyof T | string; label: string; sortable?: boolean; filterable?: boolean | FilterType; formatter?: (value: any, row: T) => string | number; component?: SvelteComponent; headerClass?: string; cellClass?: string; hidden?: boolean; ... }` (start simple, add props later).
        - `TableRowData`: Define or use generics for the row data structure (`T`).
- [ ] **1.3. Create Core Component Files:**
    - [ ] `src/lib/components/Table/AdvancedTable.svelte`
    - [ ] `src/lib/components/Table/TableHeaderCell.svelte`
    - [ ] `src/lib/components/Table/TableRow.svelte`
    - [ ] `src/lib/components/Table/TableCell.svelte`
- [ ] **1.4. Implement Basic `AdvancedTable.svelte`:**
    - [ ] Define props using `$props()`:
        - `data: T[] = $bindable([])` (The data array).
        - `columns: ColumnDefinition<T>[] = $bindable([])` (Column configuration).
        - `tableId?: string` (Optional unique ID for accessibility/testing).
    - [ ] Use basic DaisyUI table structure: `<div class="overflow-x-auto"><table class="table">...</table></div>`.
    - [ ] Render `<thead>`: Loop through `columns` prop, render `TableHeaderCell` for each non-hidden column.
    - [ ] Render `<tbody>`: Loop through `data` prop, render `TableRow` for each data item. Pass `rowData` and `columns` down.
- [ ] **1.5. Implement `TableHeaderCell.svelte`:**
    - [ ] Accept `column: ColumnDefinition<T>` as prop.
    - [ ] Render `<th>` with `column.label`.
    - [ ] Apply `column.headerClass` if provided.
- [ ] **1.6. Implement `TableRow.svelte`:**
    - [ ] Accept `rowData: T`, `columns: ColumnDefinition<T>[]`, `rowIndex: number` as props.
    - [ ] Render `<tr>`.
    - [ ] Loop through `columns` prop, render `TableCell` for each non-hidden column. Pass `rowData`, `column`, and the specific `cellValue` down.
    - [ ] Apply basic row styling (e.g., `table-zebra` will be handled by parent `table` class).
- [ ] **1.7. Implement `TableCell.svelte`:**
    - [ ] Accept `cellValue: any`, `rowData: T`, `column: ColumnDefinition<T>` as props.
    - [ ] Render `<td>`.
    - [ ] Display `cellValue` (handle basic access like `rowData[column.key]` - maybe need a helper for nested keys later).
    - [ ] Apply `column.cellClass` if provided.
- [ ] **1.8. Basic Styling & DaisyUI:**
    - [ ] Apply core DaisyUI classes: `table`, `table-zebra` (optional), `table-sm` / `table-md` / `table-lg` (configurable via prop?).
    - [ ] Ensure `overflow-x-auto` wrapper works for horizontal scrolling on smaller viewports.

---

## Phase 2: Essential Interactivity - Pagination

**Goal:** Add client-side pagination controls.

- [ ] **2.1. State Management (`AdvancedTable.svelte`):**
    - [ ] Import `$state` and `$derived` from `svelte/js`.
    - [ ] Add state for pagination: `let currentPage = $state(1);`, `let pageSize = $state(10);`.
    - [ ] Add props for configuring pagination: `pagination?: boolean = true`, `defaultPageSize?: number = 10`. Initialize `pageSize` state from prop.
- [ ] **2.2. Derived Data (`AdvancedTable.svelte`):**
    - [ ] Calculate `totalItems = $derived(data.length);`.
    - [ ] Calculate `totalPages = $derived(Math.ceil(totalItems / pageSize));`.
    - [ ] Calculate `pagedData = $derived(...)`: Slice the `data` array based on `currentPage` and `pageSize`.
    - [ ] Update the `<tbody>` loop to iterate over `pagedData` instead of `data`.
- [ ] **2.3. Create `Pagination.svelte` Component:**
    - [ ] Accept props: `currentPage: number`, `totalPages: number`, `totalItems: number`, `pageSize: number`.
    - [ ] Render pagination controls using DaisyUI `join` and `btn` or the `pagination` component (if v5 has one suitable).
    - [ ] Display "Previous" / "Next" buttons, page numbers.
    - [ ] Display info like "Showing X-Y of Z items".
    - [ ] Emit `pageChange` event with the new page number when a page button is clicked. Use `createEventDispatcher` or bindable props (`$props`).
- [ ] **2.4. Integrate `Pagination.svelte`:**
    - [ ] Render `Pagination` component within `AdvancedTable.svelte` (likely below the `table`).
    - [ ] Pass necessary state (`currentPage`, `totalPages`, etc.) as props.
    - [ ] Handle the `pageChange` event to update the `currentPage` state.
- [ ] **2.5. Add Page Size Selector (Optional):**
    - [ ] Add a DaisyUI `select` component near the pagination controls.
    - [ ] Allow users to choose from predefined page sizes (e.g., 10, 25, 50, 100).
    - [ ] Bind the select's value to the `pageSize` state. Reset `currentPage` to 1 when `pageSize` changes.

---

## Phase 3: Intermediate Interactivity - Sorting

**Goal:** Implement client-side sorting by clicking column headers.

- [ ] **3.1. State Management (`AdvancedTable.svelte`):**
    - [ ] Add state for sorting: `let sortKey = $state<keyof T | string | null>(null);`, `let sortDirection = $state<'asc' | 'desc'>('asc');`.
    - [ ] Add prop `defaultSortKey?`, `defaultSortDirection?` to initialize state.
- [ ] **3.2. Update `ColumnDefinition` Type:**
    - [ ] Ensure `sortable?: boolean` is defined in `types.ts`.
- [ ] **3.3. Enhance `TableHeaderCell.svelte`:**
    - [ ] Accept new props: `isSortable: boolean`, `currentSortKey: string | null`, `currentSortDirection: 'asc' | 'desc'`.
    - [ ] Add click handler to the `<th>` if `isSortable`.
    - [ ] Emit a `sort` event with the `column.key` when clicked.
    - [ ] Display sort icons (e.g., arrows) based on `currentSortKey`, `currentSortDirection`, and this column's key. Use DaisyUI `btn btn-ghost btn-sm` wrapper for better click target and alignment.
- [ ] **3.4. Implement Sorting Logic (`AdvancedTable.svelte`):**
    - [ ] Create a `handleSort(key: keyof T | string)` function.
        - If clicking the current `sortKey`, toggle `sortDirection`.
        - If clicking a new key, set `sortKey` to the new key and `sortDirection` to 'asc'.
        - Reset `currentPage` to 1 after sorting.
    - [ ] Pass `sortKey`, `sortDirection`, and `handleSort` down to `TableHeaderCell` (or use context/events).
    - [ ] Update `$derived` calculation: Create `sortedData = $derived(...)` which sorts the (potentially later filtered) data based on `sortKey` and `sortDirection`. Use a stable sort algorithm if possible.
    - [ ] Update `pagedData` to be derived from `sortedData`.
- [ ] **3.5. Utility Function (Optional):**
    - [ ] Consider creating a `sortBy` utility function in `utils.ts` to handle different data types and sort directions cleanly.

---

## Phase 4: Intermediate Interactivity - Filtering

**Goal:** Add client-side filtering capabilities (start with global search).

- [ ] **4.1. State Management (`AdvancedTable.svelte`):**
    - [ ] Add state for global filter: `let globalFilter = $state('');`.
    - [ ] Add state for column filters (prepare for later): `let columnFilters = $state<{ [key: string]: string }>({});`.
- [ ] **4.2. Create `FilterBar.svelte` (Optional Component):**
    - [ ] Create a component to hold filter controls.
    - [ ] Add a global search input (`input input-bordered input-sm`).
    - [ ] Bind the input's value to a local state.
    - [ ] Implement debouncing for the input using `$effect` or a utility function.
    - [ ] Emit a `filterChange` event with the debounced filter value `{ global: value }`.
- [ ] **4.3. Integrate Filtering UI (`AdvancedTable.svelte`):**
    - [ ] Render the global search input (either directly or via `FilterBar.svelte`) above the table.
    - [ ] Handle the `filterChange` event to update the `globalFilter` state. Reset `currentPage` to 1 on filter change.
- [ ] **4.4. Update Derived Data (`AdvancedTable.svelte`):**
    - [ ] Create `filteredData = $derived(...)`: Filter the raw `data` based on `globalFilter` (and later `columnFilters`). Search across all searchable columns (or define which ones). Case-insensitive search.
    - [ ] Update `sortedData` to be derived from `filteredData`.
    - [ ] Update `pagedData` to be derived from `sortedData`.
- [ ] **4.5. Update `ColumnDefinition` Type:**
    - [ ] Add `filterable?: boolean` or more specific type if needed.

---

## Phase 5: Row Interactions - Selection & Actions

**Goal:** Allow users to select rows and perform actions on them.

- [ ] **5.1. State Management (`AdvancedTable.svelte`):**
    - [ ] Add state for selected rows: `let selectedRows = $state<Set<string | number>>(new Set());` (assuming rows have a unique `id` property).
    - [ ] Add prop `rowKey: keyof T` to specify the unique identifier field in the data. Ensure data has unique keys.
- [ ] **5.2. Add Checkbox Column:**
    - [ ] Define a special `ColumnDefinition` for the checkbox column (e.g., `{ key: '__select__', label: '', ... }`).
    - [ ] `TableHeaderCell` (for checkbox column): Render a "Select All" checkbox.
        - Checked state: `$derived(selectedRows.size === pagedData.length && pagedData.length > 0)`.
        - Indeterminate state: `$derived(selectedRows.size > 0 && selectedRows.size < pagedData.length)`.
        - Handle change event to select/deselect all *visible* rows (`pagedData`).
    - [ ] `TableCell` (for checkbox column): Render a row checkbox.
        - Checked state: `$derived(selectedRows.has(rowData[rowKey]))`.
        - Handle change event to add/remove the `rowData[rowKey]` from the `selectedRows` set.
- [ ] **5.3. Visual Selection Highlight (`TableRow.svelte`):**
    - [ ] Accept `isSelected: boolean` prop.
    - [ ] Apply a DaisyUI class (e.g., `active`) or custom class to the `<tr>` when `isSelected` is true.
- [ ] **5.4. Row Actions Column:**
    - [ ] Define an "Actions" column in `columns` prop.
    - [ ] Create `ActionMenu.svelte` component (optional but recommended).
        - Use DaisyUI `dropdown dropdown-end` (or left).
        - Trigger with an icon button (ellipsis, kebab).
        - Accept `rowData: T` and `actions: ActionDefinition[]` props (`ActionDefinition`: `{ label: string; handler: (row: T) => void; icon?: string; class?: string }`).
        - Render buttons inside the dropdown, calling `handler(rowData)` on click.
    - [ ] `TableCell` (for actions column): Render the `ActionMenu` component, passing `rowData` and the defined actions (passed down from `AdvancedTable`).
- [ ] **5.5. Bulk Actions UI (`AdvancedTable.svelte`):**
    - [ ] Add a section above the table (perhaps near filters).
    - [ ] Show bulk action buttons/dropdown only when `selectedRows.size > 0` (`$derived` check).
    - [ ] Define bulk actions (e.g., "Delete Selected"). Handlers will need access to `selectedRows` state and potentially the full `data` array.

---

## Phase 6: UI/UX Polish & States

**Goal:** Improve visual appeal, responsiveness, and handle loading/empty/error states.

- [ ] **6.1. Loading State:**
    - [ ] Add `isLoading = $state(false)` to `AdvancedTable.svelte`.
    - [ ] Add prop `loading?: boolean` to allow external control.
    - [ ] Show loading indicator (DaisyUI `loading` spinner or `skeleton` components) when `isLoading` is true. Overlay on table body or replace it.
- [ ] **6.2. Empty State:**
    - [ ] Check if `pagedData.length === 0` *after* filtering.
    - [ ] Display a clear message (e.g., "No data available", "No results match your filters") within the table body area or as a separate element. Use DaisyUI `alert` or just styled text.
    - [ ] Allow customization via slot/prop.
- [ ] **6.3. Error State:**
    - [ ] Add `error = $state<string | null>(null)` to `AdvancedTable.svelte`.
    - [ ] Add prop `error?: string | null`.
    - [ ] Display an error message (e.g., DaisyUI `alert alert-error`) when `error` is set.
- [ ] **6.4. Responsiveness:**
    - [ ] **Strategy 1 (Horizontal Scroll - Simple):** Ensure `overflow-x-auto` is working effectively.
    - [ ] **Strategy 2 (Column Stacking - Advanced):**
        - Use Tailwind responsive classes (`md:table-cell`, `block`, etc.) to change layout on smaller screens.
        - Hide `<thead>` (`md:table-header-group`).
        - Use CSS `::before` pseudo-elements on `td` to display column labels (`content: attr(data-label);`). Requires passing label via data attribute in `TableCell`. This needs careful CSS.
    - [ ] **Strategy 3 (Priority Columns):**
        - Use Tailwind responsive display utilities (`hidden lg:table-cell`, etc.) on `<th>` and `<td>` based on `column.hidden` or priority flags.
- [ ] **6.5. Styling Refinements:**
    - [ ] Review padding, margins, button sizes (`btn-sm`).
    - [ ] Use DaisyUI `badge` component for status indicators within cells (via `formatter` or `component`).
    - [ ] Implement subtle row hover effects (DaisyUI `hover` on `<tr>`).
    - [ ] Consider `table-pin-rows` / `table-pin-cols` for sticky header/columns if needed (may have limitations).

---

## Phase 7: Advanced Features & Customization

**Goal:** Add more complex features like column filtering, visibility toggle, and extensibility.

- [ ] **7.1. Per-Column Filtering:**
    - [ ] Add filter UI elements (input, select) potentially within or below `TableHeaderCell`.
    - [ ] Update `columnFilters` state object in `AdvancedTable.svelte`.
    - [ ] Update `filteredData` derivation logic to handle individual column filters in addition to global filter.
    - [ ] Debounce column filter inputs.
- [ ] **7.2. Column Visibility Toggle:**
    - [ ] Add state `visibleColumns = $state<Set<string>>(...)` initialized from `columns` prop (excluding initially hidden).
    - [ ] Add UI (e.g., DaisyUI `dropdown` with `checkbox` items) triggered by a "Columns" button.
    - [ ] Update the state when checkboxes change.
    - [ ] Update loops in `<thead>` and `TableRow` to only render columns present in `visibleColumns`.
    - [ ] Consider persisting visibility choice to localStorage (`$effect`).
- [ ] **7.3. Cell Formatting & Custom Components:**
    - [ ] Implement `formatter` function support in `TableCell`.
    - [ ] Implement custom Svelte component rendering in `TableCell` based on `column.component` prop. Pass `value`, `rowData` as props.
- [ ] **7.4. Row Expansion:**
    - [ ] Add state `expandedRows = $state<Set<string | number>>(new Set())`.
    - [ ] Add expand/collapse button (e.g., chevron icon) to `TableRow` or a dedicated cell.
    - [ ] Toggle row key in `expandedRows` set on click.
    - [ ] Conditionally render an additional `<tr>` with `colspan` below the main row in `TableRow` if the row is expanded. Use a slot/snippet for the expanded content.
- [ ] **7.5. Server-Side Data Handling:**
    - [ ] Modify `AdvancedTable` to accept an async function prop `fetchData: (params: FetchParams) => Promise<{ data: T[], totalItems: number }>`.
    - [ ] `FetchParams`: `{ page: number; pageSize: number; sortKey: string | null; sortDirection: 'asc' | 'desc'; filters: Record<string, any> }`.
    - [ ] Use `$effect` to call `fetchData` when pagination, sort, or filter state changes. Update `data`, `totalItems`, `isLoading`, `error` state based on the promise result.
    - [ ] Disable client-side sorting/filtering/pagination logic when server-side is active.
- [ ] **7.6. Slots & Snippets (Svelte 5):**
    - [ ] Define snippets or slots for customization:
        - `header`: Area above table.
        - `footer`: Area below table/pagination.
        - `emptyState`: Custom empty state display.
        - `loadingState`: Custom loading display.
        - `cell-[key]`: Snippet/slot for rendering specific column cells (more flexible than `column.component`).
        - `rowExpansion`: Snippet/slot for content in expanded rows.

---

## Phase 8: Refinement & Documentation

**Goal:** Clean up code, improve developer experience, add tests, and document the component.

- [ ] **8.1. Code Refactoring:**
    - [ ] Extract complex logic into utility functions (`src/lib/components/Table/utils.ts`).
    - [ ] Review component structure and props for clarity and consistency.
    - [ ] Ensure Svelte 5 runes (`$state`, `$derived`, `$effect`) are used effectively.
- [ ] **8.2. Accessibility (a11y):**
    - [ ] Add ARIA attributes (`aria-sort`, `aria-checked`, etc.) where appropriate.
    - [ ] Ensure keyboard navigation works for interactive elements (pagination, sorting headers, checkboxes, actions).
    - [ ] Ensure sufficient color contrast (DaisyUI themes help here).
- [ ] **8.3. Testing:**
    - [ ] Write unit tests for utility functions.
    - [ ] Write component tests (e.g., using Vitest + Testing Library) to verify rendering and interactions (sorting, filtering, pagination, selection).
- [ ] **8.4. Documentation (`README.md` or Storybook/Docs site):**
    - [ ] Document all available props (`data`, `columns`, configuration options).
    - [ ] Document required data structure (e.g., need for unique `rowKey`).
    - [ ] Document events emitted (`pageChange`, `sortChange`, `filterChange`, `selectionChange`).
    - [ ] Document available slots/snippets for customization.
    - [ ] Provide usage examples.
- [ ] **8.5. Final Review & Performance Check:**
    - [ ] Test with large datasets (virtual scrolling might be needed for extreme cases, but is out of scope for this initial plan).
    - [ ] Profile if any interactions feel slow.

---