import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Page from './+page.svelte';
import { toastStore, showToast } from '$lib/stores/toastStore';

// Mock SvelteKit's fetch and form actions
vi.mock('$app/forms', () => ({
    enhance: vi.fn((node, submit) => {
        node.addEventListener('submit', (e) => {
            e.preventDefault();
            submit({
                action: node.action,
                data: new FormData(node),
                form: node,
                controller: new AbortController(),
            });
        });
        return { destroy: vi.fn() };
    }),
}));


// Mock the toast store to spy on showToast
vi.mock('$lib/stores/toastStore', async (importOriginal) => {
    const actual = await importOriginal<typeof import('$lib/stores/toastStore')>();
    return {
        ...actual,
        showToast: vi.fn(),
    };
});

describe('Institutions Page', () => {
    beforeEach(() => {
        // Reset mocks and spy on showToast before each test
        vi.clearAllMocks();
    });

    it('should display a success toast on successful form submission', async () => {
        const { component } = render(Page, { data: { institutions: [] } });

        // Directly call handleFormResponse with a mock success response
        component.handleFormResponse({ success: true, message: 'Operation successful' });

        // Check if showToast was called with the correct parameters
        expect(showToast).toHaveBeenCalledWith('Operation successful', 'success');
    });

    it('should display an error toast on failed form submission', async () => {
        const { component } = render(Page, { data: { institutions: [] } });

        // Directly call handleFormResponse with a mock failure response
        component.handleFormResponse({ success: false, message: 'Operation failed' });

        // Check if showToast was called with the correct parameters
        expect(showToast).toHaveBeenCalledWith('Operation failed', 'error');
    });

    // Add tests for the delete button click opening the modal if needed,
    // but the toast logic is triggered by the form prop update, not the button click itself.
});