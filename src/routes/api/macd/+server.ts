import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async (event) => {
	const records = await event.locals.pb?.collection('daily').getList(1, 50, {
		filter: 'date >= "2023-07-01"'
	});

	return new Response(
		JSON.stringify({
			records
		})
	);
};
