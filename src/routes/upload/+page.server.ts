import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';

// export const load: PageServerLoad = async (event) => {
// const resp = await event.fetch('/api/stocks');
// const resp = await event.locals.pb?.send('/upload', {
// 	method: 'GET'
// });
// return {
// 	resp
// };
// };

export const actions = {
	daily: async (event) => {
		const formData = Object.fromEntries(await event.request.formData());
		const { code } = formData;

		console.log(code);

		if (!code || code === 'undefined') {
			return fail(400, { invalid: true });
		}

		try {
			const resp = await event.locals.pb?.send(`/daily?code=${code}`, {
				method: 'GET'
			});
		} catch (err) {
			console.log('err: ', err);
			return fail(400, { error: JSON.stringify(err) });
		}

		return {
			result: 'ok'
		};
	}
} satisfies Actions;
