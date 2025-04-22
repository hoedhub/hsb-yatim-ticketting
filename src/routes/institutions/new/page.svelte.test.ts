// src/routes/institutions/new/page.svelte.test.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, cleanup, within } from '@testing-library/svelte';
import '@testing-library/jest-dom/vitest';

import Page from './+page.svelte';

// Explicit type definition (as before)
type FormFields = {
    nama?: string | null;
    pic?: string | null;
    kontak?: string | null;
    alamat?: string | null;
};
type FieldErrors = {
    nama?: string;
    pic?: string;
    kontak?: string;
    alamat?: string;
};
type TestActionData = FormFields & {
    error?: string;
    errors?: FieldErrors;
} | undefined | null;


describe('/institutions/new/+page.svelte', () => {
    beforeEach(() => {
        cleanup();
    });

    // --- Test Case 1: Initial Render (no change) ---
    it('renders the form correctly on initial load', () => {
        render(Page);
        // ... assertions ...
    });

    // --- Test Case 2: Render with Validation Error ---
    it('displays validation errors and repopulates fields when form data with errors is passed', () => {
        const mockValidationError: TestActionData = {
            nama: '',
            pic: 'Test PIC',
            kontak: '12345',
            alamat: 'Test Address',
            error: 'Nama Institusi tidak boleh kosong.', // Defined here
            errors: {
                nama: 'Nama Institusi tidak boleh kosong.',
            }
        };

        render(Page, { props: { form: mockValidationError } });

        const alert = screen.getByRole('alert');
        expect(alert).toBeInTheDocument();

        expect(alert).toHaveClass('alert-error');
        // --- FIX: Target the specific field error more precisely ---
        // 1. Find the input field
        const namaInput = screen.getByLabelText(/Nama Institusi/i);
        // 2. Find its parent form control container
        const formControl = namaInput.closest('.form-control') as HTMLElement; // Assert as HTMLElement        expect(formControl).toBeInTheDocument(); // Ensure container was found

        // 3. Search *within* that container for the specific error text
        //    This ignores the error text in the general alert box.
        const fieldError = within(formControl!).getByText(mockValidationError!.errors!.nama!);
        expect(fieldError).toBeInTheDocument();
        // Optional: Check if it has the correct class for extra certainty
        expect(fieldError).toHaveClass('label-text-alt', 'text-error');
        // --- END FIX ---

        // expect(screen.getByText(mockValidationError!.errors!.nama!)).toBeInTheDocument();
        expect(namaInput).toHaveClass('input-error');
        expect(namaInput).toHaveAttribute('aria-invalid', 'true');
        expect(namaInput).toHaveAttribute('aria-describedby', 'nama-error');

        expect(namaInput).toHaveValue(mockValidationError!.nama!);
        expect(screen.getByLabelText(/Nama PIC/i)).toHaveValue(mockValidationError!.pic!);
        expect(screen.getByLabelText(/Kontak/i)).toHaveValue(mockValidationError!.kontak!);
        expect(screen.getByLabelText(/Alamat/i)).toHaveValue(mockValidationError!.alamat!);

        const picInput = screen.getByLabelText(/Nama PIC/i);
        expect(picInput).not.toHaveClass('input-error');
        expect(picInput).not.toHaveAttribute('aria-invalid', 'true');
    });

    // --- Test Case 3: Render with Server Error ---
    it('displays a server error message when form data with only a general error is passed', () => {
        const mockServerError: TestActionData = {
            nama: 'Valid Name',
            pic: 'Another PIC',
            kontak: '54321',
            alamat: 'Another Address',
            error: 'Terjadi kesalahan saat menyimpan data institusi.', // Defined here
        };

        render(Page, { props: { form: mockServerError } });

        const alert = screen.getByRole('alert');
        expect(alert).toBeInTheDocument();
        // --- FIX: Add '!' to the 'error' property itself ---
        expect(alert).toHaveTextContent(mockServerError!.error!); // Asserts error is not undefined
        // --- END FIX ---
        expect(alert).toHaveClass('alert-error');

        expect(screen.queryByText(/tidak boleh kosong/i)).not.toBeInTheDocument();

        const namaInput = screen.getByLabelText(/Nama Institusi/i);
        expect(namaInput).not.toHaveClass('input-error');
        expect(namaInput).not.toHaveAttribute('aria-invalid', 'true');

        expect(namaInput).toHaveValue(mockServerError!.nama!);
        expect(screen.getByLabelText(/Nama PIC/i)).toHaveValue(mockServerError!.pic!);
        expect(screen.getByLabelText(/Kontak/i)).toHaveValue(mockServerError!.kontak!);
        expect(screen.getByLabelText(/Alamat/i)).toHaveValue(mockServerError!.alamat!);
    });
});