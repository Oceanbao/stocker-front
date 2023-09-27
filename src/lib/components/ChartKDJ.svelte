<script lang="ts">
	import { onMount } from 'svelte';

	import {
		createChart,
		type IChartApi,
		type LineData,
		type ChartOptions,
		ColorType
	} from 'lightweight-charts';

	export let lineDataK: LineData[];
	export let lineDataD: LineData[];
	export let lineDataJ: LineData[];

	let chartElement: HTMLDivElement;
	let legendElement: HTMLDivElement;
	let chart: IChartApi;

	onMount(() => {
		// const chartOptions: ChartOptions = {
		// 	layout: {
		// 		textColor: 'black',
		// 		background: { type: ColorType.Solid, color: 'white' },
		// 		fontSize: 11,
		// 		fontFamily: 'Roboto'
		// 	}
		// };
		chart = createChart(chartElement);

		const lineK = chart.addLineSeries({
			lastValueVisible: false,
			priceLineVisible: false,
			priceScaleId: 'left',
			color: 'rgb(255,0,0)',
			lineWidth: 2
		});
		lineK.setData(lineDataK);

		const lineD = chart.addLineSeries({
			lastValueVisible: false,
			priceLineVisible: false,
			priceScaleId: 'left',
			color: 'rgb(50,205,50)',
			lineWidth: 2
		});
		lineD.setData(lineDataD);

		const lineJ = chart.addLineSeries({
			lastValueVisible: false,
			priceLineVisible: false,
			priceScaleId: 'left',
			color: 'rgb(126, 87, 194)',
			lineWidth: 2
		});
		lineJ.setData(lineDataJ);

		setLegendText(lineDataJ[lineDataJ.length - 1].value);

		chart.subscribeCrosshairMove((param) => {
			const data = param.seriesData.get(lineJ) as LineData;
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
		legendElement.innerHTML = 'J: <span style="color:rgb(126, 87, 194)">' + val + '</span>';
	}
</script>

<div id="chart-container" bind:this={chartElement} class="h-[50vh] w-full">
	<div
		class="rsi-legend block left-1 top-1 border-slate-800 border rounded w-20 text-center"
		bind:this={legendElement}
	/>
</div>
