<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';
	import { sModalData } from './store';

	export let records;

	records = records.map((x) => ({ code: x.code, rsi: x.rsi, name: x.name, cap: x.cap }));
	records.sort((a, b) => (a.cap > b.cap ? -1 : b.cap > a.cap ? 1 : 0));

	function openDialog(code: string, name: string) {
		$sModalData.code = code;
		$sModalData.name = name;
		$sModalData.open = true;
		$sModalData.trackable = true;
	}
</script>

<div class="grid place-items-center lg:max-w-3xl lg:mx-auto">
	<p>Total: {records.length}</p>
	<Table.Root>
		<Table.Caption>Today's Lead Stocks</Table.Caption>
		<Table.Header>
			<Table.Row>
				<Table.Head class="text-center">CodeName</Table.Head>
				<Table.Head class="text-center">Cap</Table.Head>
				<Table.Head class="text-center">RSI</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each records as record, i (record.code)}
				<Table.Row>
					<!-- <Button -->
					<!-- 	variant="secondary" -->
					<!-- 	on:click={() => openDialog(true, { code: record.code, name: record.name })} -->
					<!-- > -->
					<!-- 	<Table.Cell class="font-medium">{record.code} {record.name}</Table.Cell> -->
					<!-- </Button> -->
					<Table.Cell class="font-medium">
						<Button
							variant="secondary"
							class="w-[100px]"
							on:click={() => openDialog(record.code, record.name)}
						>
							{record.name}
						</Button>
					</Table.Cell>
					<Table.Cell class="text-right"
						>{(parseFloat(record.cap) / 1_000_000_000.0).toFixed(4)}</Table.Cell
					>
					<Table.Cell class="text-right">{parseFloat(record.rsi).toFixed(4)}</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
