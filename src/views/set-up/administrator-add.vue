<template>
  <div class="operator">
    <div class="operator-container">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="管理员名称" prop="name">
          <el-input maxlength="25" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item v-if="!id" label="密码" prop="password">
          <el-input maxlength="25" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="权限">
          <el-tree
            :data="data"
            show-checkbox
            default-expand-all
            node-key="id"
            ref="tree"
            highlight-current
            :default-checked-keys = defaultCheckedKeys
            @check-change="handleCheckChange">
          </el-tree>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="onSubmit('form')">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import md5 from 'js-md5';
  import {sysOperatorCreate,modifySysOperator} from '@/api/setUp'

  export default {
    name: "administrator-add",
    data() {
      return {
        data: [
          {
            id: 1,
            label: '首页',
          },
          {
            id: 2,
            label: '店铺',
            children: [{
              id: 21,
              label: '店铺装修'
            }, {
              id: 22,
              label: '广告条管理'
            }]
          },
          {
            id: 3,
            label: '商品管理',
            children: [
              {
                id: 31,
                label: '发布商品'
              },
              {
                id: 32,
                label: '商品管理'
              },
              {
                id: 33,
                label: '类目管理'
              },
              {
                id: 34,
                label: '规格与属性'
              },
              {
                id: 35,
                label: '品牌管理'
              }
            ]
          },
          {
            id: 4,
            label: '订单管理',
          },
          {
            id: 5,
            label: '财务管理',
          },
          {
            id: 6,
            label: '会员管理',
          },
          {
            id: 7,
            label: '设置',
            children: [
              {
                id: 71,
                label: '店铺信息'
              },
              {
                id: 72,
                label: '关于我们'
              },
              {
                id: 73,
                label: '常见问题'
              },
              {
                id: 74,
                label: '系统操作员'
              }
            ]
          }
        ],
        form: {
          name: this.$route.query.userName ? this.$route.query.userName : '',
          password: ''
        },
        menuAuthority: this.$route.query.menuAuthority ? this.$route.query.menuAuthority.split(',') : [],
        id: this.$route.query.id,
        rules: {
          name: [{required: true, message: '请填写管理员名称', trigger: 'blur'}]
        },
        defaultCheckedKeys: this.$route.query.menuAuthority ? this.$route.query.menuAuthority.split(',') : []
      }
    },
    methods: {
      handleCheckChange(data, checked, indeterminate) {
        if ( checked ) {
          this.menuAuthority.push(data.id);
        } else if (!checked && !indeterminate)  {
          this.menuAuthority.forEach(
            (v, index) => {
              if ( v == data.id) {
                this.menuAuthority.splice(index,1)
              }
            }
          )
        }
      },
       onSubmit(formName) {
        if (this.menuAuthority.length == 0) {
          this.$message({
            showClose: true,
            message: '请选择菜单权限',
            type: 'warning'
          });
        }
        let params = {
          id: this.id,
          userName: this.form.name,
          menuAthority: this.menuAuthority.join(',')
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if ( this.id ) {
              modifySysOperator(params).then(
                res => {
                  this.$message({
                    showClose: true,
                    message: res.returnMsg,
                    type: 'success'
                  })
                  this.$router.push({path: '/set-up/operator'})
                }
              )
            } else {
              Object.assign(params,{password: md5(this.form.password)})
              sysOperatorCreate(params).then(
                res => {
                  this.$message({
                    showClose: true,
                    message: res.returnMsg,
                    type: 'success'
                  })
                  this.$router.push({path: '/set-up/operator'})
                }
              )
            }

          }
        })
      }
    }
  }
</script>

<style rel="stylesheet" lang="scss" scoped>
  .el-input {
    width: 30%;
  }
  .operator {
    padding: 32px;
    background-color: #f0f2f5;
  }

  .operator-container {
    padding: 50px 100px;
    background-color: #fff;
  }
</style>
