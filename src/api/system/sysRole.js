/*
角色管理相关的API请求函数
*/
import request from '@/utils/request'

const api_name = '/admin/system/sysRole'

export default {

  //根据用户id查询用户已分配的角色
  getRolesByUserId(userId) {
    return request({
      url: `${api_name}/toAssign/${userId}`,
      method: 'get'
    })
  },

  //分配角色
  assignRoles(assginRoleVo) {
     return request({
     url: `${api_name}/doAssign`,
     method: 'post',
     data: assginRoleVo
    })
  },

  /*
  获取角色分页列表(带搜索)
  */
  getPageList(page, limit, searchObj) {
    return request({
      // 接口路径
      url: `${api_name}/${page}/${limit}`,
      method: 'get', // 提交方式
      params: searchObj
    })
  },

  /*
  删除角色
  */
  removeById(id) {
    return request({
      // 接口路径
      url: `${api_name}/remove/${id}`,
      method: 'delete' // 提交方式
    })
  },
  /**
   * 添加角色
   */
  save(role) {
    return request({
      // 接口路径
      url: `${api_name}/save`,
      method: 'post', // 提交方式
      // 传递json格式
      data: role
    })
  },
  /**
   * 角色修改
   */

   // 编辑
  getById(id) {
    return request({
      url: `${api_name}/get/${id}`,
      method: 'get'
    })
  },

   // 更新
  updateById(role) {
    return request({
      url: `${api_name}/update`,
      method: 'put',
      data: role
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

    // 根据用户id查询用户已分配的角色
    getRolesByUserId(userId) {
      return request({
        url: `${api_name}/toAssign/${userId}`,
        method: 'get'
      })
    },
  
    // 分配角色
    assignRoles(assginRoleVo) {
      return request({
        url: `${api_name}/doAssign`,
        method: 'post',
        data: assginRoleVo
      })
    }
}