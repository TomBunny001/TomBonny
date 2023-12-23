import request from '@/utils/request'
/*
部门管理相关的API请求函数
*/
const api_name = '/admin/system/sysDept'

export default {

  /*
  获取部门列表
  */
  findNodes() {
    return request({
      url: `${api_name}/findNodes`,
      method: 'get'
    })
  },

  /*
  删除
  */
  removeById(id) {
    return request({
      url: `${api_name}/remove/${id}`,
      method: 'delete'
    })
  },

  /*
  保存
  */
  save(sysDept) {
    return request({
      url: `${api_name}/save`,
      method: 'post',
      data: sysDept
    })
  },

  /*
  更新
  */
  updateById(sysDept) {
    return request({
      url: `${api_name}/update`,
      method: 'put',
      data: sysDept
    })
  }

}
