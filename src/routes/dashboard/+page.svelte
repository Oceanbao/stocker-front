<script lang="ts">
	import { onMount } from 'svelte';

	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';

	import { Activity, CreditCard, DollarSign, Download, Users } from 'lucide-svelte';

	import DashboardMainNav from './MainNav.svelte';
	import Search from './Search.svelte';
	import UserNav from './UserNav.svelte';
	import RecentSales from './RecentSales.svelte';
	import { createChart, type IChartApi } from 'lightweight-charts';
	import { generateCandlestickData, getRaw } from '$lib/genData';

	export let data;
	let chartElement: HTMLDivElement;
	let chart: IChartApi;

	onMount(() => {
		chart = createChart(chartElement);
		// const data = generateCandlestickData();
		const data = getRaw();
		const mainSeries = chart.addCandlestickSeries();
		mainSeries.setData(data);
		// chart.timeScale().fitContent();
	});
</script>

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
				<div class="flex items-center space-x-2">
					<Button size="sm">
						<Download class="mr-2 h-4 w-4" />
						Download
					</Button>
				</div>
			</div>
			<Tabs.Root value="overview" class="space-y-4">
				<Tabs.List>
					<Tabs.Trigger value="overview">Overview</Tabs.Trigger>
					<Tabs.Trigger value="analytics" disabled>Analytics</Tabs.Trigger>
					<Tabs.Trigger value="reports" disabled>Reports</Tabs.Trigger>
					<Tabs.Trigger value="notifications" disabled>Notifications</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value="overview" class="space-y-4">
					<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						<Card.Root>
							<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
								<Card.Title class="text-sm font-medium">Total Revenue</Card.Title>
								<DollarSign class="h-4 w-4 text-muted-foreground" />
							</Card.Header>
							<Card.Content>
								<div class="text-2xl font-bold">$45,231.89</div>
								<p class="text-xs text-muted-foreground">+20.1% from last month</p>
							</Card.Content>
						</Card.Root>
						<Card.Root>
							<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
								<Card.Title class="text-sm font-medium">Subscriptions</Card.Title>
								<Users class="h-4 w-4 text-muted-foreground" />
							</Card.Header>
							<Card.Content>
								<div class="text-2xl font-bold">+2350</div>
								<p class="text-xs text-muted-foreground">+180.1% from last month</p>
							</Card.Content>
						</Card.Root>
						<Card.Root>
							<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
								<Card.Title class="text-sm font-medium">Sales</Card.Title>
								<CreditCard class="h-4 w-4 text-muted-foreground" />
							</Card.Header>
							<Card.Content>
								<div class="text-2xl font-bold">+12,234</div>
								<p class="text-xs text-muted-foreground">+19% from last month</p>
							</Card.Content>
						</Card.Root>
						<Card.Root>
							<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
								<Card.Title class="text-sm font-medium">Active Now</Card.Title>
								<Activity class="h-4 w-4 text-muted-foreground" />
							</Card.Header>
							<Card.Content>
								<div class="text-2xl font-bold">+573</div>
								<p class="text-xs text-muted-foreground">+201 since last hour</p>
							</Card.Content>
						</Card.Root>
					</div>
					<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
						<Card.Root class="col-span-4">
							<Card.Header>
								<Card.Title>Graph</Card.Title>
							</Card.Header>
							<Card.Content class="w-full h-full">
								<div id="chart-container" bind:this={chartElement} class="h-full w-full" />
							</Card.Content>
						</Card.Root>
						<Card.Root class="col-span-3">
							<Card.Header>
								<Card.Title>Recent Sales</Card.Title>
								<Card.Description>You made 265 sales this month.</Card.Description>
							</Card.Header>
							<Card.Content>
								<RecentSales />
							</Card.Content>
						</Card.Root>
					</div>
				</Tabs.Content>
			</Tabs.Root>
		</div>
	</div>
</main>

<style>
</style>