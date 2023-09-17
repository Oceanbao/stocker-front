import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	const resp = await event.fetch('/api/stocks');
	const stocks = resp.json();

	return {
		stocks
	};
};

export const actions = {
	default: async (event) => {
		const data = await event.request.formData();
		const start = data.get('start');

		if (typeof start !== 'string' || !start) {
			return fail(400, { invalid: true });
		}

		const resp = await event.fetch('/api/stocks', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ start })
		});

		const { result } = await resp.json();

		return {
			result
		};
	}
} satisfies Actions;
