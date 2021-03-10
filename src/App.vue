<template>
    <div id="App">
      
        <router-view/>
    </div>
  
</template>

<script>

export default {
  name: 'App',
  components: {
 
  },
  
}
</script>


<style  lang="less">
*{
  margin: 0;
  padding: 0;
}
html,body{
  width: 100%;
  height: 100%;

}
#App{
  height: 100%;

}

</style>
