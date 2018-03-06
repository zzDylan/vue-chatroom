<template>
	<div>
		<div ref="box" id="box" class="box">
			<div v-for="(item,index) in items">
				<div v-if="item.type=='message'" :class="['chat-box',item.isMine?'chat-mine':'']">
					<img class="avatar" :src="item.avatar">
					<div class="chat-item">
						<div class="chat-nickname">{{item.nickname}}</div>
						<div class="chat-content">
							<div class="chat-triangle"></div>
							<div class="chat-text">{{item.content}}</div>
						</div>
					</div>
				</div>

				<div v-if="item.type=='inform'">
					<div class="inform">
						{{ item.content }}
					</div>
				</div>
			</div>
		</div>
		<div class="box-footer">
			<div class="chat-send">
				<input v-model="message" type="text">
				<button @click="sendMessage" class="send-button">发送</button>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
	import { bind } from '@/api/bind'
	import { sendMessage } from '@/api/sendMessage'
	export default {
		data() {
			return {
				ws:null,
				message:'',
				items:[
					{type:'message',nickname:'网名',content:'测试内容',avatar:require('@/assets/avatar-girl.jpg'),isMine:0},
					{type:'message',nickname:'网名',content:'测试内容',avatar:require('@/assets/avatar-girl.jpg'),isMine:0},
					{type:'message',nickname:'网名',content:'测试内容',avatar:require('@/assets/avatar-girl.jpg'),isMine:0},
					{type:'message',nickname:'网名',content:'测试内容',avatar:require('@/assets/avatar-girl.jpg'),isMine:0},
					{type:'message',nickname:'网名',content:'测试内容',avatar:require('@/assets/avatar-girl.jpg'),isMine:0},
					{type:'message',nickname:'网名',content:'测试内容',avatar:require('@/assets/avatar-boy.jpg'),isMine:1},
					{type:'message',nickname:'网名',content:'测试内容',avatar:require('@/assets/avatar-boy.jpg'),isMine:1},
					{type:'message',nickname:'网名',content:'测试内容',avatar:require('@/assets/avatar-boy.jpg'),isMine:1},
					{type:'message',nickname:'网名',content:'测试内容',avatar:require('@/assets/avatar-boy.jpg'),isMine:1},
					{type:'message',nickname:'网名',content:'测试内容',avatar:require('@/assets/avatar-boy.jpg'),isMine:1},
					{type:'message',nickname:'网名',content:'测试内容',avatar:require('@/assets/avatar-boy.jpg'),isMine:1},
					{type:'message',nickname:'网名',content:'测试内容',avatar:require('@/assets/avatar-boy.jpg'),isMine:1},
					{type:'message',nickname:'网名',content:'测试内容',avatar:require('@/assets/avatar-boy.jpg'),isMine:1},
					{type:'message',nickname:'网名',content:'测试内容',avatar:require('@/assets/avatar-boy.jpg'),isMine:1},
					{type:'message',nickname:'网名',content:'测试内容',avatar:require('@/assets/avatar-boy.jpg'),isMine:1},
					{type:'message',nickname:'网名',content:'测试内容',avatar:require('@/assets/avatar-boy.jpg'),isMine:1},
					{type:'message',nickname:'网名',content:'测试内容',avatar:require('@/assets/avatar-girl.jpg'),isMine:0},
					{type:'message',nickname:'网名',content:'测试内容',avatar:require('@/assets/avatar-girl.jpg'),isMine:0},
					{type:'message',nickname:'网名',content:'测试内容',avatar:require('@/assets/avatar-girl.jpg'),isMine:0}
				]
			}
		},
		methods: {
                scrollToBottom:function() {
                    //const box = document.getElementById('box');
                    const box = this.$refs.box
                    box.scrollTop = box.scrollHeight
                },
                onmessage:function(e){
                	// json数据转换成js对象
                    const data = eval("(" + e.data + ")");
                    console.log(data);
                    const type = data.type || '';
                    switch (type) {
                        case 'bind':
                            bind(data.client_id).then(res => {
                            	console.log(res.data)
                            })
                            break;
                        case 'inform':
                        	this.items.push(data)
                            break;
                        case 'message':
                        	this.items.push(data)
                            break;
                        default :
                            console.log(e.data);
                    }
                },
                sendMessage:function(){
                	sendMessage(this.message).then(res => {
                		const pushData = {type:'message',nickname:'自己',content:this.message,avatar:require('@/assets/avatar-boy.jpg'),isMine:0}
                    	this.items.push(pushData)
                    	this.message = ''
                    })
                }
		},
		created() {
			const wsServer = 'ws://111.231.118.189:8282'
			this.ws = new WebSocket(wsServer)
			this.ws.onmessage = this.onmessage
		},
		mounted() {
			this.scrollToBottom()
		}
	}
</script>
<style type="text/css">
	.box{
		padding: 20px;
		margin-bottom: 50px
	}
	.chat-box{
		display: flex;
		margin: 20px 0;
	}
	.avatar{
		border-radius: 100%;
		width:40px;
		height: 40px;
	}
	.chat-nickname{
		margin-left: 10px
	}
	.chat-item{
		margin-left: 10px
	}
	.chat-content{
		display:flex;
	}
	.chat-text{
		min-height: 22px;
		padding: 8px 15px;
		background-color: #fff;
		border-radius: 3px;
		color:#333;
	}
	.chat-triangle{
		width:0;
		height: 0;
		border-width: 5px 5px;
		border-style:solid;
		border-color: #fff #fff transparent transparent;
		margin-top: 5px
	}
	.chat-box.chat-mine{
		flex-direction:row-reverse;
	}
	.chat-box.chat-mine .chat-content{
		flex-direction:row-reverse;
	}
	.chat-box.chat-mine .chat-content .chat-triangle{
		width:0;
		height: 0;
		border-width: 5px 5px;
		border-style:solid;
		border-color: #fff transparent transparent #fff;
		margin-top: 5px
	}
	.box-footer{
		position:fixed; 
		bottom:0;
		width:100%;
		right: 10px;
		background-color: #eee
	}
	.send-button{
		border-radius: 3px;
	    height: 40px;
	    padding: 0 20px;
	    border: 0;
	    margin-left: 10px;
	    background-color: #5FB878;
	    color: #fff;
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
	.inform{
		text-align: center;
		color:red;
	}
</style>