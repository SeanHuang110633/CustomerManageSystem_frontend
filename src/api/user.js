import request from '@/utils/request'

//查詢所有用戶
export const userListService = () => {
  return request.get('/user')
}

//用戶註冊
export const userRegisterService = (registerData) => {
  const params = new URLSearchParams()
  for (let key in registerData) {
    params.append(key, registerData[key])
  }
  return request.post('/user/register', params)
}

//用戶登入
export const userLoginService = (loginData) => {
  const params = new URLSearchParams()
  for (let key in loginData) {
    params.append(key, loginData[key])
  }
  return request.post('/user/login', params)
}

//查詢用戶資訊
export const userInfoService = () => {
  return request.get('/user/userinfo')
}

//更新用戶個人資訊
export const userInfoUpdateService = (userInfoData) => {
  console.log(userInfoData)
  return request.put('/user', userInfoData)
}

//更新用戶權限
export const userRoleUpdateService = (id, userRole) => {
  return request.patch(`/user/updateRole?id=${id}&userRole=${userRole}`)
}

//刪除用戶
export const userDeleteService = (id) => {
  return request.delete('/user?id=' + id)
}

//更新用戶密碼
export const userPwdUpdate = (pwdUpateData) => {
  return request.patch('/user/updatePwd', pwdUpateData)
}
