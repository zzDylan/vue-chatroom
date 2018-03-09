import request from '@/request'

export function sendText(text){
	return request({
		url:'api/send_text',
		method:'post',
		data:{text:text}
	})
}