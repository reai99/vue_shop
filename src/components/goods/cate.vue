<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
     <el-card class="box-card">
       <el-row>
         <el-col><el-button type="primary" class="add-cate" @click="showAddCateDialog()">添加分类</el-button></el-col>
       </el-row>
       <!-- 表格 -->
       <tree-table :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" index-text="Id" stripe border show-index >
         <!-- 状态 -->
         <template slot="isOk" slot-scope="scope">
           <i class="el-icon-success" v-if="scope.row.cat_deleted === false"  style="color:lightgreen;"></i>
           <i class="el-icon-error" v-else style="color: red;"></i>
         </template>
         <!-- 排序 -->
         <template slot="order" slot-scope="scope">
           <el-tag :type="orderRank[scope.row.cat_level].type">{{orderRank[scope.row.cat_level].name}}</el-tag>
         </template>
         <!-- 操作 -->
         <template slot="opt" slot-scope="scope">
           <el-button type="primary" icon="el-icon-edit" size="mini" @click="editDialogOpen(scope.row.cat_id)">编辑</el-button>
           <el-button type="danger" icon="el-icon-delete" size="mini" @click="delCateDate(scope.row.cat_id)">删除</el-button>
         </template>
       </tree-table>
       <!-- 分页 -->
       <el-pagination
             @size-change="handleSizeChange"
             @current-change="handleCurrentChange"
             :current-page="queryInfo.pagenum"
             :page-sizes="[1, 2, 5, 10]"
             :page-size="queryInfo.pagesize"
             layout="total, sizes, prev, pager, next, jumper"
             :total="total">
           </el-pagination>
     </el-card>
     <!-- 添加分类 -->
     <el-dialog
       title="添加分类"
       :visible.sync="addCateDialogVisible"
       width="50%"
       @close="addCateDialogClose()">
       <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
         <el-form-item label="分类名称" prop="cat_name">
           <el-input v-model="addCateForm.cat_name"></el-input>
         </el-form-item>
         <el-form-item label="父级分类">
           <el-cascader v-model="selectedKeys"
               :options="parentCateList"
               :props="cascaderProps"
               @change="parentCateChange" clearable></el-cascader>
         </el-form-item>
       </el-form>
       <span slot="footer" class="dialog-footer">
         <el-button @click="addCateDialogVisible = false">取 消</el-button>
         <el-button type="primary" @click="saveCateInfo()">确 定</el-button>
       </span>
     </el-dialog>
     <!-- 编辑分类名称 -->
     <el-dialog
       title="编辑分类名称"
       :visible.sync="editDialogVisible"
       width="50%"
       @close="editDialogClose">
       <el-form :model="editForm" :rules="addCateFormRules" ref="editFormRef" label-width="100px">
         <el-form-item label="分类名称" prop="cat_name">
           <el-input v-model="editForm.cat_name"></el-input>
         </el-form-item>
       </el-form>
       <span slot="footer" class="dialog-footer">
         <el-button @click="editDialogVisible = false">取 消</el-button>
         <el-button type="primary" @click="editCate(editForm.cat_id)">确 定</el-button>
       </span>
     </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      orderRank: [
        { name: '一级', type: 'danger' },
        { name: '二级', type: 'warning' },
        { name: '三级', type: 'success' }
      ],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      cateList: [],
      total: 0,
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        { label: '是否有效', type: 'template', template: 'isOk' },
        { label: '排序', type: 'template', template: 'order' },
        { label: '操作', type: 'template', template: 'opt', minWidth: '150px' }
      ],
      addCateDialogVisible: false,
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      parentCateList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      selectedKeys: [],
      editDialogVisible: false,
      editForm: {}
    }
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$request.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.cateList = res.data.result
      this.total = res.data.total
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    showAddCateDialog () {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    addCateDialogClose () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    async getParentCateList () {
      const { data: res } = await this.$request.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.parentCateList = res.data
    },
    parentCateChange () {
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    saveCateInfo () {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$request.post('categories', this.addCateForm)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success('添加分类成功！')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    editDialogOpen (id) {
      this.geteditCate(id)
      this.editDialogVisible = true
    },
    editDialogClose () {
      this.$refs.editFormRef.resetFields()
    },
    async geteditCate(id) {
      const { data: res } = await this.$request.get(`categories/${id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editForm = res.data
    },
    editCate (id) {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$request.put(`categories/${id}`, { cat_name: this.editForm.cat_name })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success('修改分类成功！')
        this.getCateList()
        this.editDialogVisible = false
      })
    },
    async delCateDate (id) {
      const confirmResult = await this.$confirm(
        '是否永久删除该分类?',
        '分类删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
      if (confirmResult !== 'confirm') { return false }
      const { data: res } = await this.$request.delete(`categories/${id}`)
      if (res.meta.status !== 200) { return this.$message.error(res.meta.msg) }
      this.$message.success('删除分类成功！')
      this.getCateList()
    }
  },
  created () {
    this.getCateList()
  }
}
</script>

<style lang="less" scoped="scoped">
  .add-cate {margin-bottom: 15px;}
  .el-cascader{width: 100%;position: relative;}
</style>
