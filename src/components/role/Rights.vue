<template>
  <div id="app">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 为表格添加边框线添加 border属性 为表格添加隔行变色 添加stripe属性 -->
      <el-table :data="rightsList" border stripe>
        <!-- 添加索引号 -->
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag effect="plain" type v-if="scope.row.level==='0'">一级</el-tag>
            <el-tag effect="plain" type="success" v-else-if="scope.row.level==='1'">二级</el-tag>
            <el-tag effect="plain" type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rightsList: []
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get("rights/list")
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限列表失败")
      }
      this.rightsList = res.data
    }
  }
}
</script>
<style lang="less">
</style>
