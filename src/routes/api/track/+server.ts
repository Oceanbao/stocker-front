import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async (event) => {
	const records = await event.locals.pb?.collection('track').getFullList();

	let status: string;

	if (records) {
		status = 'ok';
	} else {
		status = 'bad';
	}

	return new Response(
		JSON.stringify({
			status,
			data: records
		})
	);
};
