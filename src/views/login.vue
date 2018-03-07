<template>
	<div class="panel">
		<div>
			<div class="logo">
				<img src="@/assets/logo.jpg">
				<div>大吉大利今晚IT</div>
			</div>
			<div class="input-box">
				<input v-model="username" name="username" v-validate="'required|max:10'" type="text" placeholder="请输入用户名">
				<span v-show="errors.has('username')" class="error">{{ errors.first('username') }}</span>
			</div>
			<div class="input-box">
				<input v-model="password" name="password" v-validate="'required|min:6|max:18'" type="password" placeholder="请输入密码">
				<span v-show="errors.has('password')" class="error">{{ errors.first('password') }}</span>
			</div>
			<div class="button-div">
				<button @click="login" class="panel-button" type="button">登陆</button>
			</div>
			<div class="link-div">
				<router-link to="/register" href="" class="link">注册</router-link>
			</div>
		</div>
		
	</div>
</template>

<script type="text/javascript">
	import { login } from '@/api/login'
	import { Toast } from 'mint-ui'
	export default {
		data(){
			return {
				username:'',
				password:''
			}
		},
		methods:{
			login() {
		      this.$validator.validateAll().then((result) => {
		        if (result) {
		          // eslint-disable-next-line
		          login(this.username,this.password).then(res => {
		          	const token = res.data.meta.token_type + ' ' + res.data.meta.access_token
		          	localStorage.setItem('token',token)
		          	Toast({
						message:'登录成功'
					})
					this.$router.push({ path:'/' })
		          })
		          return;
		        }
		        Toast({
					message:'表单信息有误'
				})
		      });
		    }
		},
		computed:{
			
		}
	}
</script>

<style>
	.panel{
		background: url(../assets/login_bg.jpg) no-repeat left top;
		background-size: cover;
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left:0;
		right:0;
		bottom: 0;
	}
	.logo{
		display: flex;
		padding: 25px;
		justify-content: center;
		align-items: center;
		flex-direction:column;
	}
	.logo img{
		width: 80px;
		height:80px;
		border-radius: 12px;
		margin:10px;
	}
	.panel input{
		border-width: 0px;
		padding: 15px;
		width:100%;
		background-color:transparent;
		font-size: 1rem;
		/*消除高亮*/
		-webkit-tap-highlight-color: rgba(255, 255, 255, 0); 
        -webkit-user-select: none;
        -moz-user-focus: none;
        -moz-user-select: none;
        -webkit-appearance:none;
        outline: none;
        border: none;
	}
	.input-box{
		overflow:hidden;
		border:0.5px solid #EBEBEB;
		margin-bottom: -1px
	}
	.panel-button{
		width:100%;
		padding-top: 15px;
		padding-bottom: 15px;
		padding-left: 20px;
		padding-right: 20px;
		border:1px solid #5cb85c;
		background-color: #5cb85c;
		color: white;
		font-size: 1rem;
	}
	.button-div{
		padding: 15px;
		margin-top: 10px;
	}
	.link{
		color:#52ace5;
		font-size:1rem;
		text-decoration: none;
	}
	.link-div{
		margin-left: 15px;
		margin-right: 15px;
	}
	.error{
		text-align: center;
		color:red;
	}
</style>