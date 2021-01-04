<template>
  <div class="stats">
    <h3 v-html="stateName + '*'"></h3>
    <ul>
      <li class="positive"><span v-html="totalPositives"></span>Positive</li>
      <li class="recovered"><span v-html="totalRecovered"></span>Recovered</li>
      <li class="deaths"><span v-html="totalDeaths"></span>Deaths</li>
    </ul>
    <p class="grade">
      *Totals to date (<a
        href="https://covidtracking.com/about-data/state-grades"
        target="_blank"
        rel="noopener"
        >data quality grade {{ qualityGrade }}</a
      >)
    </p>
  </div>
</template>

<script>
export default {
  name: 'Stats',
  props: {
    stateName: String,
    totalPositives: String,
    totalRecovered: String,
    totalDeaths: String,
    qualityGrade: String
  }
};
</script>

<style lang="scss" scoped>
.stats {
  h3 {
    margin: 5px 0 15px 0;
    padding: 0 0 5px 0;
    text-align: center;
    font-size: 1.375rem;
    font-weight: 500;
  }
  .grade {
    margin: 5px 0 8px 0;
    padding: 10px 0 0 0;
    font-size: 0.835rem;
    color: #666;
    a {
      color: #427aa9;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
    @media screen and (max-width: 375px) {
      text-align: center;
    }
  }
  ul {
    margin: 0 auto;
    margin-bottom: 20px;
    padding: 0;
    max-width: 80%;
    list-style-type: none;
    @media screen and (min-width: 376px) {
      display: flex;
      justify-content: space-evenly;
    }
    li {
      text-align: center;
      width: 33.333%;
      @media screen and (max-width: 375px) {
        margin-bottom: 30px;
        width: 100%;
      }
      span {
        font-size: 1.5rem;
        display: block;
        margin-bottom: 3px;
      }
    }
  }
  font-family: 'Roboto', sans-serif;
  padding: 20px 0 20px 0;
  background: #fff;
  color: #333;
  border-radius: 0 0 8px 8px;
}
</style>
