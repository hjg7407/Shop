<template>
  <div class="address">
    <div class="body">
      <div class="header">
        <p>
          <i class="el-icon-place" style="font-size: 30px; color: #ff6700"></i>
          收货地址
        </p>
      </div>
      <div class="content">
        <div class="add">
          <el-button plain @click="addAddress">添加收货地址</el-button>
          <span>
            <i class="el-icon-info"></i>
            您已创建{{ addressList.length }}个收货地址，最多可创建5个
          </span>
        </div>
        <ul class="list">
          <li v-for="(item, index) in addressList" :key="item.address_id">
            <div class="title">
              <h3>
                {{ item.address_name }}
                <span class="default" v-show="item.address_default === 1">
                  默认地址
                </span>
                <el-popover
                  placement="top"
                  width="160"
                  :ref="'ref_' + item.address_id"
                >
                  <p>您确定要删除该收货地址吗？</p>
                  <!-- @click=" $refs['ref_' + item.address_id][0].showPopper = false" -->
                  <div style="text-align: right; margin: 0">
                    <el-button
                      type="text"
                      size="mini"
                      @click="$refs['ref_' + item.address_id][0].doClose()"
                    >
                      取消
                    </el-button>
                    <el-button
                      type="primary"
                      size="mini"
                      @click="deleteAddress(item.address_id, index)"
                    >
                      确定
                    </el-button>
                  </div>
                  <i class="el-icon-close delete" slot="reference"></i>
                </el-popover>
              </h3>
            </div>
            <div class="message">
              <div class="item">
                <span class="label">收货人：</span>
                {{ item.address_name }}
              </div>
              <div class="item">
                <span class="label">详细地址：</span>
                {{ item.address_details }}
              </div>
              <div class="item">
                <span class="label">电话/手机：</span>
                {{ item.address_phone }}
              </div>
              <div class="change clearfix">
                <a @click="editAddress(index)">编辑</a>
                <a
                  v-show="item.address_default === 0"
                  @click="setDefault(item.address_id, index)"
                >
                  设为默认
                </a>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <el-dialog
        title="添加收货地址"
        :visible.sync="dialogFormVisible"
        :before-close="handleCancel"
      >
        <el-form :model="addressForm" :rules="rules" ref="ruleForm">
          <el-form-item
            label="收件人"
            :label-width="formLabelWidth"
            prop="address_name"
          >
            <el-input v-model="addressForm.address_name"></el-input>
          </el-form-item>
          <el-form-item
            label="手机号码"
            :label-width="formLabelWidth"
            prop="address_phone"
          >
            <el-input
              v-model="addressForm.address_phone"
              maxlength="11"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="地址"
            :label-width="formLabelWidth"
            prop="address_details"
          >
            <el-input
              type="textarea"
              autosize
              v-model="addressForm.address_details"
              maxlength="100"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleCancel">取 消</el-button>
          <el-button type="primary" @click="saveAddress">保 存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'AddressItem',
    data() {
      return {
        addressList: [],
        // 控制是否显示添加地址表单
        dialogFormVisible: false,
        // 是否是编辑
        isEdit: false,
        addressForm: {
          address_id: '',
          address_name: '',
          address_phone: '',
          address_details: ''
        },
        formLabelWidth: '120px',
        // 地址信息校验规则,validator(校验方法),trigger(触发方式),blur为在组件 Input 失去焦点时触发
        rules: {
          address_name: [
            {
              required: true,
              message: '收货人不能为空',
              trigger: 'blur'
            }
          ],
          address_phone: [
            {
              required: /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/,
              message: '手机号不能为空',
              trigger: 'blur'
            },
            {
              pattern: true,
              message: '请输入正确的手机号',
              trigger: 'blur'
            }
          ],
          address_details: [
            {
              required: true,
              message: '地址信息不能为空',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    methods: {
      // 获取地址列表
      async getAddressList() {
        let result = await this.$axios.get('/api/address/getAddress')
        this.addressList = result.data.addressList
      },
      // 添加地址
      async addAddress() {
        if (this.addressList.length >= 5) {
          this.$errorMessage('您保存的地址已达到上限！')
          return
        }

        this.dialogFormVisible = true
        this.isEdit = false
      },
      // 删除地址
      async deleteAddress(address_id, index) {
        this.$refs['ref_' + address_id][0].showPopper = false
        let result = await this.$axios.post('/api/address/deleteAddress', {
          address_id
        })
        if (result.data.code === '0') {
          this.addressList.splice(index, 1)
        }
      },
      // 编辑地址
      async editAddress(index) {
        this.dialogFormVisible = true
        this.addressForm.address_id = this.addressList[index].address_id
        this.addressForm.address_name = this.addressList[index].address_name
        this.addressForm.address_phone = this.addressList[index].address_phone
        this.addressForm.address_details =
          this.addressList[index].address_details
        this.isEdit = true
      },
      // 设置默认地址
      async setDefault(address_id, index) {
        let result = await this.$axios.post('/api/address/defaultAddress', {
          address_id
        })
        if (result.data.code === '0') {
          this.addressList.forEach((value) => (value.address_default = 0))
          this.addressList[index].address_default = 1
        }
      },
      // 保存地址
      async saveAddress() {
        this.$nextTick(function () {
          this.$refs.ruleForm.validate((valid) => {
            // 通过校验
            if (valid) {
              let { address_id, address_name, address_phone, address_details } =
                this.addressForm
              if (!this.isEdit) {
                this.$axios
                  .post('/api/address/addAddress', {
                    address_name,
                    address_phone,
                    address_details
                  })
                  .then((resolve) => {
                    if (resolve.data.code === '0') {
                      this.getAddressList()

                      this.dialogFormVisible = false
                    }
                    this.$refs.ruleForm.resetFields()
                  })
              } else {
                this.$axios
                  .post('/api/address/updateAddress', {
                    address_id,
                    address_name,
                    address_phone,
                    address_details
                  })
                  .then((resolve) => {
                    if (resolve.data.code === '0') {
                      this.$refs.ruleForm.resetFields()
                      this.addressList.forEach((value) => {
                        if (value.address_id === address_id) {
                          console.log(value, address_name)
                          value.address_name = address_name
                          value.address_phone = address_phone
                          value.address_details = address_details
                        }
                      })
                      this.dialogFormVisible = false
                    }
                  })
                for (let key in this.addressForm) {
                  this.addressForm[key] = ''
                }
              }
            } else {
              return false
            }
          })
        })
      },
      // 取消保存重置表单数据和清除表单验证
      handleCancel() {
        this.$nextTick(function () {
          this.$refs.ruleForm.resetFields()
          for (let key in this.addressForm) {
            this.addressForm[key] = ''
          }
          this.dialogFormVisible = false
        })
      }
    },
    activated() {
      this.getAddressList()
    }
  }
</script>

<style scoped>
  .address {
    background-color: #f5f5f5;
    padding-bottom: 20px;
  }
  .body {
    width: 1200px;
    margin: 0 auto;
    background-color: #fff;
  }
  .header {
    height: 64px;
    background-color: #f5f5f5;
    border-bottom: 2px solid #ff6700;
    margin-bottom: 20px;
  }
  .header p {
    font-size: 28px;
    line-height: 58px;
    font-weight: normal;
    color: #424242;
  }
  .content {
    padding: 0 100px 10px;
  }
  .add span {
    margin-left: 10px;
  }
  .list {
    margin-top: 5px;
  }
  .list li {
    position: relative;
    margin-top: 10px;
    border: 1px solid rgb(232, 232, 232);
  }
  .title {
    padding-left: 10px;
    height: 45px;
    line-height: 45px;
  }
  .title h3 {
    font-size: 16px;
  }
  .title .default {
    margin-left: 10px;
    padding: 2px;
    font-size: 12px;
    font-weight: 400;
    color: #fff;
    background-color: orange;
  }
  .title .delete {
    position: absolute;
    top: 10px;
    right: 10px;
  }

  .message {
    padding: 5px 10px;
  }
  .item {
    width: 800px;
    height: 25px;
    line-height: 25px;
    margin-left: 10px;
  }
  .label {
    float: left;
    width: 70px;
    color: #999;
    text-align: right;
  }
  .change a {
    float: right;
    margin-left: 10px;
    color: blue;
  }
  .change a:hover {
    color: orangered;
  }
</style>
