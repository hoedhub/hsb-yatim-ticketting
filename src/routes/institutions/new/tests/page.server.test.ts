import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { fail, redirect } from '@sveltejs/kit';
import { actions } from '../+page.server';
import { db } from '$lib/server/db';
import { institutions } from '../../../../db/schema';
import { eq } from 'drizzle-orm';

// Mock the database module
vi.mock('$lib/server/db', async (importOriginal) => {
    const actual = await importOriginal<typeof import('$lib/server/db')>();
    return {
        ...actual,
        db: {
            insert: vi.fn(() => {
                const valuesMock = vi.fn().mockReturnThis();
                const returningMock = vi.fn().mockReturnThis();
                const executeMock = vi.fn();
                return {
                    values: valuesMock,
                    returning: returningMock,
                    execute: executeMock
                };
            }) as Mock, // Cast to Mock to allow spying on chained methods
            select: vi.fn(() => ({
                from: vi.fn().mockReturnThis(),
                where: vi.fn().mockReturnThis(),
                execute: vi.fn()
            })),
            delete: vi.fn(() => ({
                from: vi.fn().mockReturnThis(),
                where: vi.fn().mockReturnThis(),
                execute: vi.fn()
            }))
        }
    };
});

// Mock SvelteKit functions
vi.mock('@sveltejs/kit', () => ({
    fail: vi.fn((status, data) => ({ status, data })),
    redirect: vi.fn((status, location) => {
        throw { status, location }; // Simulate redirect by throwing
    })
}));

describe('Add Institution Server Action', () => {
    let mockRequest: Request;

    beforeEach(() => {
        // Reset mocks before each test
        vi.clearAllMocks();
    });

    it('should return validation error if "nama" is empty', async () => {
        const formData = new FormData();
        formData.append('pic', 'Test PIC');
        formData.append('kontak', '1234567890');
        formData.append('alamat', 'Test Address');

        mockRequest = new Request('http://localhost/', {
            method: 'POST',
            body: formData
        });

        const result = await actions.default({ request: mockRequest } as any);

        expect(fail).toHaveBeenCalledWith(400, {
            nama: undefined,
            pic: 'Test PIC',
            kontak: '1234567890',
            alamat: 'Test Address',
            error: 'Nama Institusi tidak boleh kosong.',
            errors: {
                nama: 'Nama Institusi tidak boleh kosong.'
            }
        });
        expect(db.insert).not.toHaveBeenCalled();
        expect(redirect).not.toHaveBeenCalled();
    });

    it('should successfully insert institution and redirect on valid submission', async () => {
        const formData = new FormData();
        formData.append('nama', 'Valid Institution');
        formData.append('pic', 'Test PIC');
        formData.append('kontak', '1234567890');
        formData.append('alamat', 'Test Address');

        mockRequest = new Request('http://localhost/', {
            method: 'POST',
            body: formData
        });

        // Mock the database insert to succeed
        // Mock the database insert to succeed
        const mockValues = vi.fn().mockReturnValue({
            returning: vi.fn().mockReturnValue({
                execute: vi.fn().mockResolvedValue([{ id: 1, nama: 'Valid Institution' }])
            })
        });
        (db.insert as Mock).mockReturnValue({
            values: mockValues
        });

        await actions.default({ request: mockRequest } as any);

        expect(db.insert).toHaveBeenCalledWith(institutions);
        expect(mockValues).toHaveBeenCalledWith({
            name: 'Valid Institution',
            picName: 'Test PIC',
            contact: '1234567890',
            address: 'Test Address'
        });
        expect(fail).not.toHaveBeenCalled();
        expect(redirect).toHaveBeenCalledWith(303, '/institutions');
    });

    it('should return a server error if database insertion fails', async () => {
        const formData = new FormData();
        formData.append('nama', 'Institution with DB Error');
        formData.append('pic', 'Test PIC');
        formData.append('kontak', '1234567890');
        formData.append('alamat', 'Test Address');

        mockRequest = new Request('http://localhost/', {
            method: 'POST',
            body: formData
        });

        // Mock the database insert to throw an error
        const mockValues = vi.fn().mockReturnValue({
            returning: vi.fn().mockReturnValue({
                execute: vi.fn().mockRejectedValue(new Error('Simulated DB Error'))
            })
        });
        (db.insert as Mock).mockReturnValue({
            values: mockValues
        });


        const result = await actions.default({ request: mockRequest } as any);

        expect(db.insert).toHaveBeenCalledWith(institutions);
        expect(mockValues).toHaveBeenCalledWith({
            name: 'Institution with DB Error',
            picName: 'Test PIC',
            contact: '1234567890',
            address: 'Test Address'
        });
        expect(fail).toHaveBeenCalledWith(500, {
            nama: 'Institution with DB Error',
            pic: 'Test PIC',
            kontak: '1234567890',
            alamat: 'Test Address',
            error: 'Terjadi kesalahan saat menyimpan data institusi.'
        });
        expect(redirect).not.toHaveBeenCalled();
        expect(result).toEqual({
            status: 500,
            data: {
                nama: 'Institution with DB Error',
                pic: 'Test PIC',
                kontak: '1234567890',
                alamat: 'Test Address',
                error: 'Terjadi kesalahan saat menyimpan data institusi.'
            }
        });
    });
});