<template>
  <div class="add">
    <div class="add-title">
      <h4>{{ title }}</h4>
    </div>
    <div class="add-content">
      <el-form
        class="form"
        ref="form"
        :model="form"
        label-width="100px"
        :rules="rule"
      >
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input
                v-model="form.goods_name"
                placeholder="商品名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品货号" prop="goods_code">
              <el-input
                v-model="form.goods_code"
                placeholder="商品货号"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品分类" prop="category_id">
              <el-select
                v-model="form.category_id"
                placeholder="请选择商品分类"
                style="width: 100%"
              >
                <el-option
                  v-for="item in categoryList"
                  :key="item.category_id"
                  :label="item.category_name"
                  :value="item.category_id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="商品卖点" prop="goods_title">
              <el-input
                v-model="form.goods_title"
                placeholder="商品卖点"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="商品描述" prop="goods_info">
              <el-input
                type="textarea"
                v-model="form.goods_info"
                placeholder="商品描述"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :class="{ hide1: uploadHide1 }">
          <el-col :span="10">
            <el-form-item label="商品图片" prop="goods_picture">
              <el-upload
                list-type="picture-card"
                action=""
                :auto-upload="false"
                :on-remove="handleRemove1"
                :on-change="handleChange1"
                :file-list="form.goods_picture"
                :limit="1"
                accept="image/jpeg,image/png,image/webp"
                ref="upload1"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="市场价格" prop="goods_price">
              <el-input
                v-model="form.goods_price"
                placeholder="市场价格"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="销售价格" prop="goods_selling_price">
              <el-input
                v-model="form.goods_selling_price"
                placeholder="销售价格"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品库存" prop="goods_number">
              <el-input
                v-model="form.goods_number"
                placeholder="商品库存"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :class="{ hide2: uploadHide2 }">
          <el-col>
            <el-form-item label="商品轮播图" prop="goods_banner">
              <el-upload
                list-type="picture-card"
                action=""
                :auto-upload="false"
                :on-remove="handleRemove2"
                :on-change="handleChange2"
                :file-list="form.goods_banner"
                :limit="5"
                accept="image/jpeg,image/png,image/webp"
                ref="upload2"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" :offset="2">
            <el-button class="reset" @click="resetForm">重 置</el-button>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" @click="addForm">保 存</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddGoods",
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
    goods_id: {
      type: Number,
    },
  },
  data() {
    let imgValidate1 = (rule, value, callback) => {
      if (this.form.goods_picture.length === 0) {
        callback(new Error("请选择商品图片"));
      } else {
        callback();
      }
    };
    let imgValidate2 = (rule, value, callback) => {
      if (this.form.goods_banner.length === 0) {
        callback(new Error("请选择商品轮播图"));
      } else {
        callback();
      }
    };
    return {
      form: {
        goods_name: "",
        goods_code: "",
        category_id: "",
        goods_title: "",
        goods_info: "",
        goods_picture: [],
        goods_price: "",
        goods_selling_price: "",
        goods_number: "",
        goods_banner: [],
      },
      categoryList: [],
      uploadHide1: false,
      uploadHide2: false,
      deleteBanner: [],
      rule: {
        goods_name: [
          {
            required: true,
            message: "请输入商品名称",
            trigger: "blur",
          },
        ],
        goods_code: [
          {
            required: true,
            message: "请输入商品货号",
            trigger: "blur",
          },
        ],
        category_id: [
          {
            required: true,
            message: "请选择商品分类",
            trigger: "change",
          },
        ],
        goods_picture: [
          {
            validator: imgValidate1,
            trigger: "change",
          },
        ],
        goods_price: [
          {
            required: true,
            message: "市场价格不能为空",
            trigger: "blur",
          },
          {
            pattern:
              /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
            message: "市场价格只能为数值类型,可保留两位小数",
            trigger: "blur",
          },
        ],
        goods_selling_price: [
          {
            required: true,
            message: "销售价格不能为空",
            trigger: "blur",
          },
          {
            pattern:
              /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
            message: "销售价格只能为数值类型,可保留两位小数",
            trigger: "blur",
          },
        ],
        goods_number: [
          {
            required: true,
            message: "商品库存不能为空",
            trigger: "blur",
          },
          {
            pattern: /(^[1-9]([0-9]+)?)/,
            message: "商品库存只能为数值类型",
            trigger: "blur",
          },
        ],
        goods_banner: [
          {
            validator: imgValidate2,
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    // 获取商品分类数据
    async getCategory() {
      let result = await this.$axios.get("/api/goods/category");
      this.categoryList = result.data.category;
    },
    handleChange1(file, fileList) {
      if (
        file.raw.type !== "image/jpg" &&
        file.raw.type !== "image/jpeg" &&
        file.raw.type !== "image/png" &&
        file.raw.type !== "image/webp"
      ) {
        this.$message.error("只能上传jpg/png/webp图片");
        fileList.pop();
      }
      this.form.goods_picture = fileList;
      this.uploadHide1 = this.form.goods_picture.length >= 1;
      if (this.form.goods_picture.length !== 0) {
        this.$refs.form.clearValidate("goods_picture");
      }
    },
    handleRemove1() {
      this.form.goods_picture = [];
      this.uploadHide1 = this.form.goods_picture.length >= 1;
      this.$refs.form.validateField("goods_picture");
    },
    handleChange2(file, fileList) {
      if (
        file.raw.type !== "image/jpg" &&
        file.raw.type !== "image/jpeg" &&
        file.raw.type !== "image/png" &&
        file.raw.type !== "image/webp"
      ) {
        this.$message.error("只能上传jpg/png/webp图片");
        fileList.pop();
      }
      this.form.goods_banner = fileList;
      this.uploadHide2 = this.form.goods_banner.length >= 5;
      if (this.form.goods_banner.length !== 0) {
        this.$refs.form.clearValidate("goods_banner");
      }
    },
    handleRemove2(file, fileList) {
      // console.log(file, fileList);
      // 获取删除的轮播图图片
      this.deleteBanner.push(file.name);
      this.form.goods_banner = fileList;
      this.uploadHide2 = this.form.goods_banner.length >= 5;
      this.$refs.form.validateField("goods_banner");
    },
    // 重置表单
    resetForm() {
      if (this.isEdit) {
        this.editInit();
      } else {
        this.goods_name = "";
        this.goods_code = "";
        this.category_id = "";
        this.goods_title = "";
        this.goods_info = "";
        this.goods_picture = [];
        this.goods_price = "";
        this.goods_selling_price = "";
        this.goods_number = "";
        this.goods_banner = [];
        this.uploadHide1 = false;
        this.uploadHide2 = false;
        this.$refs.upload1.clearFiles();
        this.$refs.upload2.clearFiles();
      }
      this.$refs.form.resetFields();
    },
    // 添加或编辑商品
    addForm() {
      this.$nextTick(function () {
        this.$refs.form.validate(async (valid) => {
          if (valid) {
            if (this.isEdit) {
              let formData = new FormData();
              let { goods_picture, goods_banner, ...formTemp } = this.form;
              if (this.form.goods_picture[0].raw) {
                formData.append("file", this.form.goods_picture[0].raw);
              }
              for (let key in this.form.goods_banner) {
                if (this.form.goods_banner[key].raw) {
                  formData.append(
                    `goods_banner${key}`,
                    this.form.goods_banner[key].raw
                  );
                }
              }
              formData.append("form", JSON.stringify(formTemp));
              formData.append("goods_id", this.goods_id);
              formData.append(
                "deleteBanner",
                JSON.stringify(this.deleteBanner)
              );
              let result = await this.$axios.post(
                "/api/admin/editGoods",
                formData
              );
              if (result.data.code === "0") {
                this.$successedMessage(result.data.message);
                this.$bus.$emit("update", false);
              } else {
                this.$errorMessage(result.data.message);
              }
            } else {
              let formData = new FormData();
              let { goods_picture, goods_banner, ...formTemp } = this.form;
              // console.log(formTemp);
              formData.append("file", this.form.goods_picture[0].raw);
              for (let key in this.form.goods_banner) {
                formData.append(
                  `goods_banner${key}`,
                  this.form.goods_banner[key].raw
                );
              }
              formData.append("form", JSON.stringify(formTemp));
              let result = await this.$axios.post(
                "/api/admin/addGoods",
                formData
              );
              if (result.data.code === "0") {
                this.$successedMessage(result.data.message);
                this.dialogVisible = false;
                this.resetForm();
              } else {
                this.$errorMessage(result.data.message);
              }
            }
          }
        });
      });
    },
    // 初始化编辑信息
    editInit() {
      // console.log(this.goods_id);
      if (this.goods_id) {
        this.$axios
          .post("/api/goods/details", { goodsId: this.goods_id })
          .then((resolve) => {
            // console.log(resolve.data.goodsDetails[0]);
            this.form.goods_name = resolve.data.goodsDetails[0].goods_name;
            this.form.goods_code = resolve.data.goodsDetails[0].goods_code;
            this.form.category_id = resolve.data.goodsDetails[0].category_id;
            this.form.goods_title = resolve.data.goodsDetails[0].goods_title;
            this.form.goods_info = resolve.data.goodsDetails[0].goods_info;
            this.form.goods_picture = [
              {
                name: this.goods_id,
                url: this.$baseURL + resolve.data.goodsDetails[0].goods_picture,
              },
            ];
            this.uploadHide1 = true;
            this.form.goods_price = resolve.data.goodsDetails[0].goods_price;
            this.form.goods_selling_price =
              resolve.data.goodsDetails[0].goods_selling_price;
            this.form.goods_number = resolve.data.goodsDetails[0].goods_number;
          });
        this.$axios
          .post("/api/goods/banners", { goodsId: this.goods_id })
          .then((resolve) => {
            let temp = [];
            for (let value of resolve.data.goodsBanners) {
              temp.push({
                name: value.goods_banner_id,
                url: this.$baseURL + value.goods_banner_imgPath,
              });
            }
            this.form.goods_banner = temp;
            if (resolve.data.goodsBanners.length >= 5) {
              this.uploadHide2 = true;
            }
          });
      }
    },
  },
  computed: {
    title() {
      if (this.isEdit) return "编辑商品";
      return "添加商品";
    },
  },
  created() {
    this.getCategory();
    this.editInit();
  },
};
</script>

<style scoped>
.add {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.add-title {
  margin: 5px 0 10px;
  padding: 0 10px;
  border: 1px solid rgb(238, 238, 245);
}
.add-title h4 {
  margin: 10px 0;
}
.add-content {
  flex: 1;
  height: 100%;
  padding: 10px;
  overflow-y: hidden;
  border: 1px solid rgb(238, 238, 245);
}
.add-content >>> .el-form {
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
}
.form >>> .el-form-item__content {
  line-height: 0;
}
.form >>> .el-upload-list--picture-card .el-upload-list__item {
  margin-bottom: 0;
}
.hide1 >>> .el-upload--picture-card {
  display: none;
}
.hide2 >>> .el-upload--picture-card {
  display: none;
}
</style>
