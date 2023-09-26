<script lang="ts">
	import { onMount } from 'svelte';

	import { cn } from '$lib/utils';
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';

	import DashboardMainNav from './MainNav.svelte';
	import Search from './Search.svelte';
	import UserNav from './UserNav.svelte';
	import Rsi from './Rsi.svelte';
	import ModalChart from './ModalChart.svelte';
	import { sTrackData, sModalData } from './store';
	import SkeletonA from '$lib/components/SkeletonA.svelte';

	export let data;

	let dataReady = false;
	let numTrackedData = 0;

	onMount(async () => {
		console.log('OnMount: processing server sent promise.');
		const result = await data.records?.track;
		for (const d of result) {
			$sTrackData.push({ tracked: true, ...d });
			numTrackedData += 1;
		}
		dataReady = true;
	});

	function openDialog(code: string, name: string) {
		$sModalData.code = code;
		$sModalData.name = name;
		$sModalData.open = true;
		$sModalData.trackable = false;
	}

	function untrack(code: string) {
		const found = $sTrackData.findIndex((x) => x.code === code);
		if (found !== -1) {
			$sTrackData[found].tracked = false;
			numTrackedData -= 1;
		}
		console.log($sTrackData);
	}
</script>

<ModalChart />

<main>
	<div class="flex-col md:flex">
		<div class="border-b">
			<div class="flex h-16 items-center px-4">
				<DashboardMainNav class="mx-6" />
				<div class="ml-auto flex items-center space-x-4">
					<Search />
					<UserNav username={data.user?.name} useremail={data.user?.email} />
				</div>
			</div>
		</div>
		<div class="flex-1 space-y-4 p-8 pt-6">
			<div class="flex items-center justify-between space-y-2">
				<h2 class="text-3xl font-bold tracking-tight">Dashboard</h2>
			</div>
			<Tabs.Root value="tracking" class="space-y-4">
				<Tabs.List class="overflow-x-auto w-full justify-start">
					<Tabs.Trigger value="tracking">Tracking</Tabs.Trigger>
					<Tabs.Trigger value="rsi">RSI</Tabs.Trigger>
					<Tabs.Trigger value="reports" disabled>Reports</Tabs.Trigger>
					<Tabs.Trigger value="notifications" disabled>Notifications</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value="tracking" class="space-y-4">
					<div />
					<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						{#if dataReady}
							{#if !numTrackedData}
								<Card.Root>
									<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
										<Card.Title class="text-lg font-medium">No tracked stock available.</Card.Title>
									</Card.Header>
									<Card.Content>
										<p class="text-xs text-muted-foreground text-left">
											Track stock by toggle on chart.
										</p>
									</Card.Content>
								</Card.Root>
							{/if}
							{#each $sTrackData as d, index (d.code)}
								{#if d.tracked}
									<Card.Root>
										<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
											<Card.Title class="text-lg font-medium">
												<Button variant="secondary" on:click={() => openDialog(d.code, d.name)}>
													{d.code}
													{d.name}
												</Button>
											</Card.Title>
											<Button class="h-6 bg-blue-400" on:click={() => untrack(d.code)}
												>Untrack</Button
											>
										</Card.Header>
										<Card.Content class="flex flex-col items-end gap-2">
											<Badge
												variant="outline"
												class={cn(
													'text-2xl',
													'font-semibold',
													d.change > 0 ? 'bg-green-700' : 'bg-red-700'
												)}
											>
												{(d.change * 100).toFixed(3)}%
											</Badge>
											<p class="text-sm text-muted-foreground">{d.days} days</p>
										</Card.Content>
									</Card.Root>
								{/if}
							{/each}
						{:else}
							<SkeletonA num={3} />
						{/if}
					</div>
					<!-- <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7"> -->
					<!-- 	<Card.Root class="lg:col-span-4"> -->
					<!-- 		<Card.Header> -->
					<!-- 			<Card.Title>Graph</Card.Title> -->
					<!-- 			<Card.Description>Some business graph.</Card.Description> -->
					<!-- 		</Card.Header> -->
					<!-- 		<Card.Content class="w-full h-full"> -->
					<!-- 			<p>CONTENT</p> -->
					<!-- 		</Card.Content> -->
					<!-- 	</Card.Root> -->
					<!-- 	<Card.Root class="lg:col-span-3"> -->
					<!-- 		<Card.Header> -->
					<!-- 			<Card.Title>Recent Sales</Card.Title> -->
					<!-- 			<Card.Description>You made 265 sales this month.</Card.Description> -->
					<!-- 		</Card.Header> -->
					<!-- 		<Card.Content> -->
					<!-- 			<p>CONTENT</p> -->
					<!-- 		</Card.Content> -->
					<!-- 	</Card.Root> -->
					<!-- </div> -->
				</Tabs.Content>
				<Tabs.Content value="rsi" class="space-y-4">
					{#await data.records?.alert}
						<div class="grid">
							<SkeletonA num={3} />
						</div>
					{:then value}
						<Rsi records={value} />
					{/await}
				</Tabs.Content>
			</Tabs.Root>
		</div>
	</div>
</main>

<style>
</style>
