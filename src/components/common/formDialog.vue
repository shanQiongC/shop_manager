
<template>
  <el-button :type="addBtnType" :icon="addBtnIcon" @click="toggleDialog(true)">
    <slot>{{addBtnText}}</slot>
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialogvisible"
      append-to-body
      @close="addDialogClosed"
    >
      <slot name="tips"></slot>
      <el-form :model="dialog.form" :rules="dialog.formRules" ref="addFormRef" label-width="80px">
        <el-form-item
          v-for="(item,index) in dialog.formConfig"
          :key="index"
          :label="item.label"
          :prop="item.prop"
        >
          <el-input v-model="dialog.form[item.prop]"></el-input>
        </el-form-item>
      </el-form>
      <template slot="footer">
        <el-button type="primary" @click="confirm">确认</el-button>
      </template>
    </el-dialog>
  </el-button>
</template>
<script>
export default {
  props: {
    dialog: {
      type: Object,
      default: () => ({})
    },
    form: {
      type: Object,
      default: () => ({})
    },
    formConfig: {
      type: Array,
      default: () => []
    },

    formRules: {
      type: Object,
      default: () => ({})
    },
    addButton: {
      type: Object,
      default: () => ({})
    },

    beforeOpen: {
      type: Function,
      default: () => true
    },
    perPage: {
      type: Number,
      default: 10
    },
    loadList: {
      type: Function,
      default: () => Promise.resolve(0)
    }
  },
  data() {
    return {
      dialogvisible: false,
      pagination: {
        page: 1,
        size: this.perPage
      },
      queryItems: {}
    }
  },
  computed: {
    addBtnType() {
      return this.addButton.type || "primary"
    },
    addBtnText() {
      return this.addButton.text || "增加"
    },
    addBtnIcon() {
      return this.addButton.icon || " "
    }
  },
  created() {},
  methods: {
    loadListData() {
      return new Promise((resolve, reject) => {
        try {
          resolve(
            this.loadList({
              pagenum: this.pagination.page,
              pagesize: this.pagination.size,
              query: this.queryItems
            })
          )
        } catch (e) {
          reject(e)
        }
      })
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    toggleDialog(dialogvisible) {
      if (this.beforeOpen()) {
        this.$set(this, "dialogvisible", dialogvisible)
      }
      // this.$set(this, "visible", dialogvisible)
    },
    confirm() {
      console.log(this.dialog.form.username)
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        //f发起网络请求，添加用户
        const { data: res } = await this.$http.post("users", this.dialog.form)
        if (res.meta.status !== 201) {
          return this.$message.error("添加用户失败！")
        }
        //如果添加成功，则返回成功的提示消息
        this.$message.success("添加用户成功！")
        //添加用户成功关闭对话框

        this.dialogvisible = false
        //重新获取用户列表数据
        this.loadListData()
      })
    }
  }
  // render(h) {
  //   const elformitems = this.elformitems.map((formitem, index) => {
  //     return (
  //       <el-form-item key={index} label={formitem.label} prop={formitem.prop}>
  //         <el-input vModel={item.formitem}></el-input>
  //       </el-form-item>
  //     )
  //   })
  //   return (
  //     <div>

  //     </div>
  //   )
  // }
}
</script>

<style lang="scss" scoped>
</style>
