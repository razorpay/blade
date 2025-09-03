<script>
	export let label = 'Button';
	export let onClick;
</script>

<style>
	@import './Button.css';
</style>

<button on:click={onClick}>
	<slot>{label}</slot>
</button>


