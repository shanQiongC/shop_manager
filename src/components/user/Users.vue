<template>
  <div id="app">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
            clearable
            @clear="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <!-- <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button> -->
          <form-dialog
            :dialog="addDialog"
            :perPage="queryInfo.pagesize"
            :load-list="loadList"
            :add-button="{
               text:'添加用户'
              }"
          ></form-dialog>
        </el-col>
      </el-row>
      <i-table
        :dataList="userList"
        :columns="columns"
        :perPage="queryInfo.pagesize"
        :total="total"
        :load-list="loadList"
      ></i-table>
    </el-card>

    <!-- 添加用户的对话框 -->

    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <!-- 内容主体区 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
        <el-form-item label="用户名">
          <!-- disabled禁用input不给输入 -->
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="分配角色"
      :visible.sync="setRolesDialogVisible"
      width="50%"
      @close="setRolesDialogClosed"
    >
      <!-- 树形空间 -->
      <!-- <el-tree
        :data="rightsList"
        show-checkbox
        :props="treeProps"
        node-key="id"
        default-expand-all
        :default-checked-keys="deKeys"
        ref="treeRef"
      ></el-tree>-->
      <div class>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>
          分配新角色：
          <el-select v-model="selectRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <!-- 底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="savaRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import iTable from "../common/iTable"
import formDialog from "../common/formDialog"

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { iTable, formDialog },
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }
      cb(new Error("请输入合法的邮箱"))
    }
    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error("请输入合法的手机号"))
    }

    return {
      queryInfo: {
        query: null,
        //当前页数
        pagenum: 1,
        //d当前没有显示多少条数据
        pagesize: 5
      },
      userList: [],
      columns: [
        {
          prop: "username",
          label: "姓名"
        },
        {
          prop: "email",
          label: "邮箱"
        },
        {
          prop: "mobile",
          label: "电话"
        },
        {
          prop: "role_name",
          label: "角色"
        },
        {
          prop: "mg_state",
          label: "状态",

          render: (h, { row }) => {
            return (
              <div>
                <el-switch
                  vModel={row.mg_state}
                  onChange={() => this.userStateChange(row)}
                ></el-switch>
              </div>
            )
          }
        },
        {
          label: "操作",
          width: "180px",
          render: (h, { row }) => {
            return (
              <div>
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  onClick={() => this.showEditDialog(row.id)}
                ></el-button>

                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  onClick={() => this.deleteUserById(row.id)}
                ></el-button>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="分配角色"
                  placement="top-start"
                >
                  <el-button
                    type="warning"
                    size="mini"
                    icon="el-icon-setting"
                    onClick={() => this.showSetRolesDialog(row)}
                  ></el-button>
                </el-tooltip>
              </div>
            )
          }
        }
      ],

      addDialog: {
        title: "添加用户",
        form: {
          username: "",
          password: "",
          emali: "",
          mobile: ""
        },
        formRules: {
          //用户名的验证规则
          username: [
            { required: true, message: "请输入用户名", trigger: "blur" },
            {
              min: 3,
              max: 10,
              message: "用户名的长度在3至10字符之间",
              trigger: "blur"
            }
          ],
          password: [
            { required: true, message: "请输入密码", trigger: "blur" },
            {
              min: 6,
              max: 15,
              message: "密码的长度在6至15字符之间",
              trigger: "blur"
            }
          ],
          email: [
            { required: true, message: "请输入邮箱", trigger: "blur" },
            { validator: checkEmail, trigger: "blur" }
          ],
          mobile: [
            { required: true, message: "请输入手机号码", trigger: "blur" },
            { validator: checkMobile, trigger: "blur" }
          ]
        },
        formConfig: [
          {
            label: "用户名",
            prop: "username"
          },
          {
            label: "密码",
            prop: "password"
          },
          {
            label: "邮箱",
            prop: "email"
          },
          {
            label: "手机号码",
            prop: "mobile"
          }
        ]
      },
      total: 0,
      editDialogVisible: false,
      editForm: {},
      //修改表单的
      editFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      setRolesDialogVisible: false,
      //需要被分配角色的用户信息
      userInfo: {},
      rolesList: {},
      selectRoleId: "" //已选择 角色Id值
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async loadList({ pagenum, pagesize, query }) {
      const { data: res } = await this.$http.get("users", {
        params: {
          pagenum,
          pagesize,
          ...query
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error("获取用用户列表失败")
      }
      this.userList = res.data.users
      this.total = res.data.total
    },
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error("获取用用户列表失败")
      }
      this.userList = res.data.users
      this.total = res.data.total
    },
    //修改用户状态 监听switch的change事件
    async userStateChange(userInfo) {
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        userList.mg_state = !userList.mg_state
        return this.$message.error("更新用户状态失败！")
      }
      this.$message.success("更新用户状态成功")
    },

    //显示修改用户的对话框
    async showEditDialog(id) {
      //根据id获取用户信息
      const { data: res } = await this.$http.get(`users/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error("查询用户失败！")
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    //重置预验证=“
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //修改用户信息的提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error("修改用户失败！")
        }
        //发起用户请求
        const { data: res } = await this.$http.put(
          "users/" + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }
        )
        console.log(res)
        console.log(res.meta.status)

        if (res.meta.status !== 200) {
          return this.$message.error("更新用户信息失败！")
        }
        //添加用户成功关闭对话框
        this.editDialogVisible = false
        //刷新用户列表数据
        this.getUserList()
        //如果添加成功，则返回成功的提示消息
        this.$message.success("更新用户信息成功！")
      })
    },
    //根据用户id删除用户信息
    deleteUserById(id) {
      // //弹框询问是否删除数据
      // const confirmReslut = await this.$confirm(
      //   "此操作将永久删除该用户, 是否继续?",
      //   "提示",
      //   {
      //     confirmButtonText: "确定",
      //     cancelButtonText: "取消",
      //     type: "warning"
      //   }
      // ).catch(err => err)

      // //如果用户确认删除，则返回字符串confirm
      // //如果用户取消删除，则返回值为字符串cancel
      // if (confirmReslut !== "confirm") {
      //   return this.$message.info("已取消删除")
      // }
      // const { data: res } = await this.$http.delete(`users/${id}`)
      // if (res.meta.status !== 200) {
      //   return this.$message.error("删除用户信息失败！")
      // }

      // this.$message.success("删除用户信息成功！")
      // //刷新列表数据
      // this.getUserList()
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`users/${id}`)
          if (res.meta.status !== 200) {
            return this.$message.error("删除用户信息失败！")
          }
          this.getUserList()
          this.$message({
            type: "success",
            message: "删除成功!"
          })
        })
        .catch(() => {
          this.$message.info("已取消删除")
        })
    },
    async showSetRolesDialog(userInfo) {
      this.userInfo = userInfo
      const { data: res } = await this.$http.get(`roles`)
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败")
      }
      this.$message.success("获取角色列表成功")
      this.rolesList = res.data
      console.log(res.data)

      this.setRolesDialogVisible = true
    },
    async savaRoleInfo() {
      if (!this.selectRoleId) {
        return this.$message.error("请选择新得分配角色")
      }

      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.selectRoleId
        }
      )
      console.log("==============================")
      console.log(res.data)
      console.log("==============================")
      if (res.meta.status !== "200") {
        this.$message.error("分配角色失败")
      }
      this.$message.success("分配角色成功")
      this.getUserList()
      this.setRolesDialogVisible = false
    },
    setRolesDialogClosed() {
      this.selectRoleId = ""
      this.userInfo = {}
    }
  }
}
</script>
<style lang="less" scpoed>
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, blue0, 0.15) !important;
}
.el-table {
  font-size: 12px;
}
</style>