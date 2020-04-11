<template>
  <div id="app">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table
        class="treeTable"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        :show-row-hover="false"
        border
      >
        <!-- 是否有效 -->
        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-error color" v-if="scope.row.cat_delete===false"></i>
          <i class="el-icon-success color" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="setting" slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="showEditDialog(scope.row.cat_id)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="deleteCateById(scope.row.cat_id)"
          >删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>

      <!-- 添加分类对话框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addCateDialogVisible"
        width="50%"
        @close="addCateDialogClosed"
      >
        <!-- 添加分类表单 -->
        <el-form
          :model="addCateForm"
          :rules="addCateFromRules"
          ref="addCateFormRef"
          label-width="100px"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <!-- options用来制定数据源 -->
            <el-cascader
              :options="parentCateList"
              :props="parentCateProps"
              v-model="selectedKeys"
              @change="parentCateChange"
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改分类对话框 -->
      <el-dialog title="修改分类" :visible.sync="editCateDialogVisible" width="50%">
        <el-form
          :model="editCateInfo"
          :rules="editCaterInfoRules"
          ref="editCateInfoRef"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="分类名称" prop="name">
            <el-input v-model="editCateInfo.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="savaCateInfo">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      cateList: [],
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          type: "template",
          template: "isOk"
        },
        {
          label: "排序",
          type: "template",
          template: "order"
        },
        {
          label: "排序",
          type: "template",
          template: "setting"
        }
      ],

      total: 0, //总数据条数
      addCateDialogVisible: false, //控制添加分类对话框的显示和隐藏
      //添加分类的表单数据对象
      addCateForm: {
        cat_pid: 0, //父级分类ID
        cat_name: "",
        cat_level: 0
      },
      addCateFromRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      //父级分类列表
      parentCateList: [],
      parentCateProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      selectedKeys: [],
      editCateDialogVisible: false, //修改分类对话框的显示与隐藏
      editCateInfo: {}, //修改分类的对象
      editCaterInfoRules: {
        cat_name: [
          { required: true, message: "分类名称不能为空", trigger: "blur" }
        ]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get(`categories`, {
        params: this.queryInfo
      })

      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败！")
      }
      this.cateList = res.data.result
      this.total = res.data.total
    },
    //监听pagesize该表
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    //监听pagenum该表
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getCateList()
    },
    //点击按钮,展示添加分类的对话框
    showAddCateDialog() {
      //先获取父级分类的列表再显示对话框
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    async getParentCateList() {
      const { data: res } = await this.$http.get(`categories`, {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error("获取父级分类数据失败！")
      }
      this.parentCateList = res.data
    },
    //选择项发生变化触发这个函数
    parentCateChange() {
      // 如果selectedKeys数组的length大于0,证明选中了父级分类
      // 反之,没有选择任何父级分类
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        //为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    //点击按钮，添加新的分类
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          `categories`,
          this.addCateForm
        )
        console.log(res.data)

        if (res.meta.status !== 201) {
          return this.$message.error("添加分类失败")
        }
        this.$message.success("添加分类成功")
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    //监听对话框的关闭事件，重置表单数据
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    async showEditDialog(cat_id) {
      const { data: res } = await this.$http.get(`categories/${cat_id}`)
      if (res.meta.status !== 200) {
        return this.$message.error("查询分类失败")
      }
      this.editCateInfo = res.data
      this.editCateDialogVisible = true
    },
    async savaCateInfo() {
      this.$refs.editCateInfoRef.validate(async valid => {
        if (!valid) {
          return this.$message.error("修改分类名称失败！")
        }
      })
      const { data: res } = await this.$http.put(
        `categories/${this.editCateInfo.cat_id}`,
        {
          cat_name: this.editCateInfo.cat_name
        }
      )
      console.log(res.data)
      if (res.meta.status !== 200) {
        return this.$message.error("修改分类名字失败")
      }
      //修改成功后重新获取数据
      this.getCateList()
      this.editCateDialogVisible = false
    },
    deleteCateById(cat_id) {
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`categories/${cat_id}`)
          console.log(res.data)
          if (res.meta.status !== 200) {
            this.$message({
              type: "info",
              message: "删除失败"
            })
          }
          this.$message({
            type: "success",
            message: "删除成功!"
          })
          //重新获取列表数
          this.getCateList()
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          })
        })
    }
  }
}
</script>
<style lang="less">
.treeTable {
  margin-top: 15px;
}
.color {
  color: #4ee44e;
  font-size: 16px;
}
.el-cascader {
  width: 100%;
}
</style>