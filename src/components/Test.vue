<template>
  <!--vue国产框架 尤雨溪创建者-->
  <!--
      vue的使用
      声明式渲染>组件系统>客户端路由>集中式状态管理>项目构建

      vue的基本使用步骤
      1、需要提供标签用于填充数据
      2、引入vue.js库文件
      3、可以使用vue语法做功能
      4、把vue提供的数据填充到标签里面
  -->

  <div id="app">nihao {{msg}}</div>
</template>
<script>
export default {
  data() {
    return {
      msg: "hello"
    };
  }
};
</script>
<style lang="less">
</style>