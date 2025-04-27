import { db } from '$lib/server/db';
import { institutions } from '$db/schema';
import { fail } from '@sveltejs/kit';

import { eq } from 'drizzle-orm';
export const load = async () => {
    // console.log(`\n--- SERVER LOG: +page.server.ts load function RUNNING (${new Date().toISOString()}) ---`); // Log start
    const institutionList = await db.select().from(institutions);

    const plainInstitutions = institutionList.map((inst) => ({ ...inst }));
    // console.log(`--- SERVER LOG: +page.server.ts load function FETCHED ${plainInstitutions.length} institutions ---`); // Log count
    return {
        institutions: plainInstitutions
    };
};
export const actions = {
    delete: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id');

        if (!id) {
            return fail(400, { success: false, message: 'Institution ID is missing.' });
        }

        let institutionId: number;
        try {
            institutionId = parseInt(id.toString(), 10);
            if (isNaN(institutionId)) {
                throw new Error('Invalid ID format');
            }
        } catch (error) {
            return fail(400, { success: false, message: 'Invalid Institution ID provided.' });
        }

        try {
            // 1. Find the institution first to get its name
            const found = await db
                .select({ name: institutions.name }) // Select only the name
                .from(institutions)
                .where(eq(institutions.id, institutionId))
                .limit(1); // We only need one result

            if (!found || found.length === 0) {
                // Institution didn't exist before trying to delete
                return fail(404, { success: false, message: `Institution with ID ${institutionId} not found.` });
            }

            const institutionName = found[0].name; // Get the name from the result

            // 2. Now perform the delete operation
            await db.delete(institutions).where(eq(institutions.id, institutionId));

            console.log(`Successfully deleted institution '${institutionName}' (ID: ${institutionId})`);

            // 3. Return success including the name in the message
            return {
                success: true,
                message: `Institusi '${institutionName}' (ID: ${institutionId}) berhasil dihapus.`
                // Optionally, you could also return the name/ID separately if needed:
                // deletedId: institutionId,
                // deletedName: institutionName
            };

        } catch (error) {
            console.error(`Error during delete process for institution ID ${institutionId}:`, error);
            // Use fail for unexpected server errors
            return fail(500, { success: false, message: 'Gagal menghapus institusi karena kesalahan server.' });
        }
    }
};