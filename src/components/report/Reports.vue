<template>
  <div id="app">
    <el-card>
      <div id="main" style="width: 800px;height:400px;"></div>
    </el-card>
  </div>
</template>
<script>
import merge from "lodash/merge"
export default {
  data() {
    return {
      option: {
        title: {
          text: "用户来源"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3"
            }
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ]
      }
    }
  },

  async mounted() {
    const { data: res } = await this.$http.get("reports/type/1")
    if (res.meta.status != 200) {
      this.$message.error("获取报表数据失败！")
    }
    this.$message.success("获取报表数据成功！")

    // 基于准备好的dom，初始化echarts实例
    var myChart = this.$echarts.init(document.getElementById("main"))
    //将两个对象合并
    const result = merge(res.data, this.option)
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(result)
  }
}
</script>
<style lang="less">
</style>