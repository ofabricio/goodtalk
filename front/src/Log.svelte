<script lang="ts">
	export let who: string;
	export let txt: string;
	export let date: Date;
</script>

<div class="container">
	<div class="who">{who}</div>
	<div class="date">{date.toLocaleString("en-US")}</div>
	<div class="txt">{txt}</div>
</div>

<style>
	.container {
		margin-bottom: 1rem;
		display: grid;
		grid-template-rows: 1fr auto;
		grid-template-columns: 1fr auto;
		grid-template-areas:
			"who date"
			"txt txt";
	}
	.who {
		grid-area: who;
		font-weight: 100;
		color: var(--accent);
	}
	.txt {
		grid-area: txt;
		font-weight: 100;
	}
	.date {
		color: var(--fg);
		grid-area: date;
		font-size: 0.5em;
		font-family: Verdana, Geneva, Tahoma, sans-serif;
	}
</style>
