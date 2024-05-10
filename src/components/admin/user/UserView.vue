<template>
  <div>
<!--    <div class="title">用户列表</div>-->
    <a-table :columns="columns" :dataSource="data" bordered>
      <template
        v-for="col in ['username', 'nickname']"
        :slot="col"
        slot-scope="text, record"
      >
        <div :key="col">
          <a-input
            v-if="record.editable"
            style="margin: -5px 0"
            :value="text"
            @change="e => handleChange(e.target.value, record.key, col)"
          />
          <template v-else>{{ text }}</template>
        </div>
      </template>
      <template slot="age" slot-scope="record">
        <div v-if="!record">未知</div>
        {{ record }}
      </template>
      <template slot="gender" slot-scope="record">
        <div v-if="!record">未知</div>
        {{ record == "MALE" ? '男' : ''}}
        {{ record == "FEMALE" ? '女' : ''}}
      </template>
      <template slot="operation" slot-scope="text, record">
        <div class="editable-row-operations">
          <span>
<!--            <a @click="() => edit(record.key)">编辑</a>-->
            <el-button @click="edit(record.key)" type="primary" size="small" icon="el-icon-edit">编辑</el-button>
          </span>
          <span>
<!--            <a @click="() => del(record.key)">删除</a>-->
            <el-button @click="del(record.key)" type="danger" size="small" icon="el-icon-delete">删除</el-button>
          </span>
        </div>
      </template>
    </a-table>
    <a-modal :visible="modalVisible" title="编辑用户信息" :footer="null" @cancel="modalVisible=false;">
      <UserEdit :rowData="userRowData" :key="commentKeys" @requestComplete="closeParent" />
    </a-modal>
  </div>
</template>
<script>
import api from "@/api/index";
import axios from "axios";
import UserEdit from "./UserEditView.vue";

const columns = [
  {
    title: "用户名",
    dataIndex: "username",
    width: "25%",
    scopedSlots: { customRender: "username" }
  },
  {
    title: "昵称",
    dataIndex: "nickname",
    width: "30%",
    scopedSlots: { customRender: "nickname" }
  },
  {
    title: "年龄",
    dataIndex: "age",
    width: "10%",
    scopedSlots: { customRender: "age" }
  },
  {
    title: "性别",
    dataIndex: "gender",
    width: "10%",
    scopedSlots: { customRender: "gender" }
  },
  {
    title: "操作",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" }
  }
];

export default {
  data() {
    return {
      data: [],
      userRowData:{},
      modalVisible:false,
      commentKeys:1,
      columns
    };
  },
  components:{
    UserEdit
  },
  props: {
    rowData: {
      type: Number, // 数据类型为Object
      required: true // 表示该属性是必需的
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      axios
        .get(api.User, {
          headers: { Authorization: localStorage.token },
          params:{type:this.rowData}
        })
        .then(response => {
          this.data = response.data.data;
          this.data.map(ele => (ele.key = ele.id));
        })
        .catch(error => {
          if (error.response.status == 401) {
            this.$router.push({ path: "/login" });
          }
          console.log(error);
        });
    },
    handleChange(value, key, column) {
      const newData = [...this.data];
      const target = newData.filter(item => key === item.key)[0];
      if (target) {
        target[column] = value;
        this.data = newData;
      }
    },
    edit(key) {
      const newData = [...this.data];
      this.modalVisible =true;
      this.userRowData = newData.filter(item => key === item.key)[0];
      this.commentKeys++;//值增加  保证每次 打开子组件时 都重新加载
      // if (target) {
      //   target.editable = true;
      //   this.data = newData;
      // }
    },
    closeParent(){
      this.modalVisible=false;
      window.location.reload();
    },
    del(key) {
      //删除前添加弹窗
      this.$confirm('是否确定该用户，删除后无法取消?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios
            .delete(api.User + "/" + key, {
              headers: { Authorization: localStorage.token }
            })
            .then(response => {
              if (response.status == 204) {
                this.$message.success("用户删除成功");
                this.fetchData();
              } else {
                this.$message.error("用户删除失败");
              }
            });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },
    updateUser(user) {
      axios
        .put(
          api.User + "/" + user.id,
          {
            username: user.username,
            nickname: user.nickname
          },
          {
            headers: { Authorization: localStorage.token }
          }
        )
        .then(response => {
          if (response.data.code == 0) {
            this.$message.error("用户数据更新失败，请检查输入");
          } else if (response.data.code == 1) {
            this.$message.success("用户数据更新成功");
          }
        });
    }
  }
};
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>
