import request from '@/request'

export function sendMessage(message){
	return request({
		url:'api/sendMessage',
		method:'post',
		data:{message:message}
	})
}