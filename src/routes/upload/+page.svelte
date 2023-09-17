<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	export let data;
	export let form;
</script>

{#if data.stocks}
	<div>
		<hr />
		<p>TOTAL: {JSON.stringify(data.stocks.records.totalItems)}</p>
	</div>
{/if}

<form method="POST">
	<Label for="start">Start</Label>
	<Input id="start" type="number" name="start" required />
	{#if form?.invalid}
		<p>INVALID input</p>
	{/if}
	<Button type="submit">Submit</Button>
	<p>Result: {form?.result}</p>
</form>
