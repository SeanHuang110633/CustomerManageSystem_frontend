import request from '@/utils/request'

//分頁查詢客戶列表
export const customerListService = (params) => {
  return request.get('/customer', { params: params })
}

//查詢所有客戶
export const customerListApproachService = () => {
  return request.get('/customer/approach')
}

//查詢所有客戶初次來店日期
export const customerListFirstLessosnService = () => {
  return request.get('/customer/firstLesson')
}

//查詢客戶性別數據
export const customerListGenderService = () => {
  return request.get('/customer/gender')
}

//新增客戶
export const customerAddService = (customerData) => {
  return request.post('/customer', customerData)
}

//編輯客戶
export const customerUpdateService = (customerData) => {
  return request.put('/customer', customerData)
}

//刪除客戶
export const customerDeleteService = (id) => {
  return request.delete('/customer?id=' + id)
}
