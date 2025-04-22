// src/routes/institutions/[id]/edit/+page.test.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import '@testing-library/jest-dom/vitest';

// Import the Svelte component we're testing
import Page from './+page.svelte';

// --- Mock Data Setup ---
// Create mock data that matches the structure returned by your `load` function,
// aligning with the Drizzle schema for the `institutions` table.

// Define the type for a single institution based on your schema
// (Manually or ideally infer/import from Drizzle types if setup)
type MockInstitution = {
    id: number;
    name: string; // .notNull() in schema
    picName: string | null; // nullable in schema
    contact: string | null; // nullable in schema
    address: string | null; // nullable in schema
    createdAt: Date | null; // timestamp_ms maps to Date, defaultFn makes it non-null on insert, but select could potentially get null? Sticking to Date based on common usage and error. Let's use Date for the mock instance.
};

// Create a specific instance of mock data for the test
const mockInstitutionData: MockInstitution = {
    id: 123,
    name: 'Test University',
    picName: 'John Doe', // Can be string or null, using string for this test case
    contact: '081234567890', // Can be string or null, using string for this test case
    address: '123 University Lane, Test City', // Can be string or null, using string for this test case
    createdAt: new Date(), // Use a Date object directly, not a string
    // No updatedAt field as it's not in the schema
};

// Structure the mock data exactly as the `load` function returns it
// You can add the PageData type assertion for extra safety if $types are generated
// import type { PageData } from './$types';
const mockPageData /*: PageData */ = {
    institution: mockInstitutionData,
};

// If you wanted to test how the form handles null values:
// const mockPageDataWithNulls = {
//   institution: {
//     ...mockInstitutionData,
//     picName: null,
//     contact: null,
//     address: null,
//   }
// }

// --- Test Suite ---
describe('/institutions/[id]/edit/+page.svelte', () => {
    beforeEach(() => {
        cleanup();
    });

    it('renders the edit form with the correct heading', () => {
        render(Page, { props: { data: mockPageData } });
        expect(
            screen.getByRole('heading', { name: /Edit Institution/i, level: 1 })
        ).toBeInTheDocument();
    });

    it('populates the form fields with data from props', () => {
        render(Page, { props: { data: mockPageData } });

        const nameInput = screen.getByLabelText(/Nama/i);
        const picInput = screen.getByLabelText(/PIC/i);
        const contactInput = screen.getByLabelText(/Kontak/i);
        const addressTextarea = screen.getByLabelText(/Alamat/i);

        // Assert values - .toHaveValue works correctly even if the source type allows null,
        // as long as the *mock instance* provides a string.
        expect(nameInput).toHaveValue(mockInstitutionData.name);
        // If picName was null in mock, expect(picInput).toHaveValue('');
        expect(picInput).toHaveValue(mockInstitutionData.picName);
        expect(contactInput).toHaveValue(mockInstitutionData.contact);
        expect(addressTextarea).toHaveValue(mockInstitutionData.address);
    });

    it('renders all required form elements', () => {
        render(Page, { props: { data: mockPageData } });

        expect(screen.getByLabelText(/Nama/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/PIC/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Kontak/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Alamat/i)).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /Update Institution/i })
        ).toBeInTheDocument();
    });

    // Optional: Test scenario with null values if needed
    // it('populates form fields correctly when data properties are null', () => {
    // 	render(Page, { props: { data: mockPageDataWithNulls } }); // Use the null variant mock
    //
    // 	const picInput = screen.getByLabelText(/PIC/i);
    // 	const contactInput = screen.getByLabelText(/Kontak/i);
    // 	const addressTextarea = screen.getByLabelText(/Alamat/i);
    //
    // 	expect(picInput).toHaveValue(''); // Inputs usually render null/undefined as empty string
    // 	expect(contactInput).toHaveValue('');
    // 	expect(addressTextarea).toHaveValue('');
    // });

});