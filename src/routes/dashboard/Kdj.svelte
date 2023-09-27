<script lang="ts">
	import ChartKdj from '$lib/components/ChartKDJ.svelte';
	import { onMount } from 'svelte';

	const DemoKDJ = {
		time: '2020-01-01',
		k: 50,
		d: 50,
		j: 50
	};
	type TKdj = typeof DemoKDJ;

	const DemoDaily = {
		close: 4.8,
		high: 4.82,
		low: 4.7,
		open: 4.8,
		time: '2023-05-30'
	};

	type TDaily = typeof DemoDaily;

	export let candleData: TDaily[];

	// async function getData(code: string) {
	// 	const data = await fetchDaily(code);
	// 	candleData = data?.map((x: any) => ({
	// 		time: x.date.slice(0, 10),
	// 		open: x.open,
	// 		high: x.high,
	// 		low: x.low,
	// 		close: x.close
	// 	}));
	// }

	// async function fetchDaily(code: string) {
	// 	const resp = await fetch(`/api/daily?code=${code}`, {
	// 		method: 'GET'
	// 	});
	// 	try {
	// 		const body = await resp.json();
	// 		if (body.data) {
	// 			return body.data;
	// 		}
	// 	} catch (err) {
	// 		console.log(err);
	// 		return;
	// 	}
	// }

	function KDJ(data: TDaily[]) {
		const allRSV: number[] = [];
		const rsv = (idx: number) => {
			const range = () => {
				const diff = idx + 1 - 9;
				const start = diff > 0 ? diff : 0;
				return data.slice(start, idx + 1);
			};

			const C = data[idx].close;
			const L = range().reduce((acc, curr) => (acc < curr.low ? acc : curr.low), 9999);
			const H = range().reduce((acc, curr) => (acc > curr.high ? acc : curr.high), -1);

			return ((C - L) / (H - L)) * 100;
		};

		data.forEach((_, idx) => allRSV.push(rsv(idx)));

		const result: TKdj[] = [];

		allRSV.forEach((thisRSV, idx) => {
			if (idx === 0) {
				result.push({
					time: data[idx].time,
					k: 50,
					d: 50,
					j: 50
				});
				return;
			}

			const thisK = (2 * result[idx - 1].k + thisRSV) / 3;
			const thisD = (2 * result[idx - 1].d + thisK) / 3;
			const thisJ = 3 * thisK - 2 * thisD;

			result.push({
				time: data[idx].time,
				k: thisK,
				d: thisD,
				j: thisJ
			});
		});

		return result;
	}

	let kdj: TKdj[];

	onMount(() => {
		kdj = KDJ(candleData);
	});
</script>

{#if kdj}
	<ChartKdj
		lineDataK={kdj.map((x) => ({ time: x.time, value: x.k }))}
		lineDataD={kdj.map((x) => ({ time: x.time, value: x.d }))}
		lineDataJ={kdj.map((x) => ({ time: x.time, value: x.j }))}
	/>
{/if}
