import request from '@/utils/request'

//查詢客戶列表
export const customerListService = (params) => {
  return request.get('/customer', { params: params })
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
