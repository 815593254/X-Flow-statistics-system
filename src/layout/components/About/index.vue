<template>
  <div class="about-main">
    <div class="about-box">
      <div class="about-head">
        <div class="about-title">{{ $t('navbar.about') }}</div>
        <svg-icon class="about-icon1" icon-class="close" @click="$emit('clickOut')" />
      </div>
      <div class="about-icon">
        <!--<img src="../../../../public/logo-esm-black.svg" class="logo-esm">-->
      </div>
      <div class="about-text">{{ $t('navbar.app') }}</div>
      <div class="about-version">V6.8.0</div>
      <a target="_blank" :href="$t('navbar.link')">
        <div class="about-text1">{{ $t('navbar.company') }}</div>
      </a>
    </div>
    <div class="about-cover" @click="$emit('clickOut')" />
  </div>
</template>

<script>

export default {
  computed: {

  },
  methods: {

  }
}
</script>

<style scoped>
.about-main{
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 2065;
  align-items: center;
}
.about-box{
  z-index: 2066;
  width: 240px;
  /* height: 220px; */
  background: #FFFFFF;
  border: 1px solid #F1F2F2;
  border-radius: 4px;
  border-radius: 4px;
  padding: 12px 20px 20px 20px;
}
.about-head{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.about-title{
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
  font-size: 14px;
  color: #000E18;
  letter-spacing: 0;
  line-height: 18px;
}
.about-icon1{
  font-size: 12px;;
  cursor: pointer;
}
.about-cover{
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: .5;
  background: #000;
  z-index: 2065;
}
.about-icon{
  margin-top: 20px;
  text-align: center;
}
.about-text{
  margin-top: 10px;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
  font-size: 14px;
  color: #000E18;
  letter-spacing: 0;
  line-height: 18px;
  text-align: center;
}
.about-version{
  margin-top: 12px;
  text-align: center;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
  font-size: 12px;
  color: #CCCFD1;
  letter-spacing: 0;
}
.about-text1{
  text-align: center;
  margin-top: 25px;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
  font-size: 12px;
  color: #1890FF;
  letter-spacing: 0;
  text-align: center;
}
</style>
