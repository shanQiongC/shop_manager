<template>
  <div id="app">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getGoosList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getGoosList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodsList" border stripe>
        <!-- 添加索引号 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格" width="95"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="70"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="140">
          <template slot-scope="scope">{{scope.row.add_time|dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="130">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="goEditGoodInfo(scope.row.goods_id)"
            ></el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteByGoodsId(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      queryInfo: {
        query: null,
        pagesize: 5,
        pagenum: 1
      },
      goodsList: [],
      total: 0
    }
  },
  created() {
    this.getGoosList()
  },
  methods: {
    async getGoosList() {
      const { data: res } = await this.$http.get(`goods`, {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        this.$message.error(获取商品列表失败)
      }
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoosList()
    },
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getGoosList()
    },

    deleteByGoodsId(goods_id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`goods/${goods_id}`)
          if (res.meta.status !== 200) {
            this.$message({
              type: "error",
              message: "删除商品失败"
            })
          }
          const { data: data } = await this.$http.put(
            `goods/${goods_id}/pics`,
            []
          )
          if (res.meta.status === 200 && data.meta.status === 200) {
            this.$message({
              type: "success",
              message: "商品删除成功，图片同步更新"
            })
          } else {
            this.$message({
              type: "success",
              message: "删除成功!"
            })
          }
          this.getGoosList()
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          })
        })
    },
    goAddpage() {
      this.$router.push("/goods/add")
    },
    goEditGoodInfo(goods_id) {
      this.$router.push(`/goods/edit/${goods_id}`)
    }
  }
}
</script>
<style lang="less">
</style>