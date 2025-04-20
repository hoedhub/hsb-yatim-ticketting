<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores'; // Import page store for active link styling

	let { children } = $props();

	// Helper function to check if a link is active
	function isActive(path: string): boolean {
		return $page.url.pathname === path;
	}
</script>

<div class="flex min-h-screen">
	<!-- Sidebar -->
	<aside class="bg-base-200 flex w-64 flex-col space-y-2 p-4">
		<h2 class="mb-4 text-xl font-bold">Menu</h2>
		<ul class="menu bg-base-100 rounded-box w-full">
			<li>
				<a href="/" class={isActive('/') ? 'active' : ''}> Home </a>
			</li>
			<li>
				<a href="/customers" class={isActive('/customers') ? 'active' : ''}> Pelanggan </a>
			</li>
			<li>
				<a href="/institutions" class={isActive('/institutions') ? 'active' : ''}> Institusi </a>
			</li>
			<li>
				<a href="/orders" class={isActive('/orders') ? 'active' : ''}> Pesanan </a>
			</li>
			<li>
				<a href="/settings" class={isActive('/settings') ? 'active' : ''}> Pengaturan </a>
			</li>
		</ul>
	</aside>

	<!-- Main Content Area -->
	<main class="flex-1 p-4">
		{@render children()}
	</main>
</div>
