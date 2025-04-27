import type { PageServerLoad } from './$types';

// Fetch products from DummyJSON API
export const load: PageServerLoad = async ({ url }) => {
	// Support pagination, search, and sorting via query params if needed
	const page = Number(url.searchParams.get('page') ?? 1);
	const limit = Number(url.searchParams.get('limit') ?? 20);
	const search = url.searchParams.get('search') ?? '';

	const apiUrl = new URL('https://dummyjson.com/products');
	apiUrl.searchParams.set('limit', String(limit));
	apiUrl.searchParams.set('skip', String((page - 1) * limit));
	if (search) apiUrl.searchParams.set('q', search);

	const res = await fetch(apiUrl.toString());
	if (!res.ok) throw new Error('Failed to fetch products from DummyJSON');
	const data = await res.json();

	return {
		products: data.products,
		total: data.total,
		page,
		limit,
		search
	};
};
