<script lang="ts">
	import { sendMsg } from "./store.js";

	function send(event) {
		let mobileEnter = false;
		if (event.keyCode && event.keyCode == 13) {
			mobileEnter = true;
		}
		const enter =
			event.code == "Enter" || event.code == "NumpadEnter" || mobileEnter;
		if (!event.shiftKey && enter) {
			sendMsg(event.target.value);

			event.target.value = "";
			if (event.preventDefault) {
				event.preventDefault();
			}
		}
	}
</script>

<div class="container">
	<textarea rows="2" placeholder="Type... <enter>" on:keypress={send} />
</div>

<style>
	.container {
		width: 100%;
	}
	textarea {
		padding: 0.5rem;
		width: inherit;
		color: var(--text);
		background: var(--fg);
		font-size: 1.1em;
	}
	textarea:focus {
		outline: solid 2px var(--accent);
	}
</style>
