import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async (event) => {
	const records = await event.locals.pb?.collection('alert_etf').getList(1, 50, {
		filter: 'rsi <= 30',
		sort: 'rsi'
	});

	let status: string;

	if (records) {
		status = 'ok';
	} else {
		status = 'bad';
	}

	return new Response(
		JSON.stringify({
			status,
			data: records?.items
		})
	);
};
