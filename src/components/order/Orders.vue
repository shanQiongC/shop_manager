

<template>
  <div id="app">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input
            v-model="queryInfo.query"
            placeholder="请输入内容"
            class="input-with-select"
            clearable
            @clear="getOrdersList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getOrdersList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="ordersList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="95"></el-table-column>
        <el-table-column label="是否已付" width="130">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status===0">未付款</el-tag>
            <el-tag type="danger" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="80"></el-table-column>
        <el-table-column label="下单时间" width="180">
          <template slot-scope="scope">{{scope.row.create_time|dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="130">
          <template>
            <!-- 修改按钮 -->
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showBox"></el-button>
            <el-button type="success" size="mini" icon="el-icon-location" @click="showProgressBox"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>
    <el-dialog title="提示" :visible.sync="addresVisible" width="30%" @close="addressDialogClosed">
      <el-form
        :model="addressform"
        :rules="addressformrRules"
        ref="addressformRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="addres1">
          <el-cascader
            v-model="addressform.addres1"
            :options="cityData"
            :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="addres1">
          <el-input v-model="addressform.addres2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addresVisible = false">取 消</el-button>
        <el-button type="primary" @click="addresVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="订单物流" :visible.sync="progresVisible" width="50%">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>
<script>
import cityData from "./citydata.js"
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagesize: 5,
        pagenum: 1
      },
      ordersList: [],
      total: 0,
      addresVisible: false,
      addressform: {
        addres1: [],
        addres2: ""
      },
      addressformrRules: {
        addres1: [
          { required: true, message: "请选择省市区/县", trigger: "blur" }
        ],
        addres2: [
          { required: true, message: "请填写纤细地址", trigger: "blur" }
        ]
      },
      cityData: cityData,
      progresVisible: false,
      progressInfo: []
    }
  },
  created() {
    this.getOrdersList()
  },
  methods: {
    async getOrdersList() {
      const { data: res } = await this.$http.get(`orders`, {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        this.$message.error("获取订单列表失败")
      }
      this.ordersList = res.data.goods
      this.total = res.data.total

      console.log(res)
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrdersList()
    },
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getOrdersList()
    },
    showBox() {
      this.addresVisible = true
    },
    addressDialogClosed() {
      this.$refs.addressformRef.resetFields()
    },
    async showProgressBox() {
      const { data: res } = await this.$http.get(`/kuaidi/804909574412544580`)
      if (res.meta.status !== 200) {
        this.$message.error("获取物流信息失败")
      }
      this.progressInfo = res.data
      console.log(this.progressInfo)

      this.progresVisible = true
    }
  }
}
</script>
<style lang="less" scpoed>
.el-table {
  font-size: 12px;
}
</style>