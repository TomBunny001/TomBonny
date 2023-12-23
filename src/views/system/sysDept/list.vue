<template>
  <div class="app-container">
    <!-- 工具条 -->
    <div class="tools-div">
      <el-button type="success" icon="el-icon-plus" size="mini" :disabled="!$hasBP('bnt.sysDept.add')" @click="add()">添 加</el-button>
    </div>
    <el-table :data="sysDeptList" style="width: 100%; margin-bottom: 20px; margin-top: 10px" row-key="id" border :default-expand-all="false" :tree-props="{ children: 'children' }">
      <el-table-column prop="name" label="部门名称" />

      <el-table-column prop="leader" label="部门负责人" width="260" />
      <el-table-column prop="phone" label="电话" width="200" />
      <el-table-column label="状态" width="120">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status === 1" :disabled="true" />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="160" />
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button v-if="scope.row.type !== 2" type="success" icon="el-icon-plus" size="mini" title="添加下级节点" @click="add(scope.row)" />
          <el-button type="primary" icon="el-icon-edit" size="mini" title="修改" @click="edit(scope.row)" />
          <el-button type="danger" icon="el-icon-delete" size="mini" title="删除" @click="removeDataById(scope.row.id)" />
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%">
      <el-form ref="dataForm" :model="sysDept" label-width="150px" size="small" style="padding-right: 40px">
        <el-form-item v-if="sysDept.id === ''" label="上级部门">
          <el-input v-model="sysDept.parentName" disabled="true" />
        </el-form-item>
        <el-form-item label="部门类型" prop="type">
          <el-radio-group v-model="sysDept.type" :disabled="typeDisabled">
            <el-radio :label="0" :disabled="type0Disabled">目录</el-radio>
            <el-radio :label="1" :disabled="type1Disabled">部门</el-radio>
            <el-radio :label="2" :disabled="type2Disabled">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="sysDept.name" />
        </el-form-item>
        <el-form-item v-if="sysDept.type !== 2" label="图标" prop="icon">
          <el-select v-model="sysDept.icon" clearable>
            <el-option v-for="item in iconList" :key="item.class" :label="item.class" :value="item.class">
              <span style="float: left">
                <i :class="item.class" />
                <!-- 如果动态显示图标，这里添加判断 -->
              </span>
              <span style="padding-left: 6px">{{ item.class }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="sysDept.sortValue" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item prop="path">
          <span slot="label">
            <el-tooltip content="访问的路由地址，如：`sysUser`" placement="top">
              <i class="el-icon-question" />
            </el-tooltip>
            路由地址
          </span>
          <el-input v-model="sysDept.path" placeholder="请输入路由地址" />
        </el-form-item>
        <el-form-item v-if="sysDept.type !== 0" prop="component">
          <span slot="label">
            <el-tooltip content="访问的组件路径，如：`system/user/index`，默认在`views`目录下" placement="top">
              <i class="el-icon-question" />
            </el-tooltip>
            组件路径
          </span>
          <el-input v-model="sysDept.component" placeholder="请输入组件路径" />
        </el-form-item>
        <el-form-item v-if="sysDept.type === 2">
          <el-input v-model="sysDept.perms" placeholder="请输入权限标识" maxlength="100" />
          <span slot="label">
            <el-tooltip content="控制器中定义的权限字符，如：@PreAuthorize(hasAuthority('bnt.sysRole.list'))" placement="top">
              <i class="el-icon-question" />
            </el-tooltip>
            权限字符
          </span>
        </el-form-item>
        <el-form-item label="状态" prop="type">
          <el-radio-group v-model="sysDept.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" icon="el-icon-refresh-right" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" icon="el-icon-check" @click="saveOrUpdate()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/system/sysDept'
const defaultForm = {
  id: '',
  parentId: '',
  name: '',
  sortValue: 1,
  status: 1
}
export default {
  // 定义数据
  data() {
    return {
      sysDeptList: [],
      expandKeys: [], // 需要自动展开的项

      typeDisabled: false,
      type0Disabled: false,
      type1Disabled: false,
      type2Disabled: false,
      dialogTitle: '',

      dialogVisible: false,
      sysDept: defaultForm,
      saveBtnDisabled: false,

      iconList: [
        {
          class: 'el-icon-s-tools'
        },
        {
          class: 'el-icon-s-custom'
        },
        {
          class: 'el-icon-setting'
        },
        {
          class: 'el-icon-user-solid'
        },
        {
          class: 'el-icon-s-help'
        },
        {
          class: 'el-icon-phone'
        },
        {
          class: 'el-icon-s-unfold'
        },
        {
          class: 'el-icon-s-operation'
        },
        {
          class: 'el-icon-more-outline'
        },
        {
          class: 'el-icon-s-check'
        },
        {
          class: 'el-icon-tickets'
        },
        {
          class: 'el-icon-s-goods'
        },
        {
          class: 'el-icon-document-remove'
        },
        {
          class: 'el-icon-warning'
        },
        {
          class: 'el-icon-warning-outline'
        },
        {
          class: 'el-icon-question'
        },
        {
          class: 'el-icon-info'
        }
      ]
    }
  },

  // 当页面加载时获取数据
  created() {
    this.fetchData()
  },

  methods: {
    // 调用api层获取数据库中的数据
    fetchData() {
      console.log('加载列表')
      api.findNodes().then((response) => {
        this.sysDeptList = response.data
      })
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
          this.fetchData()
          this.$message({
            type: 'success',
            message: response.message
          })
        })
        .catch(() => {
          this.$message.info('取消删除')
        })
    },

    // 弹出添加或更新的表单
    add(row) {
      this.typeDisabled = false
      this.dialogTitle = '添加下级节点'
      this.dialogVisible = true

      // 清空对象中的值
      this.sysDept = Object.assign({}, defaultForm)
      this.sysDept.id = ''
      if (row) {
        this.sysDept.parentId = row.id
        this.sysDept.parentName = row.name
        // this.sysDept.component = 'ParentView'
        if (row.type === 0) {
          this.sysDept.type = 1
          this.typeDisabled = false
          this.type0Disabled = false
          this.type1Disabled = false
          this.type2Disabled = true
        } else if (row.type === 1) {
          this.sysDept.type = 2
          this.typeDisabled = true
        }
      } else {
        this.dialogTitle = '添加目录节点'
        this.sysDept.type = 0
        this.sysDept.component = 'Layout'
        this.sysDept.parentId = 0
        this.typeDisabled = true
      }
    },

    // 编辑
    edit(row) {
      this.dialogTitle = '修改部门'
      this.dialogVisible = true

      this.sysDept = Object.assign({}, row)
      this.typeDisabled = true
    },

    // 添加或更新
    saveOrUpdate() {
      if (this.sysDept.type === 0 && this.sysDept.parentId !== 0) {
        this.sysDept.component = 'ParentView'
      }
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.saveBtnDisabled = true // 防止表单重复提交
          if (!this.sysDept.id) {
            this.save()
          } else {
            this.update()
          }
        }
      })
    },

    // 添加
    save() {
      api.save(this.sysDept).then((response) => {
        this.$message.success(response.message || '操作成功')
        this.dialogVisible = false
        this.fetchData(this.page)
      })
    },

    // 更新
    update() {
      api.updateById(this.sysDept).then((response) => {
        this.$message.success(response.message || '操作成功')
        this.dialogVisible = false
        this.fetchData()
      })
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
