import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const user = event.locals.user;

	const getAlertRecords = async () => {
		const resp = await event.fetch('/api/alert');
		const body = await resp.json();
		if (body.status === 'ok') {
			return body.data;
		} else {
			return null;
		}
	};

	const getTrackRecords = async () => {
		const resp = await event.fetch('/api/track');
		const body = await resp.json();
		if (body.status === 'ok') {
			return body.data;
		} else {
			return null;
		}
	};

	if (user) {
		return {
			user,
			isLoggedIn: true,
			records: {
				alert: getAlertRecords(),
				track: getTrackRecords()
			}
		};
	}

	return {
		user: undefined,
		isLoggedIn: false,
		records: undefined
	};
};
