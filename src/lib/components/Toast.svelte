<script lang="ts">
	import { toastStore, hideToast } from '$lib/stores/toastStore';
	import { quintOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';

	$: visible = $toastStore.visible;
	$: message = $toastStore.message;
	$: type = $toastStore.type;

	let timeoutId: ReturnType<typeof setTimeout>;

	$: if (visible) {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			hideToast();
		}, 3000); // Auto-dismiss after 3 seconds
	}

	function handleClose() {
		clearTimeout(timeoutId);
		hideToast();
	}
</script>

{#if visible}
	<div class="toast toast-end z-50" transition:slide|local={{ duration: 300, easing: quintOut }}>
		<div class="alert {type === 'success' ? 'alert-success' : 'alert-error'}">
			<span>{message}</span>
			<button class="btn btn-sm btn-circle btn-ghost" on:click={handleClose}>✕</button>
		</div>
	</div>
{/if}

<style>
	/* Optional: Add specific styles if needed, though DaisyUI handles most */
</style>
