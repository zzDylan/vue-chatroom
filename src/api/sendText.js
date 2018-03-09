import request from '@/request'

export function sendText(text){
	return request({
		url:'api/sendText',
		method:'post',
		data:{text:text}
	})
}