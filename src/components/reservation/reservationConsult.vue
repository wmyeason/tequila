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
            <a @click="() => edit(record.key)">预约</a>
          </span>
        </div>
      </template>
    </a-table>

  </div>
</template>
<script>
import api from "@/api/index";
import axios from "axios";

const columns = [
  {
    title: "咨询师名称",
    dataIndex: "username",
    width: "15%",
    scopedSlots: { customRender: "username" }
  },
  {
    title: "性别",
    dataIndex: "gender",
    width: "10%",
    scopedSlots: { customRender: "gender" }
  },
  {
    title: "年龄",
    dataIndex: "age",
    width: "10%",
    scopedSlots: { customRender: "age" }
  },
  {
    title: "联系方式",
    dataIndex: "contactInfo",
    width: "10%",
    scopedSlots: { customRender: "contactInfo" }
  },
  {
    title: "专业领域",
    dataIndex: "contactInfo",
    width: "10%",
    scopedSlots: { customRender: "contactInfo" }
  },
  {
    title: "学历",
    dataIndex: "contactInfo",
    width: "10%",
    scopedSlots: { customRender: "contactInfo" }
  },
  {
    title: "毕业学校",
    dataIndex: "contactInfo",
    width: "10%",
    scopedSlots: { customRender: "contactInfo" }
  },
  {
    title: "个人简介",
    dataIndex: "contactInfo",
    width: "10%",
    scopedSlots: { customRender: "contactInfo" }
  },
  {
    title: "工作经历",
    dataIndex: "contactInfo",
    width: "10%",
    scopedSlots: { customRender: "contactInfo" }
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

  },
  props: {

  },
  // reservationConsult
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
  }
};
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>
