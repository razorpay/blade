<script>
	export let label = 'Button';
	export let onClick;
</script>

<button on:click={onClick}>
	<slot>{label}</slot>
</button>
