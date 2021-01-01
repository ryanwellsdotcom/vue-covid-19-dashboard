<template>
  <div class="wrapper" aria-atomic="true">
    <GithubCorner />
    <Home />
  </div>
</template>

<script>
import Home from './router/Home';
import GithubCorner from './components/GithubCorner';

export default {
  name: 'App',
  components: {
    Home,
    GithubCorner
  }
};
</script>

<style lang="scss">
@import '../node_modules/normalize.css/normalize.css';

body {
  font-family: 'Roboto', sans-serif;
  background: #eee;
  margin: 0;
}

.wrapper {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 15px;
}
</style>
