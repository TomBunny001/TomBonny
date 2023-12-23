<template>
  <div class="app-container">
    用户列表
    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="关 键 字">
              <el-input style="width: 95%" v-model="searchObj.keyword" placeholder="用户名/姓名/手机号码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="操作时间">
              <el-date-picker
                v-model="createTimes"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="margin-right: 10px;width: 100%;"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display:flex">
          <el-button type="primary" icon="el-icon-search" size="mini"  @click="fetchData()">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetData">重置</el-button>
        </el-row>
      </el-form>
    </div>

    <!-- 工具条 -->
    <div class="tools-div">
      <!-- <el-button type="success" icon="el-icon-plus" size="mini" @click="add">添 加</el-button> -->
      <el-button type="success" icon="el-icon-plus" size="mini" @click="add" :disabled="$hasBP('bnt.sysRole.add')  === false">添 加</el-button>
    </div>

	<!-- 列表 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      stripe
      border
      style="width: 100%;margin-top: 10px;">

      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="username" label="用户名" width="180"/>
      <el-table-column prop="name" label="姓名" width="110"/>
      <el-table-column prop="phone" label="手机" />
      <el-table-column label="状态" width="80">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status === 1"
            @change="switchStatus(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" />

      <el-table-column label="操作"  align="center" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row.id)" title="修改"/>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeDataById(scope.row.id)" title="删除" />
          <el-button type="warning" icon="el-icon-baseball" size="mini" @click="showAssignRole(scope.row)" title="分配角色"/>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="fetchData"
    />

    <el-dialog title="添加/修改" :visible.sync="dialogVisible" width="40%" >
      <el-form ref="dataForm" :model="sysUser"  label-width="100px" size="small" style="padding-right: 40px;">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="sysUser.username"/>
        </el-form-item>
        <el-form-item v-if="!sysUser.id" label="密码" prop="password">
          <el-input v-model="sysUser.password" type="password"/>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="sysUser.name"/>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="sysUser.phone"/>
        </el-form-item>

        <el-form-item label="部门">
          <!-- <el-select v-model="sysUser.deptId" placeholder="请选择" clearable>
            <el-option v-for="dept in deptOptions" :key="dept.id" :label="dept.name" :value="dept.id" />
          </el-select> -->

          <!-- <el-select v-model="sysUser.deptId" placeholder="请选择" @change="selectChange">
            <el-option :value="deptName" style="height: auto">
              <el-tree :data="deptOptions" show-checkbox node-key="id" ref="tree" highlight-current :props="defaultProps" @check-change="handleCheckChange"></el-tree>
            </el-option>
          </el-select> -->

          <!-- // 点击清空的实现 -->
          <el-select v-model="sysUser.deptId" clearable placeholder="请选择" @clear="handleClear" ref="selectUpResId">
            <!-- // 设置一个隐藏的下拉选项
      // 如果不设置一个下拉选项，下面的树形组件将无法正常使用 -->
            <el-option hidden :value="sysUser.deptId" :label="upResName"> </el-option>
            <!-- // 设置树形组件  
        是否在点击节点的时候展开或者收缩节点， 默认值为 true，如果为 false，则只有点箭头图标的时候才会展开或者收缩节点。
        // 是否在点击节点的时候选中节点，默认值为 false，即只有在点击复选框时才会选中节点。
          // 节点被点击时的回调 -->
            <el-tree :data="deptOptions" :props="defaultProps" :expand-on-click-node="false" :check-on-click-node="true" @node-click="handleNodeClick"> </el-tree>
          </el-select>
        </el-form-item>

        <el-form-item label="岗位">
          <el-select v-model="sysUser.postId" placeholder="请选择" clearable>
            <el-option v-for="post in postOptions" :key="post.id" :label="post.name" :value="post.id" />
          </el-select>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small" icon="el-icon-refresh-right">取 消</el-button>
        <el-button type="primary" icon="el-icon-check" @click="saveOrUpdate()" size="small">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="分配角色" :visible.sync="dialogRoleVisible">
      <el-form label-width="80px">
        <el-form-item label="用户名">
          <el-input disabled :value="sysUser.username"></el-input>
        </el-form-item>

        <el-form-item label="角色列表">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="userRoleIds" @change="handleCheckedChange">
            <el-checkbox v-for="role in allRoles" :key="role.id" :label="role.id">{{role.roleName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="assignRole" size="small">保存</el-button>
        <el-button @click="dialogRoleVisible = false" size="small">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/system/sysUser'
import roleApi from '@/api/system/sysRole'
import deptApi from '@/api/system/sysDept'
import postApi from '@/api/system/sysPost'
const defaultForm = {
  id: '',
  username: '',
  password: '',
  name: '',
  phone: '',
  status: 1,
  detpId: '',
  postId: ''
}
export default {
  data() {
    return {
      listLoading: true, // 数据是否正在加载
      list: null, // banner列表
      total: 0, // 数据库中的总记录数
      page: 1, // 默认页码
      limit: 10, // 每页记录数
      searchObj: {}, // 查询表单对象

      createTimes: [],

      dialogVisible: false,
      sysUser: defaultForm,
      saveBtnDisabled: false,

      dialogRoleVisible: false,
      allRoles: [], // 所有角色列表
      userRoleIds: [], // 用户的角色ID的列表
      isIndeterminate: false, // 是否是不确定的
      checkAll: false ,// 是否全选

      deptOptions: [],
      postOptions: [],
      upResName: '',
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      deptName: ''
    }
  },

  // 生命周期函数：内存准备完毕，页面尚未渲染
  created() {
    this.getDeptOptions()
    console.log('success');
    // this.getPostOptions()
    console.log('list created......')
    this.fetchData()
  },

  // 生命周期函数：内存准备完毕，页面渲染成功
  mounted() {
    console.log('list mounted......')
  },

  methods: {
    //添加以下方法

    // 加载banner列表数据
    fetchData(page = 1) {
      this.page = page
      if (this.createTimes && this.createTimes.length === 2) {
        this.searchObj.createTimeBegin = this.createTimes[0]
        this.searchObj.createTimeEnd = this.createTimes[1]
      }

      api.getPageList(this.page, this.limit, this.searchObj).then((response) => {
        // this.list = response.data.list
        this.list = response.data.records
        this.total = response.data.total

        // 数据加载并绑定成功
        this.listLoading = false
      })
    },

    // 重置查询表单
    resetData() {
      console.log('重置查询表单')
      this.searchObj = {}
      this.createTimes = []
      this.fetchData()
    },

    // 根据id删除数据
    removeDataById(id) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // promise
          // 点击确定，远程调用ajax
          return api.removeById(id)
        })
        .then((response) => {
          this.fetchData(this.page)
          this.$message.success(response.message || '删除成功')
        })
        .catch(() => {
          this.$message.info('取消删除')
        })
    },

    //弹出添加表单
    add(){
      this.dialogVisible = true
      this.sysUser = {}
    },

    //编辑
    edit(id) {
      this.dialogVisible = true
      this.sysUser = Object.assign({}, defaultForm)
      this.upResName = ''
      api.getById(id).then((response) => {
        this.sysUser = response.data
        this.deptOptions.forEach((d) => console.log(d))
        console.log()
        this.upResName = this.deptOptions.filter((d) => d.id === response.data.detpId).name
      })
    },

    //添加或更新
    saveOrUpdate() {
        if (!this.sysUser.id) {
            this.save()
        } else {
            this.update()
        }
    },

    //添加
    save() {
      api.save(this.sysUser).then(response => {
        this.$message.success('操作成功')
        this.dialogVisible = false
        this.fetchData(this.page)
      })
    },


    //更新
    update() {
      api.updateById(this.sysUser).then(response => {
        this.$message.success(response.message || '操作成功')
        this.dialogVisible = false
        this.fetchData(this.page)
      })
    },

    //切换用户状态
    switchStatus(row) {
       row.status = row.status === 1 ? 0 : 1
       api.updateStatus(row.id, row.status).then(response => {
          if (response.code) {
            this.$message.success(response.message || '操作成功')
            this.fetchData()
          }
       })
    },



    //展示分配角色
    showAssignRole (row) {
      this.sysUser = row
      this.dialogRoleVisible = true
      this.userRoleIds = []
      this.isIndeterminate = false
      this.checkAll = false
      roleApi.getRolesByUserId(row.id).then((response) => {
        this.allRoles = response.data.allRoles
        this.userRoleIds = response.data.userRoleIds
        this.checkAll = this.userRoleIds.length === this.allRoles.length
        this.isIndeterminate = this.userRoleIds.length > 0 && this.userRoleIds.length < this.allRoles.length
      })
    },

    /*
    全选勾选状态发生改变的监听
    */
    handleCheckAllChange (value) {
      // value 当前勾选状态true/false
      // 如果当前全选, userRoleIds就是所有角色id的数组, 否则是空数组
      this.userRoleIds = value ? this.allRoles.map(item => item.id) : []
      // 如果当前不是全选也不全不选时, 指定为false
      this.isIndeterminate = false
    },

    /*
    角色列表选中项发生改变的监听
    */
    handleCheckedChange (value) {
      const {userRoleIds, allRoles} = this
      this.checkAll = userRoleIds.length === allRoles.length && allRoles.length>0
      this.isIndeterminate = userRoleIds.length>0 && userRoleIds.length<allRoles.length
    },

    //分配角色
    assignRole () {
      let assginRoleVo = {
        userId: this.sysUser.id,
        roleIdList: this.userRoleIds
      }
      roleApi.assignRoles(assginRoleVo).then(response => {
        this.$message.success(response.message || '分配角色成功')
        this.dialogRoleVisible = false
        this.fetchData(this.page)
      })
    },

    // 获取部门树选项
    getDeptOptions() {
      deptApi.findNodes().then((res) => {
        this.deptOptions = res.data
      })
    },

    // 获取岗位选项列表
    getPostOptions() {
      console.log(postApi)
      postApi.getList().then((res) => {
        console.log('res',res);
        this.postOptions = res.data
      }).catch(err=>console.error(err))
    },

    handleNodeClick(data) {
      console.log(data)
      // 这里主要配置树形组件点击节点后，设置选择器的值；自己配置的数据，仅供参考
      this.upResName = data.name
      this.sysUser.deptId = data.id
      // 选择器执行完成后，使其失去焦点隐藏下拉框的效果
      this.$refs.selectUpResId.blur()
    },
    

    // 选择器配置可以清空选项，用户点击清空按钮时触发
    handleClear() {
      // 将选择器的值置空
      this.upResName = ''
      this.sysUser.deptId = ''
    }

  }
}
</script>
<style>
.search-div {
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 3px;
}
.tools-div {
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 3px;
}
</style>

