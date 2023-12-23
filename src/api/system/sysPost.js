/*
岗位管理相关的API请求函数
*/
import request from '@/utils/request'

const api_name = '/admin/sysPost/v1'

export default {

  /*
  获取岗位分页列表(带搜索)
  */
  getPageList(page, limit, searchObj) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'get',
      params: searchObj
    })
  },

  removeById(id) {
    return request({
      url: `${api_name}/remove/${id}`,
      method: 'delete'
    })
  },
  save(post) {
    return request({
      url: `${api_name}/save`,
      method: 'post',
      data: post
    })
  },
  // 编辑
  getById(id) {
    return request({
      url: `${api_name}/get/${id}`,
      method: 'get'
    })
  },

  // 更新
  updateById(post) {
    return request({
      url: `${api_name}/update`,
      method: 'put',
      data: post
    })
  },
  // 批量删除
  batchRemove(idList) {
    return request({
      url: `${api_name}/batchRemove`,
      method: `delete`,
      data: idList
    })
  },

  // 更新用户状态
  updateStatus(id, status) {
    return request({
      url: `${api_name}/updateStatus/${id}/${status}`,
      method: 'get'
    })
  },

  // 获取所有数据下拉选项
  getList() {
    console.log('getList')
    return request({
      url: `${api_name}/findAll`,
      method: 'get'
    })
    
  }
}
