<template>
  <p class="source">
    Data source:
    <a href="https://covidtracking.com/data/api" target="_blank" rel="noopener"
      >https://covidtracking.com/data/api</a
    >
  </p>
</template>
<script>
export default {
  name: 'Footer'
};
</script>

<style lang="scss" scoped>
.source {
  font-family: 'Roboto', sans-serif;
  font-size: 0.8125rem;
  padding: 0;
  margin: 0;
  color: #666;
  @media screen and (max-width: 375px) {
    text-align: center;
  }
  a {
    color: #3c709a;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
