<template>
  <div class="wrapper" aria-atomic="true">
    <GithubCorner />
    <Home />
  </div>
  <footer>
    <div class="wrapper">
      <Footer />
    </div>
  </footer>
</template>

<script>
import Home from './router/Home';
import GithubCorner from './components/GithubCorner';
import Footer from './components/Footer';

export default {
  name: 'App',
  components: {
    Home,
    GithubCorner,
    Footer
  }
};
</script>

<style lang="scss">
@import '../node_modules/normalize.css/normalize.css';

body {
  font-family: 'Roboto', sans-serif;
  background: #fff;
  margin: 0;
}

#app {
  position: absolute;

  height: 100%;
  width: 100%;
  display: flex;
  flex-flow: column;
}
.wrapper {
  width: calc(100% - 30px);
  max-width: 960px;
  margin: 0 auto;
  padding: 0 15px;
  @media screen and (min-width: 1500px) {
    max-width: 1170px;
  }
}

footer {
  flex-grow: 1;
  padding: 30px 0;
  background-color: #eee;
}
</style>
