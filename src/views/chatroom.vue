<template>
	<div style="height:100%">
		<box-header :online-count="onlineCount" :online-user="onlineUser"></box-header>
		<div ref="box" class="box">
			<div v-for="(item,index) in items">
				<div v-if="item.type=='text'" :class="['chat-box',item.isMine?'chat-mine':'']">
					<img class="avatar" :src="item.avatar">
					<div class="chat-item">
						<div :class="[item.isMine?'chat-nickname-right':'chat-nickname-left']">{{item.nickname}}</div>
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
		<box-footer @updateStatus="updateStatus" @pushItem="pushItem" :message-index="messageIndex"></box-footer>
	</div>
</template>
<script type="text/javascript">
	import BoxHeader from '@/components/BoxHeader'
	import BoxFooter from '@/components/BoxFooter'
	import { bind } from '@/api/bind'
	export default {
		data() {
			return {
				ws:null,
				items:[],
				onlineCount:0,
				onlineUser:[],
				focus:true,
				wsServer:'ws://111.231.118.189:8282'
			}
		},
		components:{ BoxHeader,BoxFooter },
		methods: {
				pushItem:function(item){
					this.items.push(item)
				},
				updateStatus:function(data){
                	this.items[data.messageIndex].status = data.status
				},
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
                        case 'text':
                        	this.items.push(data)
                            break;
                        case 'updateOnline':
                            this.onlineCount = data.onlineCount
                            this.onlineUser = data.onlineUser
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
                scrollToBottom: function (){
                	this.$nextTick(() => {
						const box = this.$refs.box
						box.scrollTop = box.scrollHeight
					})
                }

		},
		created() {
			this.ws = new WebSocket(this.wsServer)
			this.ws.onmessage = this.onmessage
			this.ws.onclose = this.disConnect
		},
		computed: {
			messageIndex:function(){
				return this.items.length - 1
			}
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
	.box{
		margin-top: 20px;
		padding: 20px;
		margin-bottom: 50px;
		height: 100%;
		overflow:scroll;
		-webkit-overflow-scrolling: touch;
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
	.chat-nickname-left{
		margin-left: 20px;
	}
	.chat-nickname-right{
		margin-right: 20px;
		text-align: right;
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
	.send-button{
		border-radius: 3px;
	    height: 40px;
	    padding: 0 20px;
	    border: 0;
	    margin-left: 10px;
	    background-color: #5FB878;
	    color: #fff;
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