import request from '@/request'

export function bind(client_id){
	return request({
		url:'api/bind',
		method:'post',
		data:{client_id:client_id}
	})
}