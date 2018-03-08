<template>
	<div class="box-header">
		<div class="online-count">当前在线人数{{onlineCount}}</div>
	</div>
</template>

<script type="text/javascript">
	export default {
		props:['onlineCount']
	}
</script>

<style type="text/css">
	.box-header{
		position:fixed; 
		top:0;
		width:100%;
		background-color: #eee
	}
</style>