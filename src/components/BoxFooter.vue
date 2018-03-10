<template>
	<div class="box-footer">
		<div class="chat-send">
			<input v-model="text" v-bind:focus="focus" v-on:keyup.enter="sendText" type="text">
			<form ref="imageForm">
				<input ref="image" @change="sendImage" name="image" accept="image/*" type="file" style="display: none">
			</form>
			<div @click="choiceImage" style="font-size:45px" class="fa fa-file-photo-o"></div>
			<mt-button type="primary" @click="sendText" :disabled="trim(text)==''?true:false">发送</mt-button>
		</div>
	</div>
</template>
<script type="text/javascript">
	import { sendText } from '@/api/sendText'
	import { sendImage } from '@/api/sendImage'
	export default {
		data() {
			return {
				text:'',
				image:'',
				focus:true
			}
		},
		props:['messageIndex'],
		methods:{
			choiceImage:function(){
				const image = this.$refs.image
				image.click();
			},
			sendText:function(){
				if(this.trim(this.text) == ''){
					return
				}
            	const userinfo = JSON.parse(localStorage.getItem('userinfo'))
        		// const pushData = {type:'text',nickname:userinfo.username,content:this.text,avatar:userinfo.avatar,isMine:1,status:'sending'}
        		const pushData = {type:'text',nickname:userinfo.username,content:this.text,avatar:userinfo.avatar,isMine:1,status:''}
        		this.$emit('pushItem',pushData)
        		const text = this.text
        		this.text = ''
        		const messageIndex = this.messageIndex
            	sendText(text).then(res => {
            		//this.$emit('updateStatus',{messageIndex:messageIndex,status:'success'})
                }).catch(error => {
                	//this.$emit('updateStatus',{messageIndex:messageIndex,status:'error'})
                })
				
            },
            sendImage:function(e){
            	const formdata = new FormData();
			    formdata.append('image',event.target.files[0]);
			    sendImage(formdata).then(res => {
			    	const userinfo = JSON.parse(localStorage.getItem('userinfo'))
        			const pushData = {type:'image',nickname:userinfo.username,content:res.data.imageUrl,avatar:userinfo.avatar,isMine:1,status:'sending'}
        			this.$emit('pushItem',pushData)
			    	this.$refs.imageForm.reset()
			    	this.$emit('updateStatus',{messageIndex:this.messageIndex,status:'success'})
			    }).catch(error => {
			    	Toast({message: '图片上传失败',icon: 'error'})
			    	this.$refs.imageForm.reset()
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