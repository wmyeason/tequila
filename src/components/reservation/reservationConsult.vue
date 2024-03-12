<template>
  <div>
  <el-table
      ref="singleTable"
      :data="item"
      highlight-current-row
      style="width: 100%">
    <el-table-column
        type="index"
        width="50">
    </el-table-column>
    <el-table-column
        prop="userEntity.username"
        label="咨询师名称"
        width="120">
    </el-table-column>
    <el-table-column
        prop="userEntity.gender"
        label="性别"
        width="120">
    </el-table-column>
    <el-table-column
        prop="userEntity.age"
        label="年龄">
    </el-table-column>
    <el-table-column
        prop="userEntity.contactInfo"
        label="联系方式">
    </el-table-column>
    <el-table-column
        prop="consultInfo.professionField"
        label="专业领域">
    </el-table-column>
    <el-table-column
        prop="consultInfo.personalProfile"
        label="个人简介">
    </el-table-column>

    <el-table-column
        fixed="right"
        label="操作"
        width="100">
      <template slot-scope="scope">
        <el-button @click="reservation(scope.row)" type="text" size="small">预约</el-button>
      </template>

    </el-table-column>

  </el-table>
<!--    <el-pagination-->
<!--        background-->
<!--        :current-page="pageInfo.current"-->
<!--        :page-size="pageInfo.size"-->
<!--        layout="prev, pager, next"-->
<!--        @current-change="handleCurrentChange"-->
<!--        :total="pageInfo.total">-->
<!--    </el-pagination>-->

    <el-dialog title="时间预约" :visible.sync="dialogTableVisible">
      <el-table :data="dialogData">
        <el-table-column property="reservationDate" label="日期" width="150"></el-table-column>
        <el-table-column property="place" label="地址"></el-table-column>
        <el-table-column property="startTime" label="开始时间"></el-table-column>
        <el-table-column property="endTime" label="结束时间"></el-table-column>
        <el-table-column
            fixed="right"
            label="操作"
            width="100">
          <template slot-scope="scope">
            <el-button @click="addReservation(scope.row)" type="text" size="small">预约</el-button>
          </template>

        </el-table-column>
      </el-table>
    </el-dialog>
</div>
</template>
<script>
import axios from "axios";
import api from "@/api/index";

export default {
  data() {
    return {
      item: [],
      userRowData: {},
      dialogTableVisible: false,
      dialogData: [],
      currentPage:1,
      pageSize:1,
      pageInfo:{
        current:1,
        size:1,
        total:0
      }
    };
  },
  components: {},
  // reservationConsult
  mounted() {
    this.fetchData();
  },
  methods: {
    handleCurrentChange(val) {
      this.pageInfo.current = val;
    },
    reservation(row) {
      console.log(row.consultInfo.userId);

      //发送请求  获取日期时间内的 预约排版情况
      axios.get(api.Reservation + "/getConsultReservationInfo", {
        headers: {Authorization: localStorage.token},
        params: {
          consultId: row.consultInfo.userId,
          currentPage: this.currentPage,
          pageSize: this.pageSize

        }
      }).then(res => {
        console.log(res.data.data);
        this.dialogData = res.data.data.records;
      });

      this.dialogTableVisible = true;


    },
    addReservation(row){
      console.log(row);
      this.$confirm('是否确定预约该时间段的咨询师?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.post(api.Reservation + "/userAddReservationInfoById/",
            {
              id:row.id,
              userId: localStorage.userId
            },
            {headers: {Authorization: localStorage.token}}).then(res => {
          console.log(res);
          this.dialogTableVisible = false;
        });
        this.$message({
          type: 'success',
          message: '预约成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消预约'
        });
      });

    },
    fetchData() {
      axios.get(api.User + "/getUserByTypeExtendInfo/1", {
            headers: {Authorization: localStorage.token}
          })
          .then(response => {
            this.item = response.data.data;
            console.log(this.item);
          })
    },
  }
};
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>
