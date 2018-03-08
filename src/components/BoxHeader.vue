<template>
	<div class="box-header">
		<div class="online-count">
			<span @click="switchUser">当前在线人数:{{onlineCount}}(点击查看/隐藏)</span>
			<div v-show="showUser">
				<span v-for="(user,index) in onlineUser">
					{{user.username}}
				</span>
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">
	export default {
		data(){
			return {
				showUser:false
			}
		},
		props:['onlineCount','onlineUser'],
		methods:{
			switchUser:function(){
				this.showUser = !this.showUser
			}
		}
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