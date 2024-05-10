<template>
  <div>
    <template>
      <div class="block">
        <span class="demonstration">日期选择</span>
        <el-date-picker
            v-model="searchDate"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions">
        </el-date-picker>
        <el-button type="primary" @click="getReservationInfo" round icon="el-icon-search">查询</el-button>
        <el-button type="primary" @click="addReservation"  round icon="el-icon-circle-plus-outline">添加</el-button>
      </div>
      <div>
        <el-table
            :data="reservationData"
            border
            style="width: 100%">
          <el-table-column
              prop="reservationDate"
              label="预约日期"
              width="250">
          </el-table-column>
          <el-table-column
              prop="startTime"
              label="开始时间"
              width="250">
          </el-table-column>
          <el-table-column
              prop="endTime"
              label="结束时间"
              width="250">
          </el-table-column>
          <el-table-column
              prop="place"
              label="地点"
              width="250">
          </el-table-column>
          <el-table-column
              prop="userName"
              label="预约人"
              width="250">
            <template slot-scope="{ row }">
              {{ row.nickName ? row.nickName : (row.userName ? row.userName : '未知') }}
            </template>
          </el-table-column>
          <el-table-column
              label="操作"
              width="250">
            <template slot-scope="scope">
              <!--              <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>-->
              <el-button @click="cancelReservation(scope.row)" type="text" size="small">取消</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
            background
            :current-page="currentPage"
            :page-size="pageSize"
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
            :total="total">
        </el-pagination>
      </div>

      <div>
        <el-dialog title="添加预约" :visible.sync="dialogTableVisible">
          <el-form>
            <el-form-item label="选择日期">
              <el-date-picker
                  v-model="reservationDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  :picker-options="datePickerOptions"
                  placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="起始时间">
              <el-time-select
                  placeholder="起始时间"
                  v-model="reservationStartHour"
                  :picker-options="{
                   start: '08:30',
                    step: '00:15',
                    end: '22:30'
                       }">
              </el-time-select>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-time-select
                  placeholder="结束时间"
                  v-model="reservationEndHour"
                  :picker-options="{
                  start: '08:30',
                  step: '00:15',
                  end: '22:30',
                  minTime: reservationStartHour
                }">
              </el-time-select>
            </el-form-item>
            <el-form-item label="请输入地点">
              <el-input
                  placeholder="请输入地点"
                  v-model="reservationPlace"
                  style="width: 200px;"
                  clearable>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addReservationInfo">立即创建</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
    </template>

  </div>
</template>
<script>
import axios from "axios";
import api from "@/api/index";


import moment from "moment";

export default {
  data() {
    return {
      item: [],
      userRowData: {},
      reservationData: [],
      searchDate: '',
      startTime: '',
      endTime: '',
      currentPage: 1,
      pageSize: 5,
      dialogData: {},
      total:0,
      dialogTableVisible: false,
      reservationDate: '',//新建预约的日期
      reservationStartHour: '',//预约的开始时间
      reservationEndHour: '',//预约的结束时间
      reservationPlace: '',//预约地点
      datePickerOptions: {
        disabledDate(time) {
          const today = new Date();
          const currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
          return time.getTime() < currentDate.getTime();
        }
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      }
    };
  },
  components: {},
  // reservationConsult
  mounted() {
  },
  methods: {
    cancelReservation(row) {
      console.log(row);
      //判断是否有人预约  如果没有人预约 直接取消  否则先提示
      this.$confirm('是否删除该预约信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.delete(api.Reservation + "/deleteReservationInfoById/" + row.id,
            {headers: {Authorization: localStorage.token}}).then(res => {
          console.log(res);
          this.getReservationInfo();
        });
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleCurrentChange(newPage){
      this.currentPage = newPage;
      this.getReservationInfo()
    },
    addReservation() {
      this.dialogTableVisible = true;
    },
    addReservationInfo() {
      //发送请求前判断开始时间是否在结束时是时候之后
      if (this.reservationStartHour >= this.reservationEndHour) {
        this.$message({
          showClose: true,
          message: '结束时间必须大于开始时间',
          type: 'error'
        });
        return;
      }
      //发送请求 用于 心理师 排列出时间
      axios.post(api.Reservation + "/consultAddReservationByDate", {
        reservationDate: this.reservationDate,
        reservationStartHour: this.reservationStartHour,
        reservationEndHour: this.reservationEndHour,
        consultId: localStorage.userId,
        place: this.reservationPlace
      }, {
        headers: {Authorization: localStorage.token}
      }).then(res => {
        if(res.data.code === 0){
          this.$message({
            showClose: true,
            message: res.data.data,
            type: 'error'
          });
        }else{
          this.dialogTableVisible = false;
          this.reservationDate = '';
          this.reservationStartHour='';
          this.reservationEndHour='';
          this.reservationPlace='';
          this.$message({
            showClose: true,
            message: '添加预约信息成功!',
            type: 'success'
          });
        }

        console.log(res);
      });
    },
    getReservationInfo() {
      this.startTime = this.handleDateChange(this.searchDate[0])
      this.endTime = this.handleDateChange(this.searchDate[1])

      //发送请求  获取日期时间内的 预约排版情况
      axios.get(api.Reservation + "/getConsultReservationByDate", {
        headers: {Authorization: localStorage.token},
        params: {
          startTime: this.startTime,
          endTime: this.endTime,
          consultId: localStorage.userId,
          currentPage: this.currentPage,
          pageSize: this.pageSize

        }
      }).then(res => {
        console.log(res.data.data);
        this.reservationData = res.data.data.records;
        this.total = res.data.data.total;
      });

    },
    // 在选择时间后触发的事件中获取选择时间
    handleDateChange(date) {
      // 使用moment函数将获取到的时间值传入
      return moment(date).format('YYYY-MM-DD');
    }


  }
};
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}

.is-selected {
  color: #1989FA;
}
</style>
