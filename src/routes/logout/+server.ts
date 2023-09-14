import { redirect } from '@sveltejs/kit';

import type { RequestEvent, RequestHandler } from './$types';

export const GET: RequestHandler = (event: RequestEvent) => {
	event.locals.pb?.authStore.clear();

	event.locals.user = undefined;

	throw redirect(302, '/');
};
