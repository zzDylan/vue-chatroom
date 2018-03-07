import request from '@/request'

export function register(username,password){
	return request({
		url:'api/register',
		method:'post',
		data:{username:username,password:password}
	})
}