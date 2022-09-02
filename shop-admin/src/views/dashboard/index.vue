<template>
  <div class="dashboard-container">
    <div class="dashboard-text">欢迎使用好而多后台管理系统！</div>
    <!-- <div class="dashboard-order">目前待发货的订单数为：{{ number }}</div> -->
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  data() {
    return {
      number: 0,
    };
  },
  // created() {
  //   this.$axios.get("/api/admin/awaitedOrder").then((resolve) => {
  //     if (resolve.data.code === "0") {
  //       this.number = resolve.data.number;
  //     }
  //   });
  // },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
  &-order {
    margin-top: 10px;
  }
}
</style>
