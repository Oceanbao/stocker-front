import { json } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

class InMemoryCache {
	constructor() {
		this.cache = {};
	}

	get(key) {
		return this.cache[key];
	}

	set(key, value) {
		this.cache[key] = value;
	}

	delete(key) {
		delete this.cache[key];
	}

	clear() {
		this.cache = {};
	}
}

const cache = new InMemoryCache();

export const load: PageServerLoad = async (event) => {
	let records = cache.get('records');

	if (records) {
		console.log('reading cache');
		return records;
	}

	const resp = await event.fetch('/api/stocks');
	records = await resp.json();

	cache.set('records', records);

	return records;
};

// class MemoryCache {
//   constructor() {
//     this.cache = {};
//   }

//   get(key) {
//     return this.cache[key];
//   }

//   set(key, value) {
//     this.cache[key] = value;
//   }

//   delete(key) {
//     delete this.cache[key];
//   }

//   clear() {
//     this.cache = {};
//   }
// }

// // Usage
// const cache = new MemoryCache();

// // Set value
// cache.set('key1', 'value1');

// // Get value
// console.log(cache.get('key1')); // Outputs: 'value1'

// // Delete value
// cache.delete('key1');

// // Check value
// console.log(cache.get('key1')); // Outputs: undefined

// // Clear cache
// cache.clear();
