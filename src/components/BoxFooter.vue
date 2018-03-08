<template>
	<div class="box-footer">
		<div class="chat-send">
			<input v-model="message" v-bind:focus="focus" v-on:keyup.enter="sendMessage" type="text">
			<mt-button type="primary" @click="sendMessage" :disabled="trim(message)==''?true:false">发送</mt-button>
		</div>
	</div>
</template>
<script type="text/javascript">
	import { sendMessage } from '@/api/sendMessage'
	export default {
		data() {
			return {
				message:'',
				focus:true
			}
		},
		props:['messageIndex'],
		methods:{
			sendMessage:function(){
				if(this.trim(this.message) == ''){
					return
				}
            	const userinfo = JSON.parse(localStorage.getItem('userinfo'))
        		const pushData = {type:'message',nickname:userinfo.username,content:this.message,avatar:userinfo.avatar,isMine:1,status:'sending'}
        		this.$emit('pushItem',pushData)
        		const message = this.message
        		this.message = ''
            	sendMessage(message).then(res => {
            		this.$emit('updateStatus',{messageIndex:this.messageIndex,status:'success'})
                }).catch(error => {
                	this.$emit('updateStatus',{messageIndex:this.messageIndex,status:'error'})
                })
            },
			//去左右空格;
			trim:function(string){
			    return string.replace(/(^\s*)|(\s*$)/g, "")
			}
		},
		directives: {
    		focus: {
			    inserted: function (el, {value}) {
				    console.log(el,{value})
				    if (value) {
				        el.focus();
				    }
			    }
			 }
		}
	}
</script>
<style type="text/css">
	.box-footer{
		position:fixed; 
		bottom:0;
		width:100%;
		right: 10px;
		background-color: #eee
	}
	.chat-send{
		display: flex;
	}
	.chat-send input {
	    -webkit-box-flex: 1;
	    -webkit-flex: 1;
	    flex: 1;
	    height: 40px;
	    padding-left: 5px;
	    border: 0;
	    background-color: #fff;
	    border-radius: 3px;
	    line-height: normal;
	    margin-left:20px;
	}
</style>