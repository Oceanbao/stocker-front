<script lang="ts">
	import type { SubmitFunction } from '@sveltejs/kit';
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Loader2 } from 'lucide-svelte';

	export let form;

	let loading = false;

	const submitFunction: SubmitFunction = () => {
		loading = true;

		return async ({ update }) => {
			await update();
			loading = false;
		};
	};
</script>

<main class="h-full grid place-items-center">
	<Card.Root class="w-80">
		<form method="POST" action="?/login" use:enhance={submitFunction}>
			<Card.Header class="space-y-1">
				<Card.Title class="text-2xl">Login</Card.Title>
				<Card.Description>Enter your credentials below to login your account.</Card.Description>
			</Card.Header>
			<Card.Content class="grid gap-4">
				<div class="relative">
					<div class="absolute inset-0 flex items-center">
						<span class="w-full border-t" />
					</div>
				</div>
				<div class="grid gap-2">
					<Label for="username">Username</Label>
					<Input id="username" type="text" name="username" required />
				</div>
				<div class="grid gap-2">
					<Label for="password">Password</Label>
					<Input id="password" type="password" name="password" required />
				</div>

				{#if !loading && form?.invalid}
					<p class="error">Username and password is required.</p>
				{/if}

				{#if !loading && form?.credentials}
					<p class="error">You have entered the wrong credentials.</p>
				{/if}
			</Card.Content>
			<Card.Footer>
				<Button type="submit" class="w-full">
					{#if loading}
						<Loader2 class="animate-spin" />
					{:else}
						Login
					{/if}
				</Button>
			</Card.Footer>
		</form>
	</Card.Root>
</main>

<style>
	.error {
		color: red;
	}
</style>
