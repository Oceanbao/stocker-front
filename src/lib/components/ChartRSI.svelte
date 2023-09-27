<script lang="ts">
	import { onMount } from 'svelte';

	import {
		createChart,
		type IChartApi,
		type LineData,
		type CandlestickData
	} from 'lightweight-charts';

	export let candleData: CandlestickData[];
	export let rsiData: LineData[];

	let chartElement: HTMLDivElement;
	let legendElement: HTMLDivElement;
	let chart: IChartApi;

	onMount(() => {
		chart = createChart(chartElement);
		const rsiLine = chart.addLineSeries({
			lastValueVisible: false,
			priceLineVisible: false,
			priceScaleId: 'left',
			color: 'rgb(126, 87, 194)',
			lineWidth: 2
		});
		rsiLine.setData(rsiData);

		const candleSeries = chart.addCandlestickSeries();
		candleSeries.setData(candleData);

		setLegendText(rsiData[rsiData.length - 1].value);

		chart.subscribeCrosshairMove((param) => {
			const data = param.seriesData.get(rsiLine) as LineData;
			if (!data) {
				return;
			}
			setLegendText(data.value);
		});
		chart.resize(chartElement.offsetWidth, chartElement.offsetHeight);
		// chart.timeScale().fitContent();
	});

	function setLegendText(priceValue: number) {
		let val = 'n/a';
		if (priceValue !== undefined) {
			val = (Math.round(priceValue * 100) / 100).toFixed(2);
		}
		legendElement.innerHTML = 'RSI <span style="color:rgb(126, 87, 194)">' + val + '</span>';
	}
</script>

<div id="chart-container" bind:this={chartElement} class="h-[50vh] w-full">
	<div
		class="rsi-legend block left-1 top-1 border-slate-800 border rounded w-20 text-center"
		bind:this={legendElement}
	/>
</div>
