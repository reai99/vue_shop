<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
     <el-card class="box-card">
       <el-row>
         <el-col><el-button type="primary" class="add-roles" @click="addRoles()">添加角色</el-button></el-col>
       </el-row>
       <!-- 角色列表区 -->
       <el-table :data="roleList" border stripe>
         <el-table-column type="expand">
           <template slot-scope="scope">
             <el-row :class="['bdbottom',i1 === 0 ? 'bdtop' : '','vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
               <!-- 一级权限 -->
               <el-col :span="5">
                 <el-tag closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                 <i class="el-icon-caret-right"></i>
               </el-col>
               <el-col :span="19">
                 <el-row :class="[i2 === 0 ? '' : 'bdtop','vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                   <el-col :span="6">
                     <el-tag closable @close="removeRightById(scope.row, item2.id)" type="success">{{item2.authName}}</el-tag>
                     <i class="el-icon-caret-right"></i>
                   </el-col>
                   <el-col :span="18">
                     <el-tag closable type="warning" v-for="item3 in item2.children" :key="item3.id" @close="removeRightById(scope.row, item3.id)">{{item3.authName}}</el-tag>
                   </el-col>
                 </el-row>
               </el-col>
             </el-row>
           </template>
         </el-table-column>
         <el-table-column type="index" label="Id"></el-table-column>
         <el-table-column label="角色名称" prop="roleName"></el-table-column>
         <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
         <el-table-column label="操作" width="300px">
           <template slot-scope="scope">
             <el-button type="primary" icon="el-icon-edit" size="mini" @click="editRoleDialog(scope.row.id)">编辑</el-button>
             <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRoleDialog(scope.row.id)">删除</el-button>
             <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
           </template>
         </el-table-column>
       </el-table>
     </el-card>
     <!-- 分配权限对话框 -->
     <el-dialog
       title="权限分配"
       :visible.sync="setRightDialogVisible"
       width="50%"
       @close="setRightDialogClose">
       <el-tree :data="rightsList" ref="treeRef" :props="treeProps" show-checkbox node-key="id" default-expand-all  :default-checked-keys="defKeys"></el-tree>
       <span slot="footer" class="dialog-footer">
         <el-button @click="setRightDialogVisible = false">取 消</el-button>
         <el-button type="primary" @click="allowRights()">确 定</el-button>
       </span>
     </el-dialog>
     <!-- 新增角色 -->
     <el-dialog
       title="新增角色"
       :visible.sync="addrolesDialogVisible"
       width="50%"
       @close="addDialogClose">
       <el-form :model="addRole" :rules="addRoleRules" ref="addRoleRef" label-width="100px">
         <el-form-item label="角色名称" prop="roleName">
           <el-input v-model="addRole.roleName"></el-input>
         </el-form-item>
         <el-form-item label="角色描述" prop="roleDesc">
           <el-input v-model="addRole.roleDesc"></el-input>
         </el-form-item>
       </el-form>
       <span slot="footer" class="dialog-footer">
         <el-button @click="addrolesDialogVisible = false">取 消</el-button>
         <el-button type="primary" @click="addRoleInfo()">确 定</el-button>
       </span>
     </el-dialog>
     <!-- 编辑角色 -->
     <el-dialog
       title="编辑角色"
       :visible.sync="editrolesDialogVisible"
       width="50%"
       @close="editDialogClose">
       <el-form :model="editRole" :rules="addRoleRules" ref="editRoleRef" label-width="100px">
         <el-form-item label="角色名称" prop="roleName">
           <el-input v-model="editRole.roleName"></el-input>
         </el-form-item>
         <el-form-item label="角色描述" prop="roleDesc">
           <el-input v-model="editRole.roleDesc"></el-input>
         </el-form-item>
       </el-form>
       <span slot="footer" class="dialog-footer">
         <el-button @click="editrolesDialogVisible = false">取 消</el-button>
         <el-button type="primary" @click="editRoleInfo(editRole.roleId)">确 定</el-button>
       </span>
     </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roleList: [],
      setRightDialogVisible: false,
      rightsList: [],
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      defKeys: [],
      roleId: '',
      addrolesDialogVisible: false,
      addRole: {
        roleName: '',
        roleDesc: ''
      },
      addRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      editrolesDialogVisible: false,
      editRole: {}
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { data: res } = await this.$request.get('roles')
      if (res.meta.status !== 200) { return this.$message.error('获取角色列表失败') }
      this.roleList = res.data
    },
    async removeRightById (role, rightid) {
      const confirmResult = await this.$confirm(
        '是否永久删除该权限项?',
        '权限删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
      if (confirmResult !== 'confirm') { return false }
      const { data: res } = await this.$request.delete(`roles/${role.id}/rights/${rightid}`)
      if (res.meta.status !== 200) { return this.$message.error('删除权限失败') }
      role.children = res.data
      this.$message.success('删除权限成功！')
    },
    async showSetRightDialog (role) {
      this.roleId = role.id
      const { data: res } = await this.$request.get('rights/tree')
      if (res.meta.status !== 200) { return this.$message.error('获取角色列表失败') }
      this.rightsList = res.data
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 递归获取子叶节点
    getLeafKeys (node, arr) {
      if (!node.children) { return arr.push(node.id) }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    setRightDialogClose () {
      this.defKeys = []
    },
    async allowRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$request.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) { return this.$message.error('更新权限失败！') }
      this.$message.success('分配权限成功！')
      this.getRolesList()
      this.setRightDialogVisible = false
    },
    // 触发新增角色表单面板
    addRoles () {
      this.addrolesDialogVisible = true
    },
    // 新增角色
    addRoleInfo () {
      this.$refs.addRoleRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$request.post('roles', this.addRole)
        if (res.meta.status !== 201) { return this.$message.error('添加角色失败！') }
        this.$message.success('添加角色成功！')
        this.addrolesDialogVisible = false
        this.getRolesList()
      })
    },
    // 新增角色表单面板关闭
    addDialogClose () {
      this.$refs.addRoleRef.resetFields()
    },
    // 删除对应id角色
    async deleteRoleDialog (id) {
      const confirmResult = await this.$confirm(
        '是否永久删除该角色?',
        '角色删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
      if (confirmResult !== 'confirm') { return false }
      const { data: res } = await this.$request.delete(`roles/${id}`)
      if (res.meta.status !== 200) { return this.$message.error(res.meta.msg) }
      this.$message.success('删除角色成功！')
      this.getRolesList()
    },
    // 触发编辑角色表单面板
    async editRoleDialog (id) {
      const { data: res } = await this.$request.get(`roles/${id}`)
      if (res.meta.status !== 200) { return this.$message.error('用户查询失败！') }
      this.editRole = res.data
      this.editrolesDialogVisible = true
    },
    // 编辑角色表单面板关闭
    editDialogClose () {
      this.$refs.editRoleRef.resetFields()
    },
    // 编辑角色信息
    editRoleInfo (id) {
      this.$refs.editRoleRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$request.put(`roles/${id}`, { roleName: this.editRole.roleName, roleDesc: this.editRole.roleDesc })
        if (res.meta.status !== 200) { return this.$message.error('更新用户失败！') }
        this.getRolesList()
        this.$message.success('修改角色成功！')
        this.editrolesDialogVisible = false
      })
    }
  }
}
</script>

<style lang="less" scoped="scoped">
  .add-roles{margin-bottom: 15px;}
  .el-tag{margin: 8px;}
  .bdtop{border-top: 1px solid #eee;}
  .bdbottom{border-bottom: 1px solid #eee;}
  .vcenter{
    display: flex;
    align-items: center;
  }
</style>
