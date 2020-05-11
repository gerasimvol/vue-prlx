<template>
  <div id="app">
    <div v-prlx.mobile.background="{ speed: 0.12}" class="img"></div>
  </div>
</template>

<script>
import VuePrlx from '../../src/_directive.js'

export default {
  name: 'App',

  directives: {
    'prlx': VuePrlx
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  min-height: 300vh;
}

.img {
  width: 100px;
  height: 100px;
  margin: 200px auto;
  background-image: url('./assets/logo.png');
  border: 1px solid red;
}
</style>
