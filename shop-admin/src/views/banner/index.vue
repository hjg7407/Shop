<template>
  <div class="banner">
    <div class="header">
      <h4 class="list">轮播图列表</h4>
      <div class="add">
        <el-button plain @click="dialogVisible = true">添加轮播图</el-button>
      </div>
    </div>
    <!-- 轮播图表格 -->
    <div class="table">
      <el-table :data="bannerList" style="width: 100%" height="100%" border>
        <el-table-column type="index" label="序号" width="100" align="center">
        </el-table-column>

        <el-table-column label="轮播图" min-width="80%" align="center">
          <template slot-scope="scope">
            <img
              :src="$baseURL + scope.row.imgPath"
              alt=""
              style="width: 300px; height: 150px"
            />
          </template>
        </el-table-column>

        <el-table-column label="操作" min-width="20%" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.banner_id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 添加轮播图对话框 -->
    <el-dialog
      class="dialog"
      title="添加轮播图"
      :visible.sync="dialogVisible"
      :before-close="handleCancel"
      width="30%"
    >
      <el-upload
        list-type="picture"
        action=""
        :auto-upload="false"
        :on-change="handleChange"
        :on-remove="handleRemove"
        :file-list="fileList"
        accept="image/jpeg,image/png,image/webp"
        ref="upload"
      >
        <el-button slot="trigger" size="small" type="primary">
          选取轮播图
        </el-button>
        <el-button
          style="margin-left: 10px"
          size="small"
          type="success"
          @click="submitUpload"
        >
          上传到服务器
        </el-button>
        <div class="el-upload__tip" slot="tip">
          只能上传jpg/png/webp文件,且每次只能上传一张图片
        </div>
      </el-upload>
      <div class="img" v-show="fileList.length === 0">
        <span>请选择轮播图</span>
      </div>
    </el-dialog>
    <!-- 删除轮播图对话框 -->
    <el-dialog title="删除轮播图" :visible.sync="deleteDialog" width="30%">
      <span>确定要删除该轮播图吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialog = false">取 消</el-button>
        <el-button type="primary" @click="deleteBanner">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Banner",
  data() {
    return {
      bannerList: [],
      dialogVisible: false,
      deleteDialog: false,
      banner_id: "",
      fileList: [],
    };
  },
  methods: {
    // 获取轮播图数据
    async getBanners() {
      let result = await this.$axios.get("/api/resources/banners");
      this.bannerList = result.data.banners;
    },
    /* // 检查图片格式是否正确
    beforeUpload(file) {
      console.log(file, file.type);
      if (file.type !== "image") {
        this.$message.error("只能上传jpg/png/webp图片");
        return false;
      }
      return true;
    }, */
    // 移除轮播图
    handleRemove() {
      this.fileList = [];
    },
    // 控制上传列表
    handleChange(file, fileList) {
      if (
        file.raw.type !== "image/jpg" &&
        file.raw.type !== "image/jpeg" &&
        file.raw.type !== "image/png" &&
        file.raw.type !== "image/webp"
      ) {
        this.$message.error("只能上传jpg/png/webp图片");
        fileList.pop();
      } else if (fileList.length > 1) {
        fileList.shift();
      }
      this.fileList = fileList;
      // console.log(file, fileList, this.fileList);
    },
    // 添加轮播图
    async submitUpload() {
      // this.$refs.upload.submit();
      if (this.fileList.length === 0) {
        this.$errorMessage("请选择要上传的文件！");
        return;
      }
      let formData = new FormData();
      formData.append("file", this.fileList[0].raw);
      let result = await this.$axios.post("/api/admin/addBanner", formData);
      if (result.data.code === "0") {
        this.$successedMessage(result.data.message);
        this.handleCancel();
        this.dialogVisible = false;
        this.getBanners();
      } else {
        this.$errorMessage(result.data.message);
      }
      // this.bannerList = result.data.banners;
    },
    // 删除轮播图
    handleDelete(banner_id) {
      this.banner_id = banner_id;
      this.deleteDialog = true;
    },
    async deleteBanner() {
      let result = await this.$axios.post("/api/admin/deleteBanner", {
        banner_id: this.banner_id,
      });
      if (result.data.code === "0") {
        for (let index in this.bannerList) {
          if (this.bannerList[index].banner_id === this.banner_id) {
            this.bannerList.splice(index, 1);
          }
        }
        this.$successedMessage(result.data.message);
      } else {
        this.$errorMessage(result.data.message);
      }
      this.deleteDialog = false;
    },
    // 关闭窗口前清除图片
    handleCancel() {
      this.$nextTick(function () {
        this.$refs.upload.clearFiles();
        this.dialogVisible = false;
      });
    },
  },
  created() {
    this.getBanners();
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
.banner {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.banner h4 {
  margin: 10px 0;
}
.table {
  flex: 1;
  overflow-y: auto;
}
.dialog >>> .el-dialog__body {
  padding: 10px 20px 30px;
  height: 200px;
}
.dialog >>> .el-upload-list--picture .el-upload-list__item-thumbnail {
  width: 135px;
}
/* 去除图片切换的离场动画 */
/* .dialog >>> .el-list-enter-active, */
.dialog >>> .el-list-leave-active {
  transition: none;
}
.img {
  height: 92px;
  text-align: center;
  line-height: 92px;
  color: rgb(102, 177, 255);
}
</style>
