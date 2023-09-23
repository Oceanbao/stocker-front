<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as Dialog from '$lib/components/ui/dialog';
	import ChartRsi from '$lib/components/ChartRSI.svelte';
	import { Shell } from 'lucide-svelte';

	export let data;

	let { records } = data;

	records = records.map((x) => ({ code: x.code, rsi: x.rsi, name: x.name, cap: x.cap }));
	records.sort((a, b) => (a.cap > b.cap ? -1 : b.cap > a.cap ? 1 : 0));

	let candleData;
	let rsiData;
	let dailyCache: Map<string, Record<string, string>[]> = new Map();

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

	let dialogOpened = false;
	let codeName: string;

	async function openDialog(open: boolean | undefined, data: { code: string; name: string }) {
		const { code, name } = data;
		dialogOpened = true;
		codeName = `${code}-${name}`;

		if (open) {
			let dataStored = dailyCache.get(code);
			if (!dataStored) {
				loadingRequest = true;
				dataStored = await fetchDaily(code);
				if (!dataStored) {
					return;
				}
				dailyCache.set(code, dataStored);
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
		} else {
			dialogOpened = false;
		}
	}

	let loadingRequest = false;

	async function fetchDaily(code: string) {
		const resp = await fetch(`/api/daily?code=${code}`, {
			method: 'GET'
		});
		try {
			const body = await resp.json();
			if (body.records) {
				return body.records;
			}
		} catch (err) {
			console.log(err);
			return null;
		}
	}
</script>

<!-- <Dialog.Root open={dialogOpen} closeOnOutsideClick={false} closeOnEscape={false} onOpenChange={(open) => { if(open === false) { selectedAccount = undefined; dialogOpen = false } else if(open === true) { dialogOpen = true } } }>  -->
<Dialog.Root open={dialogOpened} onOpenChange={(open) => openDialog(open, { code: '', name: '' })}>
	<Dialog.Content class="w-full h-[80%] max-w-[80%]">
		<Dialog.Header>
			<Dialog.Title>{codeName}</Dialog.Title>
			<Dialog.Description>Time series for company selected.</Dialog.Description>
		</Dialog.Header>
		<div class="grid w-full h-full place-items-center">
			{#if loadingRequest}
				<Shell class="animate-spin w-48 h-48" style="animation-direction: reverse" />
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

<main class="grid place-items-center lg:max-w-3xl lg:mx-auto">
	<p>Total: {records.length}</p>
	<Table.Root>
		<Table.Caption>Today's Lead Stocks</Table.Caption>
		<Table.Header>
			<Table.Row>
				<Table.Head class="w-[100px]">CodeName</Table.Head>
				<Table.Head class="text-right">Cap</Table.Head>
				<Table.Head class="text-right">RSI</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each records as record, i (i)}
				<Table.Row>
					<button
						class="cursor-pointer"
						on:click={() => openDialog(true, { code: record.code, name: record.name })}
					>
						<Table.Cell class="font-medium">{record.code} {record.name}</Table.Cell>
					</button>
					<Table.Cell class="text-right"
						>{(parseFloat(record.cap) / 1_000_000_000.0).toFixed(4)}</Table.Cell
					>
					<Table.Cell class="text-right">{parseFloat(record.rsi).toFixed(4)}</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</main>
