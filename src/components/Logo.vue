<template>
  <div class="logo">
    <router-link to="/board">
<!--      <img src="../assets/logo.png" alt="logosvg" />-->
<!--      <img src="../assets/favicon.ico" alt="logosvg" />-->
      <img src="../assets/logoSchool.png" alt="logosvg" />
      <h1 v-if="showTitle">{{ title }}</h1>
    </router-link>
  </div>
</template>

<script>

export default {
  name: "Logo",
  props: {
    title: {
      type: String,
      default: "TT",
      required: false
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    }
  }
};
</script>

<style scoped>
h1 {
  color: #fff;
  display: inline-block;
  vertical-align: top;
  font-size: 20px;
  margin: 0 0 0 12px;
  font-weight: 900;
}

img {
  color: rgb(0, 0, 0);
  display: inline-block;
  vertical-align: middle;
  height: 55px;
  width: 55px;
  /* height: 32px;
  width: 72px; */
}
</style>
