<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import ChartStock from '$lib/components/ChartStock.svelte';
	import { Loader2 } from 'lucide-svelte';
	import { sModalData, sTrackData } from './store';
	import {
		computeKDJ,
		computeMACD,
		computeRSI,
		computeEMA,
		type TDaily,
		type TKdj,
		type TMacd,
		type TRsi,
		type TEma
	} from './chartUtils';

	let dailyCache: Map<string, Record<string, string>[]> = new Map();
	let candleData: TDaily[];
	let rsiData: TRsi[];
	let kdjData: TKdj[];
	let macdData: TMacd[];
	let ema5Data: TEma[];
	let ema50Data: TEma[];
	let loadingRequest = true;
	let loadingTrackAction = false;
	let actionResult: string;
	let thisStockTracked: boolean | undefined;

	async function openDialog() {
		loadingRequest = true;
		thisStockTracked = $sTrackData.some((x) => x.code === $sModalData.code);

		let dataStored = dailyCache.get($sModalData.code);
		if (!dataStored) {
			dataStored = await fetchDaily($sModalData.code, $sModalData.etf);
			if (!dataStored) {
				console.log('ERROR: failed to fetch `daily` data');
				loadingRequest = false;
				return;
			}
			dailyCache.set($sModalData.code, dataStored);
		}

		candleData = dataStored?.map((x) => ({
			time: x.date.slice(0, 10),
			open: parseFloat(x.open),
			high: parseFloat(x.high),
			low: parseFloat(x.low),
			close: parseFloat(x.close)
		}));
		rsiData = computeRSI(
			candleData.map((x) => ({ time: x.time, closing: x.close })),
			6
		);
		kdjData = computeKDJ(candleData);
		macdData = computeMACD(candleData);
		ema5Data = computeEMA(candleData, 5);
		ema50Data = computeEMA(candleData, 50);
		loadingRequest = false;
	}

	async function fetchDaily(code: string, etf: boolean) {
		const baseUrl = etf ? '/api/daily-etf' : '/api/daily';
		const resp = await fetch(`${baseUrl}?code=${code}`, {
			method: 'GET'
		});
		try {
			const body = await resp.json();
			if (body.data) {
				return body.data;
			}
		} catch (err) {
			console.log(err);
			return;
		}
	}

	$: if ($sModalData.open) {
		openDialog();
	}

	const submitTrackAction: SubmitFunction = (event) => {
		loadingTrackAction = true;

		event.formData.set('code', $sModalData.code);
		event.formData.set('name', $sModalData.name);

		return async ({ result }) => {
			// await update();
			switch (result.type) {
				case 'success':
					console.log(result.data);
					thisStockTracked = true;
					if (result.data) {
						$sTrackData = [...$sTrackData, result.data.data];
					} else {
						actionResult = 'Unexpected missing data but action successful.';
					}
					await applyAction(result);
					break;
				case 'failure':
					console.log(result.data);
					actionResult = result.data?.message;
					break;
				case 'error':
					console.log(result.error);
					actionResult = result.error?.message;
					break;
				default:
					console.log('Unexpected action result.');
					actionResult = 'Unexpected action result.';
			}
			loadingTrackAction = false;
		};
	};
</script>

<Dialog.Root open={$sModalData.open} onOpenChange={() => ($sModalData.open = false)}>
	<Dialog.Content
		class="h-[70vh] w-[95vw] lg:h-[80%] lg:max-w-[80%] auto-rows-auto overflow-y-auto"
	>
		<Dialog.Header>
			<Dialog.Title class="text-sm sm:text-xl">{$sModalData.code} {$sModalData.name}</Dialog.Title>
			<Dialog.Description class="text-xs sm:text-lg"
				>Latest close price with RSI indicator.</Dialog.Description
			>
			{#if $sModalData.trackable}
				<form method="POST" action="?/track" use:enhance={submitTrackAction} class="flex flex-col">
					<Button
						variant="ghost"
						class="bg-blue-600 text-white self-center h-6 w-20 sm:w-20 sm:h-8 sm:self-end md:mt-4"
						disabled={thisStockTracked}
					>
						{#if loadingTrackAction}
							<Loader2 class="animate-spin" />
						{/if}
						{#if thisStockTracked}
							Tracking
						{:else}
							Track
						{/if}
					</Button>
					{#if actionResult}
						<span class="text-red-500">{actionResult}</span>
					{/if}
				</form>
			{/if}
		</Dialog.Header>
		<div class="grid w-full h-full place-items-center">
			{#if loadingRequest}
				<Loader2 class="animate-spin w-32 h-32" style="animation-direction: reverse" />
			{:else}
				<ChartStock
					{candleData}
					lineRsiData={rsiData}
					lineDataK={kdjData.map((x) => ({ time: x.time, value: x.k }))}
					lineDataD={kdjData.map((x) => ({ time: x.time, value: x.d }))}
					lineDataJ={kdjData.map((x) => ({ time: x.time, value: x.j }))}
					lineDataMacdHist={macdData.map((x) => ({
						time: x.time,
						color: x.hist > 0 ? 'green' : 'red',
						value: x.hist
					}))}
					lineDataMacdDiff={macdData.map((x) => ({
						time: x.time,
						value: x.diff
					}))}
					lineDataMacdDea={macdData.map((x) => ({
						time: x.time,
						value: x.dea
					}))}
					lineDataEma5={ema5Data}
					lineDataEma50={ema50Data}
				/>
			{/if}
		</div>
		<!-- <div class="grid gap-4 py-4"> -->
		<!-- 	<div class="grid grid-cols-4 items-center gap-4"> -->
		<!-- 		<Label class="text-right">Name</Label> -->
		<!-- 		<Input id="name" value="Pedro Duarte" class="col-span-3" /> -->
		<!-- 	</div> -->
		<!-- 	<div class="grid grid-cols-4 items-center gap-4"> -->
		<!-- 		<Label class="text-right">Username</Label> -->
		<!-- 		<Input id="username" value="@peduarte" class="col-span-3" /> -->
		<!-- 	</div> -->
		<!-- </div> -->
		<!-- <Dialog.Footer> -->
		<!-- 	<Button type="submit">Save changes</Button> -->
		<!-- </Dialog.Footer> -->
	</Dialog.Content>
</Dialog.Root>
