<template>
  <div class="stats">
    <h3 v-html="stateName + '*'"></h3>
    <ul>
      <li class="positive"><span v-html="totalPositives"></span>Positive</li>
      <li class="recovered"><span v-html="totalRecovered"></span>Recovered</li>
      <li class="deaths"><span v-html="totalDeaths"></span>Deaths**</li>
    </ul>
    <p class="footnotes">
      *Totals to date (<a
        href="https://covidtracking.com/about-data/state-grades"
        target="_blank"
        rel="noopener"
        >data quality grade {{ qualityGrade }}</a
      >)
      <br />
      **Increase since yesterday: {{ increase }}
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
    qualityGrade: String,
    increase: String
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
  .footnotes {
    margin: 5px 0 0 0;
    padding: 10px 0 0 0;
    font-size: 0.875rem;
    color: #666;
    line-height: 1.5;
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
    @media screen and (min-width: $monitorLg) {
      font-size: 0.9375rem;
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
    @media screen and (min-width: $monitorLg) {
      margin-bottom: 30px;
    }
    li {
      text-align: center;
      width: 33.333%;
      @media screen and (max-width: $mobileSm) {
        margin-bottom: 30px;
        width: 100%;
      }
      @media screen and (min-width: $monitorLg) {
        font-size: 1.125rem;
      }
      span {
        font-size: 1.5rem;
        display: block;
        margin-bottom: 3px;
        @media screen and (min-width: $monitorLg) {
          font-size: 2rem;
        }
      }
    }
  }
  font-family: $fontFamily;
  padding: 20px 0 20px 0;
  background: #fff;
  color: #333;
  border-radius: 0 0 8px 8px;
  @media screen and (min-width: $monitorLg) {
    padding: 40px 0 40px 0;
  }
}
</style>
