import request from '@/request'

export function sendImage(data){
	return request({
		url:'api/send_image',
		method:'post',
		data:data
	})
}