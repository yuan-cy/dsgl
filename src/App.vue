<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="less">
*{
  margin: 0;
  padding: 0;
}
html,body{
  width: 100%;
  height: 100%;
  #app{
    width: 100%;
    height: 100%;
    min-width: 1366px;
  }
}
.el-step__title {
        font-size: 13px !important;
    }
    .ql-editor{
      min-height: 300px;
    }
</style>
