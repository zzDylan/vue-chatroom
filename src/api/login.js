import request from '@/request'

export function login(username,password){
	return request({
		url:'api/login',
		method:'post',
		data:{username:username,password:password}
	})
}