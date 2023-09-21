<script lang="ts">
	import ChartRsi from '$lib/components/ChartRSI.svelte';

	import { generateCandlestickData } from '$lib/genData.js';

	export let data;

	let { records } = data;

	records = records.map((x) => ({ code: x.code, rsi: x.rsi, name: x.name, cap: x.cap }));
	// records.sort((a, b) => (a.rsi > b.rsi ? 1 : b.rsi > a.rsi ? -1 : 0));
	records.sort((a, b) => (a.cap > b.cap ? -1 : b.cap > a.cap ? 1 : 0));

	let candleData = generateCandlestickData();
	let rsiData = calculateRSI(candleData, 6);

	function calculateRSI(data, count) {
		var rsi = function (data) {
			var gain = 0;
			var loss = 0;
			for (var i = 1; i < data.length; i++) {
				var diff = data[i].close - data[i - 1].close;
				if (diff < 0) {
					loss += Math.abs(diff);
				} else {
					gain += diff;
				}
			}
			return 100 - 100 / (1 + gain / data.length / (loss / data.length));
		};
		var result = [];
		for (var i = count; i < data.length; i++) {
			var val = rsi(data.slice(i - count, i));
			result.push({ time: data[i].time, value: val });
		}
		return result;
	}
</script>

<main class="grid place-items-center">
	<p>Total: {records.length}</p>
	<div class="w-[80vw] h-[33vh] m-auto mb-16">
		<ChartRsi {candleData} {rsiData} />
	</div>
	<div class="space-y-8 w-full">
		{#each records as record}
			<div class="flex items-center">
				<div class="ml-4 space-y-1">
					<p class="text-sm font-medium leading-none">Code: {record.code} Name: {record.name}</p>
					<p class="text-sm text-muted-foreground">
						Cap: {(parseFloat(record.cap) / 1_000_000_000.0).toFixed(4)}<span class="text-slate-900"
							>B</span
						>
					</p>
				</div>
				<div class="ml-auto font-medium">RSI: {parseFloat(record.rsi).toFixed(4)}</div>
			</div>
		{/each}
	</div>
</main>
