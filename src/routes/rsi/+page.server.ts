import type { PageServerLoad } from './$types';

import { InMemoryCache } from '$lib/utils';

const cache = new InMemoryCache();

export const load: PageServerLoad = async (event) => {
	let records = cache.get('records');

	if (records && records.length) {
		return records;
	}

	const resp = await event.fetch('/api/stocks');
	records = await resp.json();

	cache.set('records', records);

	return records;
};
