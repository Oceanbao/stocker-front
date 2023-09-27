<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import * as Dialog from '$lib/components/ui/dialog';
	import ChartRsi from '$lib/components/ChartRSI.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Loader2 } from 'lucide-svelte';
	import { sModalData, sTrackData } from './store';

	let dailyCache: Map<string, Record<string, string>[]> = new Map();
	let candleData;
	let rsiData;
	let loadingRequest = true;
	let loadingTrackAction = false;
	let actionResult: string;
	let thisStockTracked: boolean | undefined;

	function RSI(data: { time: string; closing: number }[], period: number) {
		const closing = data.map((x) => x.closing);
		const pastAvgPeriod = period - 1;
		const rsi: number[] = [];
		const gains: number[] = [];
		const losses: number[] = [];
		let rsGain = 0;
		let rsLoss = 0;

		for (let idx = 0; idx <= closing.length; idx++) {
			if (idx === 0) {
				gains.push(0);
				losses.push(0);
				rsGain = 0;
				rsLoss = 0;
				continue;
			}
			const diff = closing[idx] - closing[idx - 1];
			if (diff > 0) {
				gains[idx] = diff;
				losses[idx] = 0;
			} else {
				gains[idx] = 0;
				losses[idx] = -diff;
			}
			rsGain = (rsGain * pastAvgPeriod + gains[idx]) / period;
			rsLoss = (rsLoss * pastAvgPeriod + losses[idx]) / period;
			if (rsGain === 0 || rsLoss === 0) {
				rsi[idx] = 0;
				continue;
			}
			const rs = rsGain / rsLoss;
			rsi[idx] = (rs / (1 + rs)) * 100;
		}

		const result = data.map((x, idx) => ({
			time: x.time,
			value: rsi[idx]
		}));

		return result;
	}

	async function openDialog() {
		loadingRequest = true;
		thisStockTracked = $sTrackData.some((x) => x.code === $sModalData.code);

		let dataStored = dailyCache.get($sModalData.code);
		if (!dataStored) {
			dataStored = await fetchDaily($sModalData.code);
			if (!dataStored) {
				console.log('ERROR: failed to fetch `daily` data');
				loadingRequest = false;
				return;
			}
			dailyCache.set($sModalData.code, dataStored);
		}

		candleData = dataStored?.map((x) => ({
			time: x.date.slice(0, 10),
			open: x.open,
			high: x.high,
			low: x.low,
			close: x.close
		}));
		rsiData = RSI(
			candleData.map((x) => ({ time: x.time, closing: parseFloat(x.close) })),
			6
		);
		loadingRequest = false;
	}

	async function fetchDaily(code: string) {
		const resp = await fetch(`/api/daily?code=${code}`, {
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
	<Dialog.Content class="h-[70vh] w-[95vw] lg:h-[80%] lg:max-w-[80%] auto-rows-auto">
		<Dialog.Header>
			<Dialog.Title>{$sModalData.code} {$sModalData.name}</Dialog.Title>
			<Dialog.Description>Latest close price with RSI indicator.</Dialog.Description>
			{#if $sModalData.trackable}
				<form method="POST" action="?/track" use:enhance={submitTrackAction} class="flex flex-col">
					<Button
						variant="ghost"
						class="bg-blue-600 text-white self-center sm:self-end mt-4"
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
				<ChartRsi {candleData} {rsiData} />
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
