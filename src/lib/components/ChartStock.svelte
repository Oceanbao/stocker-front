<script lang="ts">
	import { onMount } from 'svelte';

	import {
		createChart,
		type IChartApi,
		type LineData,
		type CandlestickData,
		type HistogramData,
		type ChartOptions,
		ColorType,
		LineStyle
	} from 'lightweight-charts';

	export let candleData: CandlestickData[];
	export let lineRsiData: LineData[];
	export let lineDataK: LineData[];
	export let lineDataD: LineData[];
	export let lineDataJ: LineData[];
	export let lineDataMacdDiff: LineData[];
	export let lineDataMacdDea: LineData[];
	export let lineDataMacdHist: HistogramData[];
	export let lineDataEma5: LineData[];
	export let lineDataEma50: LineData[];

	let chartElement: HTMLDivElement;
	let legendElement: HTMLDivElement;
	let chart: IChartApi;

	onMount(() => {
		const chartOptions: ChartOptions = {
			layout: {
				textColor: 'white',
				background: { type: ColorType.Solid, color: 'dark' },
				fontSize: 11,
				fontFamily: 'Roboto'
			},
			grid: {
				horzLines: {
					visible: false
				},
				vertLines: {
					visible: false
				}
			},
			rightPriceScale: {
				visible: false
			}
			// leftPriceScale: {
			// 	visible: true
			// }
		};
		chart = createChart(chartElement, chartOptions);

		const candleSeries = chart.addCandlestickSeries({
			priceScaleId: '0'
		});
		candleSeries.priceScale().applyOptions({
			scaleMargins: {
				top: 0,
				bottom: 0.7
			}
		});
		candleSeries.setData(candleData);

		const lineEma5Series = chart.addLineSeries({
			priceScaleId: '0',
			lastValueVisible: false,
			priceLineVisible: false,
			color: 'lightblue',
			lineWidth: 1
		});
		candleSeries.priceScale().applyOptions({
			scaleMargins: {
				top: 0,
				bottom: 0.7
			}
		});
		lineEma5Series.setData(lineDataEma5);

		const lineEma50Series = chart.addLineSeries({
			priceScaleId: '0',
			lastValueVisible: false,
			priceLineVisible: false,
			color: 'white',
			lineWidth: 1
		});
		candleSeries.priceScale().applyOptions({
			scaleMargins: {
				top: 0,
				bottom: 0.7
			}
		});
		lineEma50Series.setData(lineDataEma50);

		const lineRsi = chart.addLineSeries({
			lastValueVisible: false,
			priceLineVisible: false,
			priceScaleId: '1',
			color: 'rgb(126, 87, 194)',
			lineWidth: 2
		});
		lineRsi.priceScale().applyOptions({
			scaleMargins: {
				top: 0.2,
				bottom: 0.6
			}
		});
		lineRsi.setData(lineRsiData);

		const lineK = chart.addLineSeries({
			lastValueVisible: false,
			priceLineVisible: false,
			priceScaleId: '2',
			color: 'rgb(255,0,0)',
			lineWidth: 2
		});
		lineK.priceScale().applyOptions({
			scaleMargins: {
				top: 0.7,
				bottom: 0
			}
		});
		lineK.setData(lineDataK);

		const lineD = chart.addLineSeries({
			lastValueVisible: false,
			priceLineVisible: false,
			priceScaleId: '2',
			color: 'rgb(50,205,50)',
			lineWidth: 2
		});
		lineD.priceScale().applyOptions({
			scaleMargins: {
				top: 0.7,
				bottom: 0
			}
		});
		lineD.setData(lineDataD);

		const lineJ = chart.addLineSeries({
			lastValueVisible: false,
			priceLineVisible: false,
			priceScaleId: '2',
			color: 'rgb(126, 87, 194)',
			lineWidth: 2
		});
		lineJ.priceScale().applyOptions({
			scaleMargins: {
				top: 0.7,
				bottom: 0
			}
		});
		lineJ.setData(lineDataJ);

		const lineMacdHist = chart.addHistogramSeries({
			lastValueVisible: false,
			priceLineVisible: false,
			priceScaleId: '3'
		});
		lineMacdHist.priceScale().applyOptions({
			scaleMargins: {
				top: 0.4,
				bottom: 0.3
			}
		});
		lineMacdHist.setData(lineDataMacdHist);

		const lineMacdDiff = chart.addLineSeries({
			lastValueVisible: false,
			priceLineVisible: false,
			lineWidth: 1,
			color: 'yellow',
			priceScaleId: '3'
		});
		lineMacdDiff.priceScale().applyOptions({
			scaleMargins: {
				top: 0.4,
				bottom: 0.3
			}
		});
		lineMacdDiff.setData(lineDataMacdDiff);

		const lineMacdDea = chart.addLineSeries({
			lastValueVisible: false,
			priceLineVisible: false,
			lineStyle: LineStyle.Dashed,
			color: 'white',
			lineWidth: 1,
			priceScaleId: '3'
		});
		lineMacdDea.priceScale().applyOptions({
			scaleMargins: {
				top: 0.4,
				bottom: 0.3
			}
		});
		lineMacdDea.setData(lineDataMacdDea);

		setLegendText(lineRsiData[lineRsiData.length - 1].value);

		chart.subscribeCrosshairMove((param) => {
			if (!param.point) return;
			const validPoint = param.seriesData.get(lineRsi);
			if (!validPoint) return;

			const rsiPointData = param.seriesData.get(lineRsi) as LineData;
			const kPointData = param.seriesData.get(lineK) as LineData;
			const dPointData = param.seriesData.get(lineD) as LineData;
			const jPointData = param.seriesData.get(lineJ) as LineData;
			const macdHistPointData = param.seriesData.get(lineMacdHist) as HistogramData;
			const macdDiffPointData = param.seriesData.get(lineMacdDiff) as LineData;
			const macdDeaPointData = param.seriesData.get(lineMacdDea) as LineData;

			setLegendText({
				rsi: rsiPointData.value,
				k: kPointData.value,
				d: dPointData.value,
				j: jPointData.value,
				hist: macdHistPointData.value,
				diff: macdDiffPointData.value,
				dea: macdDeaPointData.value
			});
		});
		chart.resize(chartElement.offsetWidth, chartElement.offsetHeight);
		// chart.timeScale().fitContent();
	});

	function setLegendText(points: any) {
		let rsi = (Math.round(points.rsi * 100) / 100).toFixed(2);
		// let k = (Math.round(points.k * 100) / 100).toFixed(2);
		// let d = (Math.round(points.d * 100) / 100).toFixed(2);
		let j = (Math.round(points.j * 100) / 100).toFixed(2);
		let hist = (Math.round(points.hist * 100) / 100).toFixed(2);
		let diff = (Math.round(points.diff * 100) / 100).toFixed(2);
		let dea = (Math.round(points.dea * 100) / 100).toFixed(2);
		legendElement.innerHTML = `
<div class="flex gap-2 text-xs sm:text-lg">
  <span class="text-red-400">RSI: ${rsi}</span>
  <span class="text-blue-400">J: ${j}</span>
  <span class="text-blue-400">DIF: ${diff}</span>
  <span class="text-blue-400">DEA: ${dea}</span>
  <span class="text-blue-400">M: ${hist}</span>
</div>
`;
	}
</script>

<div id="chart-container" bind:this={chartElement} class="h-[50vh] w-full">
	<div class="left-1 top-1 border-slate-800 border rounded text-center" bind:this={legendElement} />
</div>
