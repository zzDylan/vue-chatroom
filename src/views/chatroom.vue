<template>
	<div style="height:100%">
		<div class="box-header">
			<div class="online-count">当前在线人数{{onlineCount}}</div>
		</div>
		<div ref="box" class="box">
			<div v-for="(item,index) in items">
				<div v-if="item.type=='message'" :class="['chat-box',item.isMine?'chat-mine':'']">
					<img class="avatar" :src="item.avatar">
					<div class="chat-item">
						<div class="chat-nickname">{{item.nickname}}</div>
						<div class="chat-content">
							<div class="chat-triangle"></div>
							<div class="chat-text">{{item.content}}</div>
							<div v-if="item.isMine" class="icon-div">
								<span v-if="item.status=='sending'" class="fa fa-circle-o-notch fa-spin"></span>
								<span v-if="item.status=='error'" class="fa fa-exclamation-circle"></span>
								<span v-if="item.status=='success'"></span>
							</div>
							
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
				<input v-model="message" v-bind:focus="focus" v-on:keyup.enter="sendMessage" type="text">
				<mt-button type="primary" @click="sendMessage" :disabled="trim(message)==''?true:false">发送</mt-button>
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
				items:[],
				onlineCount:0,
				focus:true,
				wsServer:'ws://111.231.118.189:8282'
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
		},
		methods: {
                onmessage:function(e){
                	// json数据转换成js对象
                    const data = eval("(" + e.data + ")");
                    //console.log(data);
                    const type = data.type || '';
                    switch (type) {
                        case 'bind':
                            bind(data.client_id).then(res => {
                            	//console.log(res.data)
                            	localStorage.setItem('userinfo',JSON.stringify(res.data.userinfo))
                            })
                            break;
                        case 'inform':
                        	this.items.push(data)
                            break;
                        case 'message':
                        	this.items.push(data)
                            break;
                        case 'updateOnlineCount':
                            this.onlineCount = data.onlineCount
                            break;
                        default :
                            //console.log(e.data);
                    }
                },
                disConnect:function () {
                	this.items.push({type:'inform',content:'连接已经断开'})
                    console.log('连接已经断开...')
                    const that = this
                    setTimeout(function () {
                        that.reconnect()
                    }, 2000)
                },
                reconnect:function() {
                    this.items.push({type:'inform',content:'重新连接中'})
                    console.log('重新连接中')
                    this.ws = new WebSocket(this.wsServer)
                    this.ws.onmessage = this.onmessage
                    this.ws.onclose = this.disConnect
                },
                sendMessage:function(){
                	if(this.trim(this.message) == ''){
                		return
                	}
                	const userinfo = JSON.parse(localStorage.getItem('userinfo'))
            		const pushData = {type:'message',nickname:userinfo.username,content:this.message,avatar:userinfo.avatar,isMine:1,status:'sending'}
                	this.items.push(pushData)
                	const messageIndex = this.items.length - 1
                	const message = this.message
                	this.message = ''
                	this.focus = true
                	sendMessage(message).then(res => {
                		this.items[messageIndex]['status'] = 'success'
                    }).catch(error => {
                    	this.items[messageIndex]['status'] = 'error'
                    })
                },
                scrollToBottom: function (){
                	this.$nextTick(() => {
						const box = this.$refs.box
						box.scrollTop = box.scrollHeight
					})
                },
                //去左右空格;
				trim:function(string){
				    return string.replace(/(^\s*)|(\s*$)/g, "")
				}

		},
		created() {
			this.ws = new WebSocket(this.wsServer)
			this.ws.onmessage = this.onmessage
			this.ws.onclose = this.disConnect
		},
		watch: {
			'items': 'scrollToBottom'
		}
	}
</script>
<style type="text/css">
	.online-count{
		text-align: center;
		color:#3c763d;
	}
	.box-header{
		position:fixed; 
		top:0;
		width:100%;
		background-color: #eee
	}
	.box{
		padding: 20px;
		margin-bottom: 50px;
		height: 100%;
		overflow:scroll;
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
		margin-left: 50%
	}
	.chat-item{
		/*margin-left: 10px*/
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
	.icon-div{
		padding-top: 10%;
		padding-right: 10%;
	}
	.fa-circle-o-notch{
		color: #999
	}
	.fa-exclamation-circle{
		color: red
	}
</style>