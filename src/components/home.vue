<template>
  <el-container>
    <el-header>
      <div class="login">
        <img src="../assets/logo.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-btn" @click="toggleCollapse">|||</div>
        <!-- 侧边了菜单区 -->
        <el-menu
              background-color="#333744"
              text-color="#fff"
              active-text-color="#409EFF"
              :unique-opened="true"
              :collapse="isCollapse"
              :collapse-transition="false"
              :router="true"
              :default-active="activePath">
              <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
                <template slot="title">
                    <i :class="icoObj[item.id]"></i>
                    <span>{{item.authName}}</span>
                </template>
                <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id"
                @click="saveNavState('/'+subItem.path)">
                  <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>{{subItem.authName}}</span>
                  </template>
                </el-menu-item>
              </el-submenu>
            </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menulist: [],
      icoObj: {
        125: 'el-icon-s-grid',
        103: 'el-icon-s-grid',
        101: 'el-icon-s-grid',
        102: 'el-icon-s-grid',
        145: 'el-icon-s-grid'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$request.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    saveNavState (res) {
      window.sessionStorage.setItem('activePath', res)
      this.activePath = res
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  }
}
</script>

<style lang="less" scoped="scoped">
  .el-container{height: 100%;}
  .el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    >div{
      display: flex;
      align-items: center;
    }
    >div img{
      width: 60px;
      height: 60px;
    }
    }
  .el-aside{
   background-color: #333744;
  .el-menu{
    border-right: none;
  }
  }
  .el-main{background-color: #eaedf1;}
  .toggle-btn{
    background-color: #4A5064;
    text-align: center;
    letter-spacing: 0.2rem;
    line-height: 28px;
    color: #fff;
    cursor: pointer;
    user-select: none;
  }
</style>
