import { fail, redirect } from '@sveltejs/kit';
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
            return fail(400, {
                nama,
                pic,
                kontak,
                alamat,
                error: 'Nama Institusi tidak boleh kosong.',
                errors: {
                    nama: 'Nama Institusi tidak boleh kosong.',
                    pic: undefined, // Include pic error field
                    kontak: undefined, // Include kontak error field
                    alamat: undefined // Include alamat error field
                }
            });
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
            return fail(500, {
                nama,
                pic,
                kontak,
                alamat,
                error: 'Terjadi kesalahan saat menyimpan data institusi.'
            });
        }

        // Redirect on success
        redirect(303, '/institutions');
    }
};