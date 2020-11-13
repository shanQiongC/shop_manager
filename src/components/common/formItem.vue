<template>
  <div class="container">
    <el-form :model="form" :rules="formRules" ref="addFormRef" label-width="80px">
      <el-form-item
        v-for="(item,index) in formConfig"
        :key="index"
        :label="item.label"
        :prop="item.prop"
      >
        <el-input v-model="form[item.prop]"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    labelWidth: {
      type: String,
      default: "100px"
    },
    size: {
      type: String,
      default: "small"
    },
    editCfg: {
      type: Array,
      default: () => []
    },
    editData: {
      type: Object,
      default: () => {}
    },
    editRules: {
      type: Object,
      default: null
    }
  },
  data() {
    return {}
  },
  methods: {
    // getThat(){
    //     this.$emit('that',this)
    // }
  }
}
</script>

<style scoped lang="scss">
</style>
