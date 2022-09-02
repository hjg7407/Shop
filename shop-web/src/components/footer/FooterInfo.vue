<template>
  <footer class="footer">
    <div class="w">
      <div class="footer_list">
        <ul>
          <li>
            <h5></h5>
            <h3>正品保障</h3>
            <span>100%品质保障</span>
          </li>
          <li>
            <h5></h5>
            <h3>自营仓储</h3>
            <span>入仓出仓检验</span>
          </li>
          <li>
            <h5></h5>
            <h3>退换无忧</h3>
            <span>7天无理由退换</span>
          </li>
        </ul>
      </div>
      <div class="footer_about">
        <div class="about">
          <router-link to="/home">首页</router-link> |
          <router-link to="/about">关于我们</router-link> |
          <router-link to="/about">About us</router-link> | <a>联系我们</a> |
          <a>联系客服</a> | <a>隐私条款</a> |
          <a>English Site</a>
        </div>
        <div class="address">
          地址：广东省广州市小谷围街道好而多商城 邮编：510006
          电话：020-618-06680 消费者维权热线：4006067733
          <br />
          京ICP备08001421号 | 京公安备110108007702
        </div>
        <div class="copyright">商城版权所有Copyright © 2022 - 现在</div>
      </div>
    </div>
  </footer>
</template>

<script>
  export default {
    name: 'FooterInfo'
  }
</script>

<style scoped>
  .w {
    width: 1200px;
    margin: 0 auto;
  }
  .footer {
    /* 解决浏览器缩小后右侧背景丢失问题 */
    min-width: 1200px;
    padding-top: 30px;
    background-color: rgb(245, 245, 245);
  }
  .footer_list {
    height: 80px;
    border-bottom: 1px solid #ccc;
    margin-bottom: 20px;
  }
  .footer_list ul {
    display: flex;
    justify-content: space-around;
  }
  .footer_list ul li {
    width: 150px;
    height: 52px;
  }
  .footer_list ul li h5 {
    float: left;
    width: 52px;
    height: 52px;
    margin-right: 10px;
  }
  .footer_list ul li:nth-child(1) h5 {
    background: url(./images/footer.png) no-repeat;
  }
  .footer_list ul li:nth-child(2) h5 {
    background: url(./images/footer.png) no-repeat -246px;
  }
  .footer_list ul li:nth-child(3) h5 {
    background: url(./images/footer.png) no-repeat -615px;
  }
  .footer_list ul li h3 {
    margin-top: 8px;
  }
  .footer_about {
    text-align: center;
    font-size: 14px;
  }
  .about {
    margin-bottom: 5px;
  }
  .about a {
    margin: 0 10px;
  }
  .address {
    font-size: 13px;
    margin-bottom: 5px;
  }
  .copyright {
    padding-bottom: 20px;
  }
</style>
