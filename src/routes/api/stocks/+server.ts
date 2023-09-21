import type { RequestHandler } from '@sveltejs/kit';

// function getData(start = 0) {
// 	const out: Record<string, any>[] = [];
// 	tickers.forEach((x) => {
// 		x.data.diff.forEach((y) => {
// 			out.push({
// 				code: y.f13 === 0 ? `sz${y.f12}` : `sh${y.f12}`,
// 				name: y.f14,
// 				cap: y.f21
// 			});
// 		});
// 	});
// 	return out.slice(start, start + 20);
// }

export const GET: RequestHandler = async (event) => {
	const records = await event.locals.pb?.collection('alert').getFullList({
		filter: 'rsi <= 30'
	});

	return new Response(
		JSON.stringify({
			records
		})
	);
};

// export const POST: RequestHandler = async (event) => {
// 	const { start } = await event.request.json();
// 	if (!start) {
// 		return new Response(
// 			JSON.stringify({
// 				result: 'require start query.'
// 			})
// 		);
// 	}

// 	const data = getData(parseInt(start));

// 	const promises = data.map((x) => {
// 		return event.locals.pb?.collection('stocks').create(x, {
// 			$autoCancel: false
// 		});
// 	});

// 	const results = await Promise.allSettled(promises);

// 	const failed = results.filter((x) => x.status === 'rejected');

// 	return new Response(
// 		JSON.stringify({
// 			result: failed.length ? failed : 'ok'
// 		})
// 	);
// };
