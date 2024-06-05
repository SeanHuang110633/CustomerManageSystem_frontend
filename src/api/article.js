import request from '@/utils/request'

//查詢文章分類列表
export const articleCategoryListService = () => {
  return request.get('/category')
}

//新增文章分類
export const articleCategoryAddService = (categoryData) => {
  return request.post('/category', categoryData)
}

//編輯(更新)文章分類
export const articleCategoryUpdateService = (categoryData) => {
  return request.put('/category', categoryData)
}

//刪除文章分類
export const articleCategoryDeleteService = (id) => {
  return request.delete('/category?id=' + id)
}

//查詢文章
export const articleListService = (params) => {
  return request.get('/article', { params: params })
}

//新增文章
export const articleAddService = (articleData) => {
  return request.post('/article', articleData)
}

//編輯(更新)文章
export const articleUpdateService = (articleData) => {
  return request.put('/article', articleData)
}

export const articleDeleteService = (id) => {
  return request.delete('/article?id=' + id)
}
