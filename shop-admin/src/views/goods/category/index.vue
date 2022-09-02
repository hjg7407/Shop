<template>
  <div class="category">
    <div class="header">
      <h4 class="title">商品分类</h4>
      <div class="add">
        <el-button plain @click="dialogVisible = true">添加商品分类</el-button>
      </div>
    </div>
    <!-- 轮播图表格 -->
    <div class="table">
      <el-table :data="categoryList" style="width: 100%" height="100%" border>
        <el-table-column type="index" label="序号" width="100" align="center">
        </el-table-column>

        <el-table-column
          prop="category_name"
          label="商品分类名"
          min-width="20%"
          align="center"
        >
        </el-table-column>

        <el-table-column label="商品分类图" min-width="60%" align="center">
          <template slot-scope="scope">
            <img
              :src="$baseURL + scope.row.category_img"
              alt=""
              style="width: 50px; height: 100px"
            />
          </template>
        </el-table-column>

        <el-table-column label="操作" min-width="20%" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEdit(scope.row.category_id)"
            >
              编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.category_id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 添加商品分类对话框 -->
    <el-dialog
      class="dialog"
      :class="{ hide: uploadHide }"
      title="添加商品分类"
      :visible.sync="dialogVisible"
      :before-close="handleCancel"
      width="35%"
    >
      <el-form :model="categoryForm" :rules="rules" ref="categoryForm">
        <el-form-item
          label="商品分类名"
          label-width="150px"
          prop="category_name"
        >
          <el-input
            v-model="categoryForm.category_name"
            style="width: 80%"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品分类图" label-width="150px" prop="fileList">
          <el-upload
            list-type="picture-card"
            action=""
            :auto-upload="false"
            :on-remove="handleRemove"
            :on-change="handleChange"
            :file-list="categoryForm.fileList"
            :limit="1"
            accept="image/jpeg,image/png,image/webp"
            ref="upload"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="addCategory">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 删除商品分类对话框 -->
    <el-dialog title="删除商品分类" :visible.sync="deleteDialog" width="30%">
      <span>确定要删除该商品分类吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialog = false">取 消</el-button>
        <el-button type="primary" @click="deleteCategory">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑商品分类对话框 -->
    <el-dialog
      class="dialog"
      :class="{ hide: uploadHide }"
      title="编辑商品分类"
      :visible.sync="editDialog"
      :before-close="handleCancel"
      width="35%"
    >
      <el-form :model="categoryForm" :rules="rules" ref="editForm">
        <el-form-item
          label="商品分类名"
          label-width="150px"
          prop="category_name"
        >
          <el-input
            v-model="categoryForm.category_name"
            style="width: 80%"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品分类图" label-width="150px" prop="fileList">
          <el-upload
            list-type="picture-card"
            action=""
            :auto-upload="false"
            :on-remove="handleRemove"
            :on-change="handleChange"
            :file-list="categoryForm.fileList"
            :limit="1"
            accept="image/jpeg,image/png,image/webp"
            ref="uploadEdit"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="editCategory">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "GoodsCategory",
  data() {
    let imgValidate = (rule, value, callback) => {
      if (this.categoryForm.fileList.length === 0) {
        callback(new Error("请选择商品分类图"));
      } else {
        callback();
      }
    };
    return {
      isEdit: false,
      categoryList: [],
      dialogVisible: false,
      deleteDialog: false,
      editDialog: false,
      category_id: "",
      categoryForm: {
        category_name: "",
        fileList: [],
      },
      rules: {
        category_name: [
          {
            required: true,
            message: "商品分类名不能为空",
            trigger: "blur",
          },
        ],
        fileList: [
          {
            validator: imgValidate,
            trigger: "change",
          },
        ],
      },
      uploadHide: false,
    };
  },
  methods: {
    // 获取商品分类数据
    async getCategory() {
      let result = await this.$axios.get("/api/goods/category");
      this.categoryList = result.data.category;
    },
    // 添加商品分类
    handleChange(file, fileList) {
      // console.log(file, fileList);
      if (
        file.raw.type !== "image/jpg" &&
        file.raw.type !== "image/jpeg" &&
        file.raw.type !== "image/png" &&
        file.raw.type !== "image/webp"
      ) {
        this.$message.error("只能上传jpg/png/webp图片");
        fileList.pop();
      }
      this.categoryForm.fileList = fileList;
      this.uploadHide = this.categoryForm.fileList.length >= 1;
      if (this.categoryForm.fileList.length !== 0) {
        if (this.isEdit) {
          this.$refs.editForm.clearValidate("fileList");
        } else {
          this.$refs.categoryForm.clearValidate("fileList");
        }
      }
    },
    handleRemove() {
      this.categoryForm.fileList = [];
      this.uploadHide = this.categoryForm.fileList.length >= 1;
      if (this.isEdit) {
        this.$refs.editForm.validateField("fileList");
      } else {
        this.$refs.categoryForm.validateField("fileList");
      }
    },
    addCategory() {
      this.$nextTick(function () {
        this.$refs.categoryForm.validate(async (valid) => {
          if (valid) {
            let formData = new FormData();
            formData.append("file", this.categoryForm.fileList[0].raw);
            formData.append("category_name", this.categoryForm.category_name);
            let result = await this.$axios.post(
              "/api/admin/addCategory",
              formData
            );
            if (result.data.code === "0") {
              this.$successedMessage(result.data.message);
              this.dialogVisible = false;
              this.getCategory();
            } else {
              this.$errorMessage(result.data.message);
            }
          }
        });
      });
    },
    // 编辑商品分类
    handleEdit(category_id) {
      this.category_id = category_id;
      this.editDialog = true;
      this.isEdit = true;
      this.uploadHide = true;
      for (let value of this.categoryList) {
        if (value.category_id === category_id) {
          this.categoryForm.category_name = value.category_name;
          this.categoryForm.fileList = [
            {
              name: value.category_name,
              url: this.$baseURL + value.category_img,
            },
          ];
        }
      }
    },
    async editCategory() {
      // console.log(this.categoryForm.fileList[0].raw);
      this.$nextTick(function () {
        this.$refs.editForm.validate(async (valid) => {
          if (valid) {
            let formData = new FormData();
            if (this.categoryForm.fileList[0].raw) {
              formData.append("file", this.categoryForm.fileList[0].raw);
            }
            formData.append("category_name", this.categoryForm.category_name);
            formData.append("category_id", this.category_id);
            let result = await this.$axios.post(
              "/api/admin/editCategory",
              formData
            );
            if (result.data.code === "0") {
              this.$successedMessage(result.data.message);
              this.editDialog = false;
              this.getCategory();
            } else {
              this.$errorMessage(result.data.message);
            }
            this.isEdit = false;
          }
        });
      });
    },
    // 删除商品分类
    handleDelete(category_id) {
      this.category_id = category_id;
      this.deleteDialog = true;
    },
    async deleteCategory() {
      let result = await this.$axios.post("/api/admin/deleteCategory", {
        category_id: this.category_id,
      });
      if (result.data.code === "0") {
        for (let index in this.categoryList) {
          if (this.categoryList[index].category_id === this.category_id) {
            this.categoryList.splice(index, 1);
          }
        }
        this.$successedMessage(result.data.message);
      } else {
        this.$errorMessage(result.data.message);
      }
      this.deleteDialog = false;
    },
    // 关闭窗口前清除表单
    handleCancel() {
      this.$nextTick(function () {
        this.uploadHide = false;
        this.categoryForm.category_name = "";
        this.categoryForm.fileList = [];
        if (this.isEdit) {
          this.isEdit = false;
          this.editDialog = false;
          this.$refs.uploadEdit.clearFiles();
          this.$refs.editForm.clearValidate();
        } else {
          this.dialogVisible = false;
          this.$refs.upload.clearFiles();
          this.$refs.categoryForm.resetFields();
        }
      });
    },
  },
  created() {
    this.getCategory();
  },
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 5px 0;
  padding: 0 10px;
  border: 1px solid rgb(238, 238, 245);
}
.category {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.category h4 {
  margin: 10px 0;
}
.table {
  flex: 1;
  overflow-y: auto;
}
.dialog >>> .el-dialog__body {
  padding: 20px 20px 0;
}
.dialog >>> .el-upload-list__item,
.dialog >>> .el-upload--picture-card {
  width: 155px;
  height: 270px;
  line-height: 270px;
}
.dialog >>> .el-form-item__content {
  line-height: 0;
}
.dialog >>> .el-upload-list--picture-card .el-upload-list__item {
  margin: 0;
}
/* 去除图片切换的离场动画 */
/* .dialog >>> .el-list-enter-active, */
.dialog >>> .el-list-leave-active {
  transition: none;
}
.hide >>> .el-upload--picture-card {
  display: none;
}
</style>
