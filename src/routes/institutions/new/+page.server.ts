import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { institutions } from '$lib/server/db';

export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const nama = data.get('nama')?.toString();
        const pic = data.get('pic')?.toString();
        const kontak = data.get('kontak')?.toString();
        const alamat = data.get('alamat')?.toString();

        // Basic validation
        if (!nama) {
            return {
                success: false,
                message: 'Validasi gagal.', // General message for validation errors
                nama,
                pic,
                kontak,
                alamat,
                errors: {
                    nama: 'Nama Institusi tidak boleh kosong.',
                    pic: undefined,
                    kontak: undefined,
                    alamat: undefined
                }
            };
        }

        try {
            await db.insert(institutions).values({
                name: nama,
                picName: pic || null, // Allow null if empty
                contact: kontak || null, // Allow null if empty
                address: alamat || null // Allow null if empty
            });
        } catch (error) {
            console.error('Database insertion failed:', error);
            return {
                success: false,
                message: 'Terjadi kesalahan saat menyimpan data institusi.',
                nama,
                pic,
                kontak,
                alamat
            };
        }

        // Return success message on success
        return {
            success: true,
            message: 'Institusi berhasil ditambahkan.'
        };
    }
};