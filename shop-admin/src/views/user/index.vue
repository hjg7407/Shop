<template>
  <div class="order">
    <div class="search">
      <div class="search-title">
        <h4>搜索条件</h4>
      </div>
      <el-form ref="form" :model="form" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="用户名：">
              <el-input v-model="form.username" placeholder="用户名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号：">
              <el-input v-model="form.phone" placeholder="手机号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button
              style="margin-left: 20px"
              type="primary"
              @click="searchForm"
              >查询结果</el-button
            >
            <el-button class="reset" @click="resetForm">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="content">
      <div class="content-title">
        <h4>用户列表</h4>
      </div>
      <div class="order-list">
        <el-table
          :data="userList"
          ref="table"
          style="width: 100%"
          height="99%"
          border
        >
          <el-table-column
            type="index"
            :index="typeIndex"
            label="序号"
            width="80"
            align="center"
          >
          </el-table-column>

          <el-table-column
            prop="username"
            label="用户名"
            min-width="10%"
            align="center"
          >
          </el-table-column>

          <el-table-column
            prop="phone"
            label="手机号"
            min-width="10%"
            align="center"
          >
          </el-table-column>

          <el-table-column
            prop="phone"
            label="是否拥有管理员权限"
            min-width="10%"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.isAdmin | adminFilter }}
            </template>
          </el-table-column>

          <el-table-column label="操作" min-width="10%" align="center">
            <template slot-scope="scope">
              <el-button
                style="margin-right: 10px"
                size="mini"
                type="primary"
                v-show="!scope.row.isAdmin"
                @click="handleReset(scope.row.user_id)"
                >重置密码</el-button
              >
              <el-button
                style="margin-left: 10px"
                size="mini"
                type="danger"
                v-show="!scope.row.isAdmin"
                @click="handleDelete(scope.row.user_id)"
                >注销</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <!-- 重置密码对话框 -->
    <el-dialog title="重置密码" :visible.sync="resetDialog" width="30%">
      <span>确定要将该用户的密码重置为123456吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetDialog = false">取 消</el-button>
        <el-button type="primary" @click="resetPassword">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 注销用户对话框 -->
    <el-dialog title="注销用户" :visible.sync="deleteDialog" width="30%">
      <span>确定要注销该用户吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialog = false">取 消</el-button>
        <el-button type="primary" @click="deleteUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "User",
  data() {
    return {
      form: {
        // 搜索条件
        username: "",
        phone: "",
      },
      userList: [],
      total: 0, // 商品总量
      pageSize: 10, // 每页显示的商品数量
      currentPage: 1, //当前页码
      user_id: "", //需要操作的用户id
      resetDialog: false, //控制重置密码对话框
      deleteDialog: false, //控制注销用户对话框
    };
  },
  methods: {
    //获取用户列表数据
    async getUserList() {
      let result = await this.$axios.post("/api/admin/searchUser", {
        search: this.form,
        currentPage: this.currentPage,
        pageSize: this.pageSize,
      });
      this.userList = result.data.userList;
      this.total = result.data.total;
    },
    // 搜索用户
    searchForm() {
      this.getUserList();
    },
    // 重置表单
    resetForm() {
      this.form.username = "";
      this.form.phone = "";
    },
    // 改变每页显示数量
    handleSizeChange(value) {
      this.pageSize = value;
    },
    // 改变当前页数
    handleCurrentChange(value) {
      // console.log(value);
      this.currentPage = value;
      // 页数变化时滚动条置顶
      this.$nextTick(() => {
        this.$refs.table.bodyWrapper.scrollTop = 0;
      });
    },
    // 让序号递增
    typeIndex(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1;
    },
    // 设置需要重置密码的用户id
    handleReset(user_id) {
      this.user_id = user_id;
      this.resetDialog = true;
    },
    // 重置密码
    async resetPassword() {
      let result = await this.$axios.post("/api/admin/resetPassword", {
        user_id: this.user_id,
      });
      // 关闭对话框
      this.resetDialog = false;
      if (result.data.code === "0") {
        // 重置成功，提示成功信息
        this.$successedMessage(result.data.message);
      } else {
        // 重置失败，提示失败信息
        this.$errorMessage(result.data.message);
      }
    },
    // 设置需要注销用户的用户id
    handleDelete(user_id) {
      this.user_id = user_id;
      this.deleteDialog = true;
    },
    // 注销用户
    async deleteUser() {
      let result = await this.$axios.post("/api/admin/deleteUser", {
        user_id: this.user_id,
      });
      // 关闭对话框
      this.deleteDialog = false;
      if (result.data.code === "0") {
        // 注销成功，提示成功信息
        this.$successedMessage(result.data.message);
        // 将用户从用户列表删除
        for (let index in this.userList) {
          if (this.userList[index].user_id === this.user_id) {
            this.userList.splice(index, 1);
          }
        }
      } else {
        // 注销失败，提示失败信息
        this.$errorMessage(result.data.message);
      }
    },
  },
  created() {
    this.getUserList();
  },
  watch: {
    // 监视当前页的变化
    currentPage() {
      this.getUserList();
    },
    // 监视每页条数的变化
    pageSize() {
      this.getUserList();
    },
  },

  filters: {
    // 管理员过滤器
    adminFilter(value) {
      if (value === 1) {
        return "是";
      } else {
        return "否";
      }
    },
  },
};
</script>

<style scoped>
.order {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}
.search {
  margin: 5px 0 10px;
  border: 1px solid rgb(238, 238, 245);
}
.search-title {
  margin: 5px 0 25px;
  padding: 0 10px;
  border-bottom: 1px solid rgb(238, 238, 245);
}
.content {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: hidden;
}
.content-title {
  padding: 0 10px;
  border: 1px solid rgb(238, 238, 245);
  border-bottom: 0;
}
.search-title h4,
.content-title h4 {
  margin: 10px 0;
}
.reset {
  margin-left: 20px;
}
.order-list {
  flex: 1;
}
</style>
