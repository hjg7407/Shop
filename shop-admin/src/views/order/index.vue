<template>
  <div class="order">
    <div class="search">
      <div class="search-title">
        <h4>搜索条件</h4>
      </div>
      <el-form ref="form" :model="form" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="订单编号">
              <el-input
                v-model="form.order_id"
                placeholder="订单编号"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="用户名">
              <el-input v-model="form.username" placeholder="用户名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="searchForm">查询结果</el-button>
            <el-button class="reset" @click="resetForm">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="content">
      <div class="content-title">
        <h4>订单列表</h4>
      </div>
      <div class="order-list">
        <el-table
          :data="orderList"
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
            prop="order_id"
            label="订单编号"
            min-width="10%"
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
            prop="order_time"
            label="下单时间"
            min-width="15%"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.order_time | dateFilter }}
            </template>
          </el-table-column>

          <el-table-column label="订单状态" min-width="10%" align="center">
            <template slot-scope="scope">
              {{ status(scope.row.order_status) }}
            </template>
          </el-table-column>

          <el-table-column label="金额" min-width="10%" align="center">
            <template slot-scope="scope">
              {{ scope.row.order_price | numFilter }}
            </template>
          </el-table-column>

          <el-table-column label="操作" min-width="10%" align="center">
            <template slot-scope="scope">
              <el-button
                v-show="scope.row.order_status === 1"
                size="mini"
                type="primary"
                @click="handleModify(scope.row.order_id)"
                >修改金额
              </el-button>
              <el-button
                style="margin: 0"
                v-show="scope.row.order_status === 2"
                size="mini"
                type="primary"
                @click="handleShipping(scope.row.order_id)"
                >订单发货</el-button
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
    <!-- 订单发货对话框 -->
    <el-dialog
      title="订单发货"
      :visible.sync="shippingDialog"
      :before-close="shippingCancel"
      width="35%"
    >
      <el-form :model="expressForm" :rules="rules" ref="ruleForm">
        <el-form-item
          label="快递单号"
          :label-width="formLabelWidth"
          prop="express_id"
        >
          <el-input
            v-model="expressForm.express_id"
            style="width: 80%"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="快递名称"
          :label-width="formLabelWidth"
          prop="express_name"
        >
          <el-input
            v-model="expressForm.express_name"
            style="width: 80%"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="shippingCancel">取 消</el-button>
        <el-button type="primary" @click="shippingOrder">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 修改金额对话框 -->
    <el-dialog
      title="修改金额"
      :visible.sync="modifyDialog"
      :before-close="modifyCancel"
      width="35%"
    >
      <el-form :model="orderForm" :rules="orderRules" ref="orderForm">
        <el-form-item
          label="订单金额"
          :label-width="formLabelWidth"
          prop="order_price"
        >
          <el-input
            v-model="orderForm.order_price"
            style="width: 80%"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyCancel">取 消</el-button>
        <el-button type="primary" @click="modifyOrder">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Order",
  data() {
    return {
      form: {
        // 搜索条件
        order_id: "",
        username: "",
      },
      orderList: [],
      total: 0, // 商品总量
      pageSize: 10, // 每页显示的商品数量
      currentPage: 1, //当前页码
      shippingDialog: false, //控制订单发货对话框
      modifyDialog: false, //控制订单发货对话框
      expressForm: {
        express_id: "",
        express_name: "",
      },
      orderForm: {
        order_price: "",
      },
      formLabelWidth: "120px",
      order_id: "", //需要操作的订单编号
      rules: {
        express_id: [
          {
            required: true,
            message: "快递单号不能为空",
            trigger: "blur",
          },
        ],
        express_name: [
          {
            required: true,
            message: "快递名称不能为空",
            trigger: "blur",
          },
        ],
      },
      orderRules: {
        order_price: [
          {
            required: true,
            message: "订单金额不能为空",
            trigger: "blur",
          },
          {
            pattern:
              /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
            message: "订单金额只能为数值类型,可保留两位小数",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    status(value) {
      switch (value) {
        case 1:
          return "等待付款";
        case 2:
          return "等待发货";
        case 3:
          return "等待收货";
        case 4:
          return "交易成功";
        case 5:
          return "交易取消";
      }
    },
    //获取订单列表数据
    async getOrderList() {
      let result = await this.$axios.post("/api/admin/searchOrder", {
        search: this.form,
        currentPage: this.currentPage,
        pageSize: this.pageSize,
      });
      this.orderList = result.data.orderList;
      this.total = result.data.total;
    },
    // 搜索订单
    searchForm() {
      this.currentPage = 1;
      this.getOrderList();
    },
    // 重置搜索表单
    resetForm() {
      this.form.order_id = "";
      this.form.username = "";
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
    // 设置要发货的订单
    handleShipping(order_id) {
      // console.log(order_id);
      this.order_id = order_id;
      this.shippingDialog = true;
    },
    // 订单发货
    async shippingOrder() {
      this.$nextTick(function () {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            // console.log(this.order_id);
            this.$axios
              .post("/api/admin/shippingOrder", {
                order_id: this.order_id,
                express: this.expressForm,
              })
              .then((resolve) => {
                if (resolve.data.code === "0") {
                  // 订单发货成功，提示成功信息
                  this.$successedMessage(resolve.data.message);
                  // 修改订单状态
                  for (let index in this.orderList) {
                    if (this.orderList[index].order_id === this.order_id) {
                      this.orderList[index].order_status = 3;
                    }
                  }
                } else {
                  // 订单发货失败，提示失败信息
                  this.$errorMessage(resolve.data.message);
                }
                this.$refs.ruleForm.resetFields();
                // 关闭对话框
                this.shippingDialog = false;
              });
          } else {
            return false;
          }
        });
      });
    },
    // 设置要修改金额的订单
    handleModify(order_id) {
      // console.log(order_id);
      this.order_id = order_id;
      this.modifyDialog = true;
    },
    // 修改金额
    async modifyOrder(order_id) {
      this.$nextTick(function () {
        this.$refs.orderForm.validate((valid) => {
          if (valid) {
            // console.log(this.order_id);
            this.$axios
              .post("/api/admin/modifyOrder", {
                order_id: this.order_id,
                order_price: this.orderForm.order_price,
              })
              .then((resolve) => {
                if (resolve.data.code === "0") {
                  // 修改金额成功，提示成功信息
                  this.$successedMessage(resolve.data.message);
                  // 修改订单金额
                  for (let index in this.orderList) {
                    if (this.orderList[index].order_id === this.order_id) {
                      this.orderList[index].order_price =
                        this.orderForm.order_price;
                    }
                  }
                  // 关闭对话框
                  this.modifyDialog = false;
                } else {
                  // 修改金额失败，提示失败信息
                  this.$errorMessage(resolve.data.message);
                }
                this.$refs.orderForm.resetFields();
              });
          } else {
            return false;
          }
        });
      });
    },
    // 取消保存重置表单数据
    shippingCancel() {
      this.$nextTick(function () {
        this.$refs.ruleForm.resetFields();
        for (let index in this.expressForm) {
          this.expressForm[index] = "";
        }
        this.shippingDialog = false;
      });
    },
    modifyCancel() {
      this.$nextTick(function () {
        this.$refs.orderForm.resetFields();
        for (let index in this.orderForm) {
          this.orderForm[index] = "";
        }
        this.modifyDialog = false;
      });
    },
  },
  created() {
    this.getOrderList();
  },
  watch: {
    currentPage() {
      this.getOrderList();
    },
    pageSize() {
      this.getOrderList();
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
