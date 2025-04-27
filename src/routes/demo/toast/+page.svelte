<script lang="ts">
	// Adjust the import path if necessary
	import { toast } from '$lib/components/toast/toast.service.svelte';

	function showSuccess() {
		toast.success('Profile updated successfully!');
	}

	function showInfo() {
		toast.info('Remember to save your changes.', { duration: 7000 });
	}

	function showWarning() {
		toast.warning('Session expiring soon.', { title: 'Session Timeout' });
	}

	function showError() {
		toast.error('Connection failed. Please try again.', {
			// Example: Override default persistence for error
			persistent: false,
			duration: 10000
		});
	}

	let loadingToastId: string | number | null = null;

	async function simulateLoading() {
		// Clear any previous loading ID just in case
		if (loadingToastId !== null) {
			toast.dismiss(loadingToastId);
		}

		loadingToastId = toast.loading('Processing your request...');
		console.log('Loading toast ID:', loadingToastId);

		// Simulate async operation
		await new Promise((resolve) => setTimeout(resolve, 3000));

		// Check if the specific loading toast we created still exists
		// (It might have been dismissed manually or by other logic)
		if (loadingToastId !== null && toast.list.some((t) => t.id === loadingToastId)) {
			console.log('Updating toast ID:', loadingToastId);
			toast.update(loadingToastId, {
				type: 'success',
				content: 'Request processed successfully!',
				persistent: false, // Allow auto-dismissal now
				duration: 4000
			});
			// Important: Clear the ID after successful update/completion
			loadingToastId = null;
		} else {
			console.log('Loading toast was dismissed before update could occur.');
			// Ensure ID is cleared if the toast was dismissed externally
			loadingToastId = null;
		}
	}

	function showWithActions() {
		const toastId = toast.add({
			type: 'info',
			title: 'Update Available',
			content: 'A new version is ready to be installed.',
			persistent: true, // Keep open until user interacts
			actions: [
				{
					label: 'Install Now',
					onClick: () => {
						console.log('Install action clicked! Toast ID:', toastId);
						// Example: maybe start install and dismiss manually
						// installUpdate();
						// toast.dismiss(toastId);
					},
					// dismissOnClick: false, // Keep toast open after clicking (default is true)
					class: 'btn-primary btn-xs' // Custom DaisyUI/Tailwind classes
				},
				{
					label: 'Later',
					onClick: () => console.log('Later clicked!'),
					dismissOnClick: true, // Explicitly dismiss on click (this is the default)
					class: 'btn-ghost btn-xs'
				}
			]
		});
	}

	// Optional: Add a button to test manual dismissal of the loading toast
	function dismissLoadingToast() {
		if (loadingToastId !== null) {
			console.log('Manually dismissing toast ID:', loadingToastId);
			toast.dismiss(loadingToastId);
			loadingToastId = null; // Clear the tracked ID
		} else {
			console.log('No active loading toast ID to dismiss.');
		}
	}
</script>

<div class="container mx-auto p-4">
	<h1 class="mb-4 text-2xl font-bold">Toast Component Demo</h1>
	<p class="mb-4">
		Ensure the <code class="bg-base-300 rounded px-1">&lt;ToastContainer /&gt;</code> component is
		included in your main layout file (e.g.
		<code class="bg-base-300 rounded px-1">src/routes/+layout.svelte</code>).
	</p>
	<div class="flex flex-wrap gap-2">
		<!-- Use Svelte 5 onclick syntax -->
		<button class="btn btn-success" onclick={showSuccess}>Show Success</button>
		<button class="btn btn-info" onclick={showInfo}>Show Info</button>
		<button class="btn btn-warning" onclick={showWarning}>Show Warning</button>
		<button class="btn btn-error" onclick={showError}>Show Error</button>
		<button class="btn" onclick={simulateLoading}>Show Loading & Update</button>
		<button class="btn" onclick={showWithActions}>Show With Actions</button>
		{#if loadingToastId !== null}
			<button class="btn btn-outline btn-sm" onclick={dismissLoadingToast}
				>Dismiss Loading Toast</button
			>
		{/if}
	</div>

	<div class="bg-base-200 mt-8 rounded-lg p-4">
		<h2 class="mb-2 text-lg font-semibold">Notes:</h2>
		<ul class="list-inside list-disc text-sm">
			<li>Check the browser console for messages from action button clicks.</li>
			<li>
				The 'Error' toast is set to dismiss after 10s in this demo (overriding its default
				persistence).
			</li>
			<li>The 'Loading' toast is updated to 'Success' after 3 seconds.</li>
			<li>
				The 'With Actions' toast is persistent until an action dismisses it or it's closed manually.
			</li>
		</ul>
	</div>
</div>
