import { writable } from 'svelte/store';

export const sModalData = writable({
	open: false,
	code: '',
	name: '',
	trackable: false
});

const DemoTrackData = {
	tracked: true,
	change: -0.03987,
	code: '1.600004',
	collectionId: '8khr0qon921onfp',
	collectionName: 'track',
	created: '2023-09-25 06:12:14.867Z',
	days: 11,
	id: '1eeqg6talqej6ju',
	name: 'cloud',
	started: '2023-09-13 12:00:00.000Z',
	updated: '2023-09-25 15:16:48.828Z'
};

export const sTrackData = writable<(typeof DemoTrackData)[]>([]);
