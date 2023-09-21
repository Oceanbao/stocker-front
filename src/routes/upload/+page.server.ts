// import type { Actions, PageServerLoad } from './$types';
// import { fail } from '@sveltejs/kit';

// export const load: PageServerLoad = async (event) => {
// const resp = await event.fetch('/api/stocks');
// const resp = await event.locals.pb?.send('/upload', {
// 	method: 'GET'
// });
// return {
// 	resp
// };
// };

// export const actions = {
// 	default: async (event) => {
// 		const formData = Object.fromEntries(await event.request.formData());
// 		const { file } = formData as { file: File };

// 		if (!file.name || file.name === 'undefined') {
// 			return fail(400, { invalid: true });
// 		}

// 		try {
// 			const resp = await event.locals.pb?.send('/upload', {
// 				method: 'POST',
// 				headers: { 'content-type': 'application/json' },
// 				body: JSON.stringify({ daily: JSON.parse(await file.text()) })
// 			});
// 		} catch (err) {
// 			console.log('err: ', err);
// 			return fail(400, { error: JSON.stringify(err) });
// 		}

// 		return {
// 			result: 'ok'
// 		};
// 	}
// } satisfies Actions;
