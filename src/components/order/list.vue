<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryData.query" clearable @clear="getOrderList">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 数据表格 -->
      <el-table :data="orderList" border stripe style="margin-top:15px">
        <el-table-column type="index" label="Id"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="100"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template slot-scope="scope">
            <el-tag
              :type="orderPay[scope.row.pay_status].type"
            >{{orderPay[scope.row.pay_status].text}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="80"></el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">{{scope.row.create_time | dataFormat }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="openHandleVisible(scope)">编辑</el-button>
            <el-button type="success" icon="el-icon-location" size="mini" @click="showPrpgressVasible(scope)">物流</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="queryData.pagenum"
        :page-sizes="[1, 2, 5, 10, 20]"
        :page-size="queryData.pagesize"
        layout="sizes, prev, pager, next"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 编辑显示框 -->
    <el-dialog title="修改地址" :visible.sync="editdialogVisible" width="50%" @close="editDialogClose">
      <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData" v-model="editForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editdialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流显示框 -->
    <el-dialog title="查看物流进度" :visible.sync="showPrpgressBox" width="50%">
      <el-timeline :reverse="false">
        <template v-for="(item, i) in progressData">
           <el-timeline-item
           v-if="i !=0"
          :key="i"
          :timestamp="item.ftime"
          placement="top"
          type="success"
        >{{item.context}}</el-timeline-item>
        <el-timeline-item
          v-else
          :key="i"
          :timestamp="item.ftime"
          placement="top"
          type="primary"
        >{{item.context}}</el-timeline-item>
        </template>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './province.js'
export default {
  data() {
    return {
      queryData: {
        query: '',
        pagesize: 5,
        pagenum: 1
      },
      orderList: [],
      orderPay: [
        { text: '未支付', type: 'danger' },
        { text: '支付宝', type: 'warning' },
        { text: '微信', type: 'info' },
        { text: '银行卡', type: 'success' }
      ],
      total: 0,
      editdialogVisible: false,
      editForm: {
        address1: [],
        address2: ''
      },
      editRules: {
        address1: [
          {
            type: 'array',
            required: true,
            message: '请选择省市区县',
            tigger: 'blur'
          }
        ],
        address2: [
          { required: true, message: '请填写详细地址', tigger: 'blur' }
        ]
      },
      cityData,
      showPrpgressBox: false,
      progressData: []
    }
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$request.get('orders', {
        params: this.queryData
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据列表失败')
      }
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(pageSize) {
      this.queryData.pagesize = pageSize
      this.getOrderList()
    },
    handleCurrentChange(pageNum) {
      this.queryData.pagenum = pageNum
      this.getOrderList()
    },
    openHandleVisible() {
      this.editdialogVisible = true
    },
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
      this.editForm.address1 = []
      this.editForm.address2 = ''
    },
    async showPrpgressVasible(id) {
      id = 1106975712662
      const { data: res } = await this.$request.get(`/kuaidi/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流进度失败')
      }
      this.progressData = res.data
      this.showPrpgressBox = true
    }
  },
  computed: {},
  created() {
    this.getOrderList()
  }
}
</script>
<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
.el-timeline {
  font-size: 12px !important;
}
</style>
