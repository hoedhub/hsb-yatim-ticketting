import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
    // Get pagination parameters from URL
    const page = Number(url.searchParams.get('page')) || 1;
    const limit = Number(url.searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;
    const search = url.searchParams.get('q') || '';

    // Build the DummyJSON API URL
    const apiUrl = new URL('https://dummyjson.com/products/search');
    apiUrl.searchParams.set('limit', String(limit));
    apiUrl.searchParams.set('skip', String(skip));
    if (search) {
        apiUrl.searchParams.set('q', search);
    }

    try {
        const res = await fetch(apiUrl.toString());
        if (!res.ok) {
            throw new Error('Failed to fetch products');
        }
        const data = await res.json();
        
        return {
            products: data.products,
            total: data.total,
            page,
            limit,
            search
        };
    } catch (error) {
        console.error('Error fetching products:', error);
        // Return empty data on error
        return {
            products: [],
            total: 0,
            page: 1,
            limit: 10,
            search: ''
        };
    }
};