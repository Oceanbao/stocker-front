import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';

import type { ClientResponseError } from '$lib/server/pb';

export const actions: Actions = {
	track: async (event) => {
		const data = await event.request.formData();
		const code = data.get('code');
		const name = data.get('name');

		if (typeof code !== 'string' || typeof name !== 'string' || !code || !name) {
			return fail(400, { invalid: true });
		}

		let recordFound = undefined;

		try {
			const records = await event.locals.pb?.collection('track').getList(1, 5, {
				filter: `code = "${code}"`
			});
			if (records?.items.length) {
				recordFound = records?.items.pop();
			}
		} catch (err: unknown) {
			return fail(400, { message: (err as ClientResponseError).data.message });
		}

		if (recordFound)
			return fail(400, {
				message: 'Track action expect no existing record in collection `track`'
			});

		const date = new Date();
		const dateFormatted = date.toJSON().slice(0, 10);

		try {
			const record = await event.locals.pb?.collection('track').create({
				code,
				name,
				started: `${dateFormatted} 00:00:00`
			});
			return { message: 'ok', data: record };
		} catch (err: unknown) {
			return fail(400, { message: (err as ClientResponseError).data.message });
		}
	},
	untrack: async (event) => {
		const data = await event.request.formData();
		const code = data.get('code');
		const name = data.get('name');

		await new Promise((r) => setTimeout(r, 4000));

		if (typeof code !== 'string' || typeof name !== 'string' || !code || !name) {
			return fail(400, { invalid: true });
		}

		let recordFound = undefined;

		try {
			const records = await event.locals.pb?.collection('track').getList(1, 5, {
				filter: `code = "${code}"`
			});
			if (records?.items.length) {
				recordFound = records?.items.pop();
			}
		} catch (err: unknown) {
			return fail(400, { message: (err as ClientResponseError).data.message });
		}

		if (!recordFound)
			return fail(400, {
				message: 'Untrack action expect a record already exist in collection `track`'
			});

		try {
			await event.locals.pb?.collection('track').delete(recordFound.id);
			return {
				message: 'ok'
			};
		} catch (err: unknown) {
			return fail(400, { message: (err as ClientResponseError).data.message });
		}
	}
};
