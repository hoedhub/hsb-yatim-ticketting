<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores'; // Import page store for active link styling
	import { browser } from '$app/environment'; // Import BROWSER for $effect safety if needed
	import ToastContainer from '$lib/components/toast/ToastContainer.svelte';

	let { children } = $props();

	// Helper function to check if a link is active
	function isActive(path: string): boolean {
		// $page might not be ready immediately on server, check existence
		return $page?.url.pathname === path;
	}

	// State for sidebar visibility on small screens
	// Changed: Use $state for reactive variable
	let isSidebarOpen = $state(false);

	// Function to toggle sidebar visibility
	function toggleSidebar() {
		isSidebarOpen = !isSidebarOpen;
	}

	// Close sidebar on navigation (optional but good UX)
	// Svelte 5 automatically tracks dependencies inside the effect
	$effect(() => {
		// Ensure this runs only in the browser where navigation happens
		// and page store is fully initialized.
		if (browser && $page.url.pathname) {
			// Reading $page.url.pathname makes it a dependency
			isSidebarOpen = false;
		}
	});
</script>

<div class="flex min-h-screen flex-col md:flex-row">
	<!-- Header for small screens -->
	<header class="bg-base-300 sticky top-0 flex items-center justify-between p-4 md:hidden">
		<!-- Changed: Use onclick event attribute -->
		<button class="btn btn-square btn-ghost" onclick={toggleSidebar}>
			<!-- Hamburger icon -->
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				class="inline-block h-6 w-6 stroke-current"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 6h16M4 12h16M4 18h16"
				></path>
			</svg>
		</button>
		<h1 class="text-xl font-bold">App Title</h1>
		<!-- Add a title -->
		<div></div>
		<!-- Placeholder for potential right-aligned items -->
	</header>

	<!-- Backdrop for small screens -->
	{#if isSidebarOpen}
		<button
			type="button"
			class="fixed inset-0 z-40 cursor-default bg-black/50 md:hidden"
			onclick={toggleSidebar}
			aria-label="Close sidebar"
		></button>
	{/if}

	<aside
		class="bg-base-200 fixed inset-y-0 left-0 z-50 w-64 transform flex-col space-y-2 p-4 transition-transform duration-300 ease-in-out md:relative md:flex md:translate-x-0 {isSidebarOpen
			? ''
			: 'translate-x-[-100%]'}"
	>
		<div class="flex items-center justify-between">
			<h2 class="mb-4 text-xl font-bold">Menu</h2>
			<!-- Close button for small screens -->
			<button class="btn btn-square btn-ghost md:hidden" onclick={toggleSidebar}>
				<!-- Close icon (X) -->
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="h-6 w-6"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>
		<ul class="menu bg-base-100 rounded-box w-full">
			<li>
				<a href="/" class:active={isActive('/')}> Home </a>
			</li>
			<li>
				<a href="/customers" class:active={isActive('/customers')}> Pelanggan </a>
			</li>
			<li>
				<a href="/institutions" class:active={isActive('/institutions')}> Institusi </a>
			</li>
			<li>
				<a href="/orders" class:active={isActive('/orders')}> Pesanan </a>
			</li>
			<li>
				<a href="/settings" class:active={isActive('/settings')}> Pengaturan </a>
			</li>
		</ul>
	</aside>

	<!-- Main Content Area -->
	<!-- Note: Adjusted margin logic slightly for md screens -->
	<main class="flex-1 p-4">
		{@render children()}
	</main>
</div>

<ToastContainer position="top-right" />
