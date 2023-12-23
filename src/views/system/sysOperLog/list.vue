<template>
  <div class="app-container">
    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="操作模块">
              <el-input v-model="searchObj.title" style="width: 95%" placeholder="操作模块" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="操作人">
              <el-input v-model="searchObj.operName" style="width: 95%" placeholder="操作人" />
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
                style="margin-right: 10px; width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display: flex">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="fetchData()">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetData">重置</el-button>
        </el-row>
      </el-form>
    </div>

    <!-- 列表 -->
    <el-table v-loading="listLoading" :data="list" stripe border style="width: 100%; margin-top: 10px">
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="title" label="系统模块" width="100" />
      <el-table-column prop="businessType" label="操作类型" width="120" />
      <el-table-column prop="requestMethod" label="请求方式" width="120" />
      <el-table-column prop="operName" label="操作人员" width="120" />
      <el-table-column prop="operIp" label="操作IP地址" width="120" />
      <el-table-column prop="operParam" label="请求参数"   />
      <el-table-column prop="tag" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 1 ? 'primary' : 'danger'" disable-transitions>{{ scope.row.status === 1 ? '成功' : '失败' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" title="详情" icon="el-icon-search" size="mini" @click="detail(scope.row)" />
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination :current-page="page" :total="total" :page-size="limit" style="padding: 30px 0; text-align: center" layout="total, prev, pager, next, jumper" @current-change="fetchData" />
    <!-- 日志详情 -->
    <el-dialog title="日志详情" :visible.sync="dialogVisible">
      <el-form ref="form" :model="sysOperLog" label-width="100px" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作模块：">{{ sysOperLog.title }} </el-form-item>
            <el-form-item label="登录信息：">{{ sysOperLog.operName }} / {{ sysOperLog.operIp }} </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求地址：">{{ sysOperLog.operUrl }}</el-form-item>
            <el-form-item label="请求方式：">{{ sysOperLog.requestMethod }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作方法：">{{ sysOperLog.method }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="请求参数：">{{ sysOperLog.operParam }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="返回参数：">{{ sysOperLog.jsonResult }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作状态：">
              <div v-if="sysOperLog.status === 0">正常</div>
              <div v-else-if="sysOperLog.status === 1">失败</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作时间：">{{ sysOperLog.operTime }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="异常信息：" v-if="sysOperLog.status === 1">{{ sysOperLog.errorMsg }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer">
        <el-button size="small" @click="dialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/system/sysOperLog'
const defaultForm = {
  id: '',
  title: '',
  businessType: '',
  method: '',
  requestMethod: '',
  operatorType: '',
  operName: '',
  deptName: '',
  operUrl: '',
  operIp: '',
  operParam: '',
  jsonResult: '',
  status: 1,
  errorMsg: ''
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

      sysOperLog: defaultForm,
      dialogVisible: false
    }
  },

  // 生命周期函数：内存准备完毕，页面尚未渲染
  created() {
    this.fetchData()
  },

  // 生命周期函数：内存准备完毕，页面渲染成功
  mounted() {
    console.log('list mounted......')
  },

  methods: {
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
    // 查看详情
    detail(row) {
      this.dialogVisible = true
      this.sysOperLog = row
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
