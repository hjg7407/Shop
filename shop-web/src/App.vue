<template>
  <div id="app">
    <header-info />
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <footer-info />
  </div>
</template>

<script>
  import HeaderInfo from './components/header/HeaderInfo'
  import FooterInfo from './components/footer/FooterInfo'
  export default {
    name: 'App',
    components: { HeaderInfo, FooterInfo }
  }
</script>
