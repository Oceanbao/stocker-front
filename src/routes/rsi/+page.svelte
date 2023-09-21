<script lang="ts">
	export let data;

	let { records } = data;

	records = records.map((x) => ({ code: x.code, rsi: x.rsi, name: x.name, cap: x.cap }));
	// records.sort((a, b) => (a.rsi > b.rsi ? 1 : b.rsi > a.rsi ? -1 : 0));
	records.sort((a, b) => (a.cap > b.cap ? -1 : b.cap > a.cap ? 1 : 0));
</script>

<main class="grid place-items-center my-12 mx-20">
	<p>Total: {records.length}</p>
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
