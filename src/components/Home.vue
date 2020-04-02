<template>
  <div id="app">
    <!-- -->
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>
<script>
export default {
  methods: {
    logout() {
      /* 退出功能
        实现原理，销毁本地的token
        基于token的方式实现退出功能是比较简单的，只要销毁本地的token即可，
        这样后续的请求就不会携带token，必须重新登录生成一个新的token之后才能访问页面
        实现代码
    */
      window.sessionStorage.clear()
      this.$router.push("/login")
    }
  }
}
</script>
<style lang="less" >
</style>
