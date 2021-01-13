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
  font-family: $fontFamily;
  font-size: 0.875rem;
  padding: 0;
  margin: 0;
  color: #666;
  @media screen and (max-width: $mobileSm) {
    text-align: center;
  }
  @media screen and (min-width: $monitorLg) {
    font-size: 0.9375rem;
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
