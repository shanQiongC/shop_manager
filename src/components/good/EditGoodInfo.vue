<template>
  <div id="app">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>修改商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="修改商品信息" type="info" center show-icon :closable="false"></el-alert>
      <el-form
        class="magrin-15"
        :model="editGoodsForm"
        :rules="editGoodsFormRules"
        ref="editGoodsFormRef"
        label-width="100px"
      >
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editGoodsForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="editGoodsForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input-number v-model="editGoodsForm.goods_number"></el-input-number>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="editGoodsForm.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="商品介绍" prop="goods_introduce">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 8}"
            v-model="editGoodsForm.goods_introduce"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品参数">
          <el-collapse v-model="onlyNames" v-for="(item,index) in manyList" :key="index">
            <el-collapse-item :title="item.attr_name" :name="index">
              <el-tag
                class="tagMargin"
                v-for="(cd,index) in item.attr_vals"
                :key="index"
                closable
                @close="handleClose(index, item)"
              >{{cd}}</el-tag>
            </el-collapse-item>
          </el-collapse>
        </el-form-item>
        <el-form-item label="商品属性">
          <el-collapse v-model="manyNames" v-for="(item,index) in onlyList" :key="index">
            <el-collapse-item :title="item.attr_name" :name="index">
              <el-input v-model="item.attr_vals"></el-input>
            </el-collapse-item>
          </el-collapse>
        </el-form-item>

        <el-form-item label="商品图片">
          <el-upload
            :action="uploadURL"
            list-type="picture-card"
            :headers="headerObj"
            :on-preview="handlePictureCardPreview"
            :before-upload="beforePictureUpload"
            :on-remove="handleRemove"
            :on-success="handlePictureSuccess"
            :file-list="picList"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btnAdd" @click="saveGoodsInfo">确认修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      editGoodsForm: {},
      editGoodsFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ]
      },
      dialogImageUrl: "",
      dialogVisible: false,
      picList: [],
      //uploadURL: "http://39.98.73.4:8888/api/private/v1/upload",
      uploadURL: "https://www.liulongbin.top:8888/api/private/v1/upload",
      headerObj: {
        Authorization: window.sessionStorage.getItem("token")
      },
      manyList: [],
      onlyList: [],
      manyNames: ["0"],
      onlyNames: ["0"]
    }
  },
  created() {
    this.getGoodInfo()
  },
  computed: {
    goodsId() {
      const hash = window.location.hash
      const goods_id = hash.substring(hash.lastIndexOf("/") + 1, hash.length)
      return goods_id
    }
  },
  methods: {
    async getGoodInfo() {
      const { data: res } = await this.$http.get(`goods/${this.goodsId}`)
      if (res.meta.status !== 200) {
        return this.$message.error("查询商品失败")
      }
      this.editGoodsForm = res.data
      console.log(res.data)

      res.data.pics.forEach(item => {
        const newInfo = { url: item.pics_big_url }
        this.picList.push(newInfo)
      })
      this.editGoodsForm.attrs.forEach(item => {
        if (item.attr_sel === "many") {
          this.manyList.push(item)
        } else {
          this.onlyList.push(item)
        }
      })
      this.manyList.forEach(item => {
        item.attr_vals =
          item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ")
      })
    },
    handlePictureSuccess(response) {
      //拼接得到一个图片信息对象
      const picInfo = {
        pic: response.data.tmp_path
      }
      //将图片对象,push到oics数组中
      this.editGoodsForm.pics.push(picInfo)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    async handleRemove(file, fileList) {
      const ruslt = this.editGoodsForm.pics.find(item => {
        return file.url === item.pics_big_url
      })
      const index = this.editGoodsForm.pics.indexOf(ruslt)
      this.editGoodsForm.pics.splice(index, 1)
    },
    //图片上传前调用
    beforePictureUpload(file) {
      const isJPG = file.type === "image/jpeg"
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!")
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!")
      }
      return isJPG && isLt2M
    },
    saveGoodsInfo() {
      this.$refs.editGoodsFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error("请填写必要的表单项！")
        }
        // this.editGoodsForm.attrs = []
        // this.manyList.forEach(item => {
        //   const newInfo = {
        //     attr_id: item.attr_id,
        //     attr_value: item.attr_vals.join(" ")
        //   }
        //   this.editGoodsForm.attrs.push(newInfo)
        // })
        // this.editGoodsForm.attrs.push(this.manyList)
        // this.onlyList.forEach(item => {
        //   const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
        //   this.editGoodsForm.attrs.push(newInfo)
        // })

        const { data: res } = await this.$http.put(
          `goods/${this.editGoodsForm.goods_id}`,
          this.editGoodsForm
        )
        if (res.meta.status !== 200) {
          return this.$message.error("修改商品信息失败")
        }
        this.$message.success("修改信息成功")
        this.$router.push("/goods")
      })
    },
    handleClose(index, arrt) {
      arrt.attr_vals.splice(index, 1)
    }
  }
}
</script>
<style lang="less">
.magrin-15 {
  margin-top: 20px;
}
</style>