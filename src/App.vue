<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App',
    created() {
      const host = window.location.host;
      let domain = this.getQueryString('domain');
      // let currentDomain = sessionStorage.getItem('seller_domain');
      // if (domain && currentDomain != domain) {
      if (domain) {
        sessionStorage.setItem('seller_domain', domain)
        window.location.href = `http://${host}/?domain=${domain}#/login`;
        return;
      }
    },
    methods: {
      // getQueryString(name, url) {
      //   // url = url || window.location.href.split('?')[1];
      //   let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      //   let urlFormat = url.substr(7)
      //   let r = urlFormat.substr(1).match(reg);
      //   if (r != null) return (r[2]);
      //   return null;
      // }
      getQueryString(name) {
        let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        let r = window.location.search.substr(1).match(reg);
        if (r != null) {
          return unescape(r[2]);
        }
        return null;
      }
    }
  }
</script>
