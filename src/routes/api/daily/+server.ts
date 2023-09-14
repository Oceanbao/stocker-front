import type { RequestHandler } from '@sveltejs/kit';

import { pb } from '$lib/pb';

export const GET: RequestHandler = async (event) => {
	return new Response(
		JSON.stringify({
			data: ''
		})
	);
};
