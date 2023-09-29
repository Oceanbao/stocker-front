import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async (event) => {
	const code = event.url.searchParams.get('code');
	if (!code) {
		return new Response(
			JSON.stringify({
				status: 'bad',
				message: 'require code'
			})
		);
	}

	const today = new Date();
	const xDayAgo = 240;
	const thatDate = new Date(today - 1000 * 60 * 60 * 24 * xDayAgo);
	const thatDateFormatted = thatDate.toJSON().slice(0, 10);

	const records = await event.locals.pb?.collection('daily').getFullList({
		filter: `code = "${code}" && date >= "${thatDateFormatted} 00:00:00"`
	});

	return new Response(
		JSON.stringify({
			status: 'bad',
			message: 'success',
			data: records
		})
	);
};
