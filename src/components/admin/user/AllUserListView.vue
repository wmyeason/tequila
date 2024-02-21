<template>
  <div>
    <div class="title">用户列表</div>
    <a-tabs v-model="activeTab">
      <a-tab-pane key="tab1" tab="学生管理" @click="handleTabClick('tab1')">
        <div v-if="activeTab === 'tab1'">
          <UserView :rowData="0"/>
        </div>
      </a-tab-pane>
      <a-tab-pane key="tab2" tab="咨询师管理" @click="handleTabClick('tab2')">
        <div v-if="activeTab === 'tab2'">
          <UserView :rowData="1"/>
        </div>
      </a-tab-pane>
      <!-- 其他页签 -->
    </a-tabs>
  </div>
</template>
<script>
import UserView from "./UserView.vue";


export default {
  data() {
    return {
      data: [],
      activeTab:'tab1'
    };
  },

  mounted() {

  },
  components:{
    UserView:UserView
  },
  methods: {
    handleTabClick(tabName){
      this.activeTab=tabName;
    }
  }
};
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>
