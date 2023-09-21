<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';

	export let data;

	let { records } = data;

	records = records.map((x) => ({ code: x.code, rsi: x.rsi }));
	records.sort((a, b) => (a.rsi > b.rsi ? 1 : b.rsi > a.rsi ? -1 : 0));
</script>

<main class="grid place-items-center my-12 mx-20">
	<div class="space-y-8 w-full">
		{#each records as record}
			<div class="flex items-center">
				<div class="ml-4 space-y-1">
					<p class="text-sm font-medium leading-none">Code: {record.code}</p>
					<p class="text-sm text-muted-foreground">RSI: {parseFloat(record.rsi).toFixed(4)}</p>
				</div>
				<div class="ml-auto font-medium">RSI: {parseFloat(record.rsi).toFixed(4)}</div>
			</div>
		{/each}
	</div>
</main>
