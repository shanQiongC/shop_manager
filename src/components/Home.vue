<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse?'64px' :'200px'">
        <!-- 菜单栏展开按钮 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区 -->
        <el-menu
          background-color="#373d41"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!--router开启路由模式 
              default-active  当前激活菜单的 index
          -->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单 -->
            <template slot="title">
              <!-- 图表 -->
              <i :class="iconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/'+subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="savaNavState('/'+subItem.path)"
            >
              <template slot="title">
                <!-- 图表 -->
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体 -->
      <el-main>
        <!-- 路由占位符 welcome页面-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      menuList: [],
      iconObj: {
        "125": "iconfont icon-user",
        "103": "iconfont icon-tijikongjian",
        "101": "iconfont icon-shangpin",
        "102": "iconfont icon-danju",
        "145": "iconfont icon-baobiao"
      },
      isCollapse: false, //是否折叠 false默认不折叠
      activePath: "" //被激活的链接地址
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem("activePath")
  },
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
      this.$message.warning("退出登录")

      //   通过请求拦截器添加token,保证拥有获取数据的权限
    },
    //获取所有的菜单
    async getMenuList() {
      const { data } = await this.$http.get("menus")
      if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
      console.log(data.data)
      this.menuList = data.data
    },
    //点击收起菜单
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    //保存链接的激活状态
    savaNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath)
      this.activePath = activePath
    }
  }
}
</script>
<style lang="less" >
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  //flex布局,两边对齐
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center; //按钮居中
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    > img {
      height: 40px;
      width: 40px;
    }
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #373d41;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #f0f0f0;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  padding: 5px 0 5px 0;
  font-size: 16px;
  color: #fff;
  text-align: center; //居中显示
  letter-spacing: 0.2rem; //让线条之间由分隔
  cursor: pointer; //鼠标放上去是一个小手
}
</style>
