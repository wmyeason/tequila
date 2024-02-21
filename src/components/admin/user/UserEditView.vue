<template>
  <div class="main user-layout-register">
    <div class="title">编辑用户</div>
    <div>
      <span>用户名/邮箱</span>
      <a-input
          size="large"
          type="text"
          placeholder="用户名/邮箱"
          v-model="editEmail"
          style="width: 300px; margin: 8px 0;margin-left: 1px;"
      ></a-input>
    </div>


    <div style="display: flex; align-items: center;">
      <span>密码</span>
      <a-input
          size="large"
          type="password"
          autocomplete="new-password"
          placeholder="密码"
          v-model="editPassword"
          style="width: 300px; margin: 8px 0; display: block;margin-left: 50px;"
          :disabled="!editPassAble"
      >
      </a-input>
      <a-switch v-model="editPassAble" checked-children="开" un-checked-children="关">
      </a-switch>
<!--      <span>是否修改</span>-->

    </div>

    <div>
      <span>联系方式</span>
      <a-input
          size="large"
          type="text"
          placeholder="联系方式"
          v-model="editContactInfo"
          style="width: 300px; margin: 8px 0;margin-left: 20px;"
      ></a-input>
    </div>


    <div>
      <span>年龄</span>
      <a-input-number
          size="large"
          type="text"
          placeholder="年龄"
          v-model="editAge"
          style="width: 300px; margin: 8px 0;margin-left: 50px;"
      ></a-input-number>
    </div>


    <span>性别</span>
    <a-select
        size="large"
        placeholder="选择性别"
        v-model="editSex"
        style="width: 300px; margin: 8px 0;margin-left: 50px;"
    >
      <a-select-option value="MALE" lable="男">男</a-select-option>
      <a-select-option value="FEMALE" lable="女">女</a-select-option>
      <a-select-option value="OTHER" lable="其他">其他</a-select-option>
    </a-select>

    <div v-if="isConsultant">
      <!--      咨询师 资料修改-->
      <div>
        <span>专业领域</span>
        <a-input v-model="professionField" style="width: 300px; margin: 8px 0;margin-left: 20px;" placeholder="专业领域" allow-clear/>
      </div>
      <div>
        <span>学历</span>
        <a-input v-model="education" style="width: 300px; margin: 8px 0;margin-left: 50px;" placeholder="学历" allow-clear/>
      </div>
      <div>
        <span>毕业学校</span>
        <a-input v-model="graduationSchool" style="width: 300px; margin: 8px 0;margin-left: 20px;" placeholder="毕业学校" allow-clear/>
      </div>
      <div>
        <span>个人简介</span>
        <a-input v-model="personalProfile" style="width: 300px; margin: 8px 0;margin-left: 20px;" placeholder="个人简介" allow-clear/>
      </div>
      <div>
        <span>工作经历</span>
        <a-input v-model="workExperience" style="width: 300px; margin: 8px 0;margin-left: 20px;" placeholder="工作经历" allow-clear/>
      </div>

    </div>
    <div v-else>
      <!--      学生用户资料修改-->
      <div>
        <span>学号</span>
        <a-input v-model="studentId" style="width: 300px; margin: 8px 0;margin-left: 50px;" placeholder="学号" allow-clear/>
      </div>
      <div>
        <span>专业</span>
        <a-input v-model="field" style="width: 300px; margin: 8px 0;margin-left: 50px;" placeholder="专业" allow-clear/>
      </div>
      <div>
        <span>学校名称</span>
        <a-input v-model="schoolName" style="width: 300px; margin: 8px 0;margin-left: 18px;" placeholder="学校名称" allow-clear/>
      </div>
    </div>

    <a-button
        size="large"
        type="primary"
        htmlType="submit"
        class="register-button"
        @click="doEditUser"
        style="width: 300px; margin: 16px 0; display: block"
    >编辑
    </a-button>


    <a-alert
        v-if="isRegisterError"
        type="error"
        showIcon
        style="margin-bottom: 24px;"
        message="该邮箱已存在"
    />

  </div>
</template>

<script>


import axios from "axios";
import api from "@/api/index";

export default {
  name: "UserEdit",
  components: {},
  data() {
    return {
      editEmail: "",
      editPassword: "",
      editAge: "",
      editSex: "",
      editId: "",
      isRegisterError: false,
      editPassAble: false,
      isConsultant: false,
      editContactInfo:"",

      professionField: "",
      education: "",
      graduationSchool: "",
      personalProfile: "",
      workExperience: "",

      studentId: "",
      field: "",
      schoolName: "",
    };
  },
  props: {
    rowData: {
      type: Object, // 数据类型为Object
      required: true // 表示该属性是必需的
    }
  },
  methods: {
    doEditUser() {
      let data = {};
      if (this.isConsultant) {
        data = {
          id: this.editId + '',
          username: this.editEmail,
          password: this.editPassword,
          age: this.editAge,
          sex: this.editSex,
          passAble: this.editPassAble + '',

          isConsultant: this.isConsultant,
          contactInfo: this.editContactInfo,

          professionField: this.professionField,
          education: this.professionField,
          graduationSchool: this.graduationSchool,
          personalProfile: this.personalProfile,
          workExperience: this.workExperience,
        }
      } else {
        data = {
          id: this.editId + '',
          username: this.editEmail,
          password: this.editPassword,
          age: this.editAge,
          sex: this.editSex,
          passAble: this.editPassAble + '',

          isConsultant: this.isConsultant,
          contactInfo: this.editContactInfo,


          studentId: this.studentId,
          field: this.field,
          schoolName: this.schoolName,
        }
      }

      axios
          .post(api.User + "/editUserInfoByAdmin", data, {
            headers: {Authorization: localStorage.token}
          })
          .then(response => {
            var code = response.data.code;
            if (code == 1) {
              this.$message.success('用户编辑成功')
              this.$emit('requestComplete');
            } else if (code == 0) {
              this.isRegisterError = true;
            }
          })
    },
    getExtendUserInfo() {
      if(this.editId == null || this.editId === ''){
        this.editId = localStorage.userId;
      }
      axios
          .get(api.User+"/getExtendUserInfoByAdmin", {
          // .get(api.User + "/getExtendUserInfoByAdmin/"+this.editId+"/"+this.isConsultant, {
            headers: {Authorization: localStorage.token},
            params: {
              isConsultant: this.isConsultant,
              id: this.editId
            }
          })
          .then(response => {
            var code = response.data.code;
            if (code == 1) {
              console.log("response.data.data.professionField");
              console.log(response.data);
              this.professionField = response.data.data.professionField;
              this.education = response.data.data.education;
              this.graduationSchool = response.data.data.graduationSchool;
              this.personalProfile = response.data.data.personalProfile;
              this.workExperience = response.data.data.workExperience;

              this.studentId = response.data.data.studentId;
              this.field = response.data.data.field;
              this.schoolName = response.data.data.schoolName;
              this.initBasicData();


            }
          })

      if(this.editEmail==null || this.editEmail === ''){
        axios
            .get(api.User + '/' + localStorage.userId, {
              headers: { Authorization: localStorage.token }
            })
            .then(response => {
              if (response.data.code == 1) {
                this.editEmail = response.data.data.username
                this.editPassword = '';
                this.editAge = response.data.data.age
                this.editId = response.data.data.id
                if (response.data.data.gender === 'FEMALE') {
                  this.editSex = '女'
                } else if (response.data.data.gender === 'MALE') {
                  this.editSex = '男'
                } else {
                  this.editSex = '其他'
                }
                this.isConsultant = response.data.data.isConsultant === 1;
                console.log(response.data.data);
                console.log("isConsultant");
                this.editContactInfo = response.data.data.contactInfo;
              }
            })
      }

    },
    initBasicData(){
      this.editEmail = this.rowData.username
      this.editPassword = '';
      this.editAge = this.rowData.age
      this.editId = this.rowData.id
      if (this.rowData.gender === 'FEMALE') {
        this.editSex = '女'
      } else if (this.rowData.gender === 'MALE') {
        this.editSex = '男'
      } else {
        this.editSex = '其他'
      }
      this.isConsultant = this.rowData.isConsultant === 1;
      this.editContactInfo = this.rowData.contactInfo;
    }
  },
  mounted() {
    this.initBasicData();
    if(this.rowData.isConsultant == null || this.rowData.isConsultant === ''){
      this.isConsultant = localStorage.isConsultant;
    }
    this.getExtendUserInfo();

    this.professionField = this.rowData.professionField;
    this.education = this.rowData.education;
    this.graduationSchool = this.rowData.graduationSchool;
    this.personalProfile = this.rowData.personalProfile;
    this.workExperience = this.rowData.workExperience;

    this.studentId = this.rowData.studentId;
    this.field = this.rowData.field;
    this.schoolName = this.rowData.schoolName;

  }
};
</script>
<style lang="less">
.user-register {
  &.error {
    color: #ff0000;
  }

  &.warning {
    color: #ff7e05;
  }

  &.success {
    color: #52c41a;
  }
}

.user-layout-register {
  .ant-input-group-addon:first-child {
    background-color: #fff;
  }
}
</style>
<style lang="less" scoped>
.user-layout-register {
  & > h3 {
    font-size: 16px;
    margin-bottom: 20px;
  }

  .register-button {
    width: 50%;
  }

}

</style>
