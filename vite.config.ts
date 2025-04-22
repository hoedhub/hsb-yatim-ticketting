import tailwindcss from '@tailwindcss/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import { sveltekit } from '@sveltejs/kit/vite';
// Import from 'vitest/config' when including the 'test' property
import { defineConfig } from 'vitest/config';

export default defineConfig({
	// Standard Vite plugins go here
	plugins: [tailwindcss(), sveltekit()],

	// Vitest configuration goes inside the 'test' property
	test: {
		// Global deps configuration (applies if not overridden in workspace)
		deps: {
			optimizer: {
				ssr: {
					// Include packages here that need processing by Vite plugins (like svelte)
					// during testing in the Node environment.
					include: [
						'@testing-library/svelte',
						'svelte'
						// Add any other packages that were previously in deps.inline
						// Note: Using strings here, not regex (though regex might work, strings are safer)
					]
				}
			}
		},

		// Workspace configuration
		workspace: [
			{
				// Client-side tests (JS-DOM environment)
				extends: './vite.config.ts', // Extends the root config (plugins, etc.)
				plugins: [
					// Add svelteTesting plugin ONLY for the client environment
					// It helps Vitest process .svelte files correctly for component testing
					svelteTesting()
				],
				test: {
					name: 'client', // Name for this workspace
					environment: 'jsdom', // Simulate browser environment
					globals: true, // Optional: Use Vitest globals like describe, it, expect
					clearMocks: true,
					// Target only component tests (e.g., *.svelte.test.ts)
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					// Exclude server-specific code if necessary
					exclude: ['src/lib/server/**'],
					setupFiles: ['./vitest-setup-client.ts'] // Client-specific setup (e.g., DOM cleanup)
				}
			},
			{
				// Server-side tests (Node.js environment)
				extends: './vite.config.ts', // Extends the root config (plugins, etc.)
				// Note: sveltekit() plugin from root might be needed if testing +server.ts that imports .svelte
				plugins: [
					// No svelteTesting needed here usually
				],
				test: {
					name: 'server', // Name for this workspace
					environment: 'node', // Use Node.js environment
					globals: true, // Optional: Use Vitest globals
					clearMocks: true,
					setupFiles: ['./vitest-setup-server.ts'], // Server-specific setup (e.g., mocking DB)
					// Target non-component tests (e.g., *.test.ts, but not *.svelte.test.ts)
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}'] // Exclude component tests
				}
			}
		]
	}
});