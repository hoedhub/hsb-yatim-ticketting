import { db } from '$lib/server/db';
import { institutions } from '$db/schema';

export const load = async () => {
    const institutionList = await db.select().from(institutions);

    return {
        institutions: institutionList
    };
};