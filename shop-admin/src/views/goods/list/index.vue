<template>
  <div class="w">
    <div class="list" v-show="!isEdit">
      <div class="search">
        <div class="search-title">
          <h4>搜索条件</h4>
        </div>
        <!-- 搜索表单区 -->
        <el-form ref="form" :model="form" label-width="80px">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="输入搜索">
                <el-input
                  v-model="form.keyword"
                  placeholder="商品名称"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="商品货号">
                <el-input v-model="form.code" placeholder="商品货号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="商品分类">
                <el-select
                  v-model="form.categoryId"
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
            <el-col :span="6">
              <el-button type="primary" @click="searchForm">查询结果</el-button>
              <el-button class="reset" @click="resetForm">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="content">
        <div class="content-title">
          <h4>商品列表</h4>
        </div>
        <div class="goods-list">
          <!-- 表格区 -->
          <el-table
            :data="goodsList"
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

            <el-table-column label="商品图片" min-width="15%" align="center">
              <template slot-scope="scope">
                <img
                  :src="$baseURL + scope.row.goods_picture"
                  alt=""
                  style="width: 80px; height: 80px"
                />
              </template>
            </el-table-column>

            <el-table-column
              prop="goods_name"
              label="商品名称"
              min-width="20%"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="goods_code"
              label="商品货号"
              min-width="14%"
              align="center"
            >
            </el-table-column>
            <el-table-column label="市场价格" min-width="10%" align="center">
              <template slot-scope="scope">
                {{ scope.row.goods_price | numFilter }}
              </template>
            </el-table-column>
            <el-table-column label="销售价格" min-width="10%" align="center">
              <template slot-scope="scope">
                {{ scope.row.goods_selling_price | numFilter }}
              </template>
            </el-table-column>
            <el-table-column
              prop="goods_number"
              label="库存"
              min-width="8%"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="goods_sales"
              label="销量"
              min-width="8%"
              align="center"
            >
            </el-table-column>
            <el-table-column label="操作" min-width="15%" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleEdit(scope.row.goods_id)"
                >
                  编辑
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row.goods_id)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="pagination">
        <!-- 分页区 -->
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
    </div>
    <!-- 删除商品对话框 -->
    <el-dialog title="删除商品" :visible.sync="deleteDialog" width="30%">
      <span>确定要删除该商品吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialog = false">取 消</el-button>
        <el-button type="primary" @click="deleteGoods">确 定</el-button>
      </span>
    </el-dialog>
    <add-goods v-if="isEdit" :isEdit="isEdit" :goods_id="goods_id"></add-goods>
  </div>
</template>

<script>
import AddGoods from "../add/index.vue";
export default {
  name: "GoodsList",
  components: { AddGoods },
  data() {
    return {
      form: {
        // 搜索条件
        keyword: "",
        code: "",
        categoryId: "", //选中的分类id
      },
      categoryList: [], //分类列表
      goodsList: [], // 商品列表
      total: 0, // 商品总量
      pageSize: 10, // 每页显示的商品数量
      currentPage: 1, //当前页码
      goods_id: "",
      deleteDialog: false,
      isEdit: false,
      goods_id: 0,
    };
  },
  methods: {
    // 获取商品列表数据
    async getGoodsList() {
      let result = await this.$axios.post("/api/goods/searchForm", {
        search: this.form,
        currentPage: this.currentPage,
        pageSize: this.pageSize,
      });
      this.goodsList = result.data.goodsList;
      this.total = result.data.total;
    },
    // 获取商品分类数据
    async getCategory() {
      let result = await this.$axios.get("/api/goods/category");
      this.categoryList = result.data.category;
    },
    // 重置搜索表单
    resetForm() {
      this.form.keyword = "";
      this.form.code = "";
      this.form.categoryId = "";
    },
    // 搜索商品
    searchForm() {
      this.currentPage = 1;
      this.getGoodsList();
    },
    // 改变每页显示数量
    handleSizeChange(value) {
      this.pageSize = value;
    },
    // 改变当前页数
    handleCurrentChange(value) {
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
    handleDelete(goods_id) {
      this.goods_id = goods_id;
      this.deleteDialog = true;
    },
    // 删除商品
    async deleteGoods() {
      let result = await this.$axios.post("/api/admin/deleteGoods", {
        goods_id: this.goods_id,
      });
      if (result.data.code === "0") {
        for (let index in this.goodsList) {
          if (this.goodsList[index].goods_id === this.goods_id) {
            this.goodsList.splice(index, 1);
          }
        }
        this.$successedMessage(result.data.message);
      } else {
        this.$errorMessage(result.data.message);
      }
      this.deleteDialog = false;
    },
    // 编辑商品
    handleEdit(goods_id) {
      this.isEdit = true;
      this.goods_id = goods_id;
    },
  },
  created() {
    this.searchForm();
    this.getCategory();
  },
  mounted() {
    this.$bus.$on("update", (data) => {
      this.isEdit = data;
      this.getGoodsList();
    });
  },
  beforeDestroy() {
    this.$bus.$off("update");
  },
  watch: {
    currentPage() {
      this.getGoodsList();
    },
    pageSize() {
      this.getGoodsList();
    },
  },
};
</script>

<style scoped>
.w {
  height: 100%;
}
.list {
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
.goods-list {
  flex: 1;
}
</style>
