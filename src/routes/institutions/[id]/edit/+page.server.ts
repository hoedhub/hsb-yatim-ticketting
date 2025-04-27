import { db } from '$lib/server/db';
import { institutions } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { error, redirect } from '@sveltejs/kit';
import type { ServerLoadEvent, RequestEvent } from '@sveltejs/kit'; // Import necessary types

export const load = async ({ params }: ServerLoadEvent) => { // Use ServerLoadEvent type
    const institutionId = params.id;
    if (!institutionId) {
        error(400, 'Institution ID is required');
    }

    const institution = await db.select().from(institutions).where(eq(institutions.id, parseInt(institutionId))).limit(1); // Parse ID to integer

    if (!institution || institution.length === 0) {
        error(404, 'Institution not found');
    }

    return {
        institution: institution[0]
    };
};

export const actions = {
    update: async ({ request, params }: RequestEvent) => { // Renamed from default to update
        const formData = await request.formData();
        const institutionId = params.id;
        if (!institutionId) {
            error(400, 'Institution ID is required');
        }

        const nama = formData.get('nama')?.toString();
        const pic = formData.get('pic')?.toString();
        const kontak = formData.get('kontak')?.toString();
        const alamat = formData.get('alamat')?.toString();

        if (!nama || !pic || !kontak || !alamat) {
            // Basic validation
            return {
                success: false,
                message: 'All fields are required.'
            };
        }

        try {
            await db.update(institutions)
                .set({
                    name: nama, // Corrected column name
                    picName: pic, // Corrected column name
                    contact: kontak, // Corrected column name
                    address: alamat // Corrected column name
                })
                .where(eq(institutions.id, parseInt(institutionId))); // Parse ID to integer

        } catch (err) {
            console.error('Error updating institution:', err);
            return {
                success: false,
                message: 'Failed to update institution.'
            };
        }

        const action = formData.get('action')?.toString();

        // Return success message regardless of action, client will handle redirect
        return {
            success: true,
            message: 'Institution updated successfully.',
            action: action // Include action in the response for client-side handling
        };
    },

    delete: async ({ params }: RequestEvent) => { // Use RequestEvent type
        const institutionId = params.id;
        if (!institutionId) {
            error(400, 'Institution ID is required');
        }

        try {
            await db.delete(institutions)
                .where(eq(institutions.id, parseInt(institutionId))); // Parse ID to integer

        } catch (err) {
            console.error('Error deleting institution:', err);
            // Handle potential foreign key constraints or other errors
            error(500, 'Failed to delete institution. It might be linked to existing data.');
        }

        // Redirect to the list page after successful deletion
        redirect(303, '/institutions');
    }
};