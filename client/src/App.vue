<template>
  <div id="app">
    <router-link to="/Projects">Projects</router-link>
    <router-link to="/">ToDo</router-link>
    <router-view/>
  </div>
</template>
<script>
export default {
  name: 'app',
  data () {
    return {

    }
  }
}
</script>
<style>
</style>
