<template>
  <div id="app">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible=true">添加角色</el-button>
          <el-button type="primary" v-print="'#printTest'">打印</el-button>
        </el-col>
      </el-row>
      <el-table id="printTest" :data="rolesList" border stripe>
        <!-- zhangkailie  -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdtottom',i1===0?'bdtop':'','vcenter']"
              :key="item1.id"
              v-for="(item1,i1) in scope.row.children"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环嵌套渲染二级权限 -->
                <el-row
                  :class="[i2===0?'':'bdtop','vcenter']"
                  :key="item2.id"
                  v-for="(item2,i2) in item1.children"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      type="success"
                      @close="removeRightById(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      :key="i3"
                      v-for="(item3,i3) in item2.children"
                      closable
                      @close="removeRightById(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 添加索引号  type="index"-->
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="360px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteByRoleId(scope.row.id)"
            >删除</el-button>
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-setting"
              @click="showSetRigihtsDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加用户的对话框 -->
      <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <!-- 内容主体区 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部按钮区 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRoles">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户的对话框 -->
      <el-dialog
        title="修改角色"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed"
      >
        <!-- 内容主体区 -->
        <el-form :model="editForm" ref="editFormRef" label-width="80px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部按钮区 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配权限对话框 -->
      <el-dialog
        title="分配权限"
        :visible.sync="setRightsDialogVisible"
        width="50%"
        @close="setRightsDialogClosed"
      >
        <!-- 树形空间 -->
        <el-tree
          :data="rightsList"
          show-checkbox
          :props="treeProps"
          node-key="id"
          default-expand-all
          :default-checked-keys="deKeys"
          ref="treeRef"
        ></el-tree>
        <!-- 底部按钮区 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightsDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //所以角色列表数据
      rolesList: [],
      addDialogVisible: false, //控制添加角色对话框的显示与隐藏
      addForm: { roleName: "", roleDesc: "" }, //表单数据对象
      addFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" }
        ]
      }, //表单验证规则对象
      editDialogVisible: false,
      editForm: {},
      setRightsDialogVisible: false,
      rightsList: [],
      treeProps: {
        children: "children",
        label: "authName"
      },
      deKeys: [], //树形空间的绑定控件
      roleId: "" //当前即将被分配角色的id
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get("roles")
      if (res.meta.status1 == "200") {
        return this.$message.error("获取角色列表失败")
      }
      this.rolesList = res.data
    },
    //监听添加怼回框是否关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    addRoles() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        //f发起网络请求，添加用户
        const { data: res } = await this.$http.post("roles", this.addForm)
        if (res.meta.status !== 201) {
          return this.$message.error("添加角色失败！")
        }
        //如果添加成功，则返回成功的提示消息
        this.$message.success("添加角色成功！")
        //添加用户成功关闭对话框
        this.addDialogVisible = false
        //重新获取用户列表数据
        this.getRolesList()
      })
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(`roles/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error("查询角色失败！")
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) {
          return this.$message.error("修改角色失败！")
        }

        //发起用户请求
        const { data: res } = await this.$http.put(
          "roles/" + this.editForm.roleId,
          {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc
          }
        )
        console.log(this.editForm)

        console.log(res)
        console.log(res.meta.status)

        if (res.meta.status !== 200) {
          return this.$message.error("更新角色信息失败！")
        }
        //添加用户成功关闭对话框
        this.editDialogVisible = false
        //刷新用户列表数据
        this.getRolesList()
        //如果添加成功，则返回成功的提示消息
        this.$message.success("更新角色信息成功！")
      })
    },
    deleteByRoleId(id) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`roles/${id}`)
          if (res.meta.status !== "200") {
            this.$message.error("删除角色失败！")
          }
          this.$message.success("删除角色成功！")
          //删除成功后刷新列表数据
          this.getRolesList()
        })
        .catch(() => {
          this.$message.info("已取消删除")
        })
    },
    async removeRightById(role, rightId) {
      // this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning"
      // })
      //   .then(async () => {
      //     const { data: res } = this.$http.delete(
      //       `roles/${role.id}/rights/${rightId}`
      //     )
      //     console.log(res.data)

      //     if (res.meta.status !== "200") {
      //       return this.$message.error("删除角色失败！")
      //     }
      //     this.$message({
      //       type: "success",
      //       message: "删除成功!"
      //     })
      //     this.getRolesList()
      //   })
      //   .catch(() => {
      //     this.$message({
      //       type: "info",
      //       message: "已取消删除"
      //     })
      //   })

      const confirmReslut = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err)

      //如果用户确认删除，则返回字符串confirm
      //如果用户取消删除，则返回值为字符串cancel
      if (confirmReslut !== "confirm") {
        return this.$message.info("已取消删除")
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败！")
      }

      this.$message.success("删除成功！")
      role.children = res.data
    },

    async showSetRigihtsDialog(role) {
      this.roleId = role.id
      //获取权限的数据
      const { data: res } = await this.$http.get("rights/tree")
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限列表失败")
      }
      this.rightsList = res.data
      console.log(res.data)
      this.getLeaftKeys(role, this.deKeys)
      this.setRightsDialogVisible = true
    },

    //通过递归的形式，所有三级权限存到数组中
    getLeaftKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(element => {
        this.getLeaftKeys(element, arr)
      })
    },
    setRightsDialogClosed() {
      this.deKeys = []
    },
    //点击为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedNodes()
      ]
      //将数组拼接成字符串
      const idStr = keys.join(",")
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        {
          rids: idStr
        }
      )

      if (res.meta.status !== 200) {
        return this.$message.error("分配权限失败")
      }
      this.$message.success("分配权限成功")
      this.getRolesList()
      this.setRightsDialogVisible = false
    }
  }
}
</script>
<style lang="less">
.el-tag {
  margin: 0.4375rem;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdtottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>