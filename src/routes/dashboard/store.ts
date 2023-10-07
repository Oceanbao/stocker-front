import { writable } from 'svelte/store';

export const sModalData = writable({
	open: false,
	code: '',
	name: '',
	trackable: false,
	etf: false
});

const DemoTrackData = {
	code: '1.600004',
	name: 'cloud',
	started: '2012-02-02'
};

export const sTrackData = writable<(typeof DemoTrackData)[]>([]);

export const sTrackETFData = writable<(typeof DemoTrackData)[]>([]);
