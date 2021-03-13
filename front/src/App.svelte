<script lang="ts">
	import Log from "./Log.svelte";
	import MsgInput from "./MsgInput.svelte";
	import { chatlog$ } from "./store.js";
</script>

<div class="container">
	<div class="userlist">
		<div>
			<div>Fulano</div>
			<div>Cicrano</div>
			<div>Beltrano</div>
		</div>
	</div>

	<div class="chat-log">
		<div>
			{#each $chatlog$ as msg, i}
				<Log {...msg} />
			{/each}
		</div>
	</div>

	<div class="msginput">
		<MsgInput />
	</div>
</div>

<style>
	.container {
		color: #e4e4e4;
		background: var(--bg);
		padding: 3rem 0;
		height: 100%;
		display: grid;
		grid-template-rows: 1fr auto;
		grid-template-columns: 200px 750px;
		grid-template-areas:
			"userlist chat-log"
			"userlist msginput";
		gap: 0.5rem;
		justify-content: center;
	}
	.container > div {
		padding: 1rem;
		background: var(--fg);
	}
	.userlist {
		grid-area: userlist;
	}
	.chat-log {
		grid-area: chat-log;
		text-align: justify;
		align-items: end;
		display: grid;
	}
	.msginput {
		grid-area: msginput;
	}
	.userlist,
	.chat-log {
		word-wrap: break-word;
		overflow-y: auto;
	}
	@media screen and (max-width: 1000px) {
		.container {
			grid-template-rows: 1fr auto;
			grid-template-columns: 1fr;
			grid-template-areas:
				"chat-log"
				"msginput";
		}
		.userlist {
			display: none;
		}
	}
</style>
