import { writable } from 'svelte/store';

export const sModalData = writable({
	open: false,
	code: '',
	name: '',
	trackable: false
});

const DemoTrackData = {
	code: '1.600004',
	name: 'cloud',
	days: 11,
	change: -0.03987
};

export const sTrackData = writable<(typeof DemoTrackData)[]>([]);
