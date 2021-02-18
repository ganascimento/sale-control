<template>
	<div id="app">
		<transition name="slide" mode="out-in">
			<router-view/>
		</transition>
	</div>
</template>

<script>
	import '@/common/styles.css';
	export default {
		
	}
</script>

<style scoped>
	@keyframes slide-in {
		from { transform: translateY(-30px); opacity: 0; }
		to { transform: translateY(0px); opacity: 1; }
	}

	@keyframes slide-out {
		from { transform: translateY(0px); opacity: 1; }
		to { transform: translateY(-30px); opacity: 0; }
	}

	.slide-enter-active {
		animation: slide-in .2s ease;
	}
	.slide-leave-active {
		animation: slide-out .2s ease;
	}
</style>