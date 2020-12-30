<template>
  <div class="wrapper" aria-atomic="true">
    <label>
    <span>Select a state</span>
      <select id="state-selector" @change="onInputChange" :disabled="selectDisabled">
        <option value="AL">Alabama</option>
        <option value="AK">Alaska</option>
        <option value="AZ">Arizona</option>
        <option value="AR">Arkansas</option>
        <option value="CA">California</option>
        <option value="CO">Colorado</option>
        <option value="CT">Connecticut</option>
        <option value="DE">Delaware</option>
        <option value="DC">District Of Columbia</option>
        <option value="FL">Florida</option>
        <option value="GA">Georgia</option>
        <option value="HI">Hawaii</option>
        <option value="ID">Idaho</option>
        <option value="IL">Illinois</option>
        <option value="IN">Indiana</option>
        <option value="IA">Iowa</option>
        <option value="KS">Kansas</option>
        <option value="KY">Kentucky</option>
        <option value="LA">Louisiana</option>
        <option value="ME">Maine</option>
        <option value="MD">Maryland</option>
        <option value="MA">Massachusetts</option>
        <option value="MI" selected>Michigan</option>
        <option value="MN">Minnesota</option>
        <option value="MS">Mississippi</option>
        <option value="MO">Missouri</option>
        <option value="MT">Montana</option>
        <option value="NE">Nebraska</option>
        <option value="NV">Nevada</option>
        <option value="NH">New Hampshire</option>
        <option value="NJ">New Jersey</option>
        <option value="NM">New Mexico</option>
        <option value="NY">New York</option>
        <option value="NC">North Carolina</option>
        <option value="ND">North Dakota</option>
        <option value="OH">Ohio</option>
        <option value="OK">Oklahoma</option>
        <option value="OR">Oregon</option>
        <option value="PA">Pennsylvania</option>
        <option value="RI">Rhode Island</option>
        <option value="SC">South Carolina</option>
        <option value="SD">South Dakota</option>
        <option value="TN">Tennessee</option>
        <option value="TX">Texas</option>
        <option value="UT">Utah</option>
        <option value="VT">Vermont</option>
        <option value="VA">Virginia</option>
        <option value="WA">Washington</option>
        <option value="WV">West Virginia</option>
        <option value="WI">Wisconsin</option>
        <option value="WY">Wyoming</option>
      </select>
    </label> 
    <div class="chart">
      <svg class="spinner" :class="{hide: !loading}" viewBox="0 0 50 50"><circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg>
      <canvas id="covid-chart" width="400" height="200" :class="{loading: loading}"></canvas>
    </div>
    <div class="stats">
      <h3 v-html="stateName + '*'"></h3>
      <ul>
        <li class="positive"><span v-html="totalPositives"></span>Positive</li>
        <li class="recovered"><span v-html="totalRecovered"></span>Recovered</li>
        <li class="deaths"><span v-html="totalDeaths"></span>Deaths</li>
      </ul>
      <p class="grade">*Totals to date (<a href="https://covidtracking.com/about-data/state-grades" target="_blank" rel="noopener">data quality grade {{qualityGrade}}</a>)</p>
    </div>
    <p class="source">Data source: <a href="https://covidtracking.com/data/api" target="_blank" rel="noopener">https://covidtracking.com/data/api</a></p>
  </div>
</template>

<script>
import Chart from 'chart.js';
import axios from 'axios';

export default {
  name: 'Home',
  created(){
    document.title = 'U.S. COVID-19 data by state | ryanwells.com';
    this.getData(this.stateAbbrev);
  },
  mounted() {
    this.vueCanvas = document.getElementById('covid-chart').getContext('2d');
    this.createChart();
    this.dataReady = true;
  },
  data()  {
    return {
      vueCanvas: null,
      vueChart: null,
      loading: true,
      monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      selectDisabled: false,
      dataReady: false,
      stateAbbrev: 'mi',
      stateNameBuffered: 'Michigan',
      stateName: '',
      totalPositives: '',
      totalRecovered: '',
      totalDeaths: '',
      qualityGrade: '',
      chartData: {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            {
              data: [],
              fill: false,
              label: 'Positive',
              backgroundColor: 'SteelBlue',
              borderColor: 'SteelBlue',
              borderWidth: 3
            },
            {
              data: [],
              fill: false,
              label: 'Recovered',
              backgroundColor: 'SeaGreen',
              borderColor: 'SeaGreen',
              borderWidth: 3
            },
            {
              data: [],
              fill: false,
              label: 'Deaths',
              backgroundColor: 'Tomato',
              borderColor: 'Tomato',
              borderWidth: 3
            }
          ]
        },
        options: {
          layout: {
            padding: 10
          },
          legend: {
            position: 'bottom',
            fillStyle: Color,
            usePointStyle: true,
            pointStyle: 'pointer',
            onHover: function (e) {
              e.target.style.cursor = 'pointer';
            }
          },
          hover: {
            onHover: (event, chartElement) => {
              event.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
            }
          },
          tooltips: {
            mode: 'nearest',
            callbacks: {
              label: function (tooltipItem, data) {
                return tooltipItem.yLabel
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
              }
            }
          },
          title: {
            display: true,
            fontColor: '#555555',
            text: 'U.S. COVID-19 data by state',
            fontSize: 15
          },
          scales: {
            yAxes: [
              {
                scaleLabel: {
                  display: true,
                  fontSize: 14,
                  labelString: 'Population'
                },
                ticks: {
                  beginAtZero: false,
                  callback: function (value, index, values) {
                    return value.toLocaleString();
                  }
                }
              }
            ],
            xAxes: [
              {
                scaleLabel: {
                  display: false,
                  labelString: 'Month of the Year'
                }
              }
            ]
          }
        }
      }
    };
  },
  methods: {
    onInputChange(e) {
      this.selectDisabled = true; // temporarily disable select elm while data is being fetched
      this.loading = true;
      this.stateAbbrev = e.target.value.toLowerCase();
      this.stateNameBuffered = e.target.selectedOptions[0].text;
      this.vueChart.reset();
      // api call using selected state
      this.getData(this.stateAbbrev);

      // set data ready flag to false so chart doesn't render before data is ready
      this.dataReady = false;
    },
    getData(state) {
      //const url = 'https://api.covidtracking.com/v1/states/mi/daily.json';
      axios.get(`https://api.covidtracking.com/v1/states/${state}/daily.json`).then(response => {
        // clear existing arrays
        this.chartData.data.labels = [];
        this.chartData.data.datasets[0].data = [];
        this.chartData.data.datasets[1].data = [];
        this.chartData.data.datasets[2].data = [];

        // set stats for totals
        this.totalPositives = response.data[0].positive ? response.data[0].positive.toLocaleString() : 'N/A';
        this.totalRecovered = response.data[0].recovered ? response.data[0].recovered.toLocaleString() : 'N/A';
        this.totalDeaths = response.data[0].death ? response.data[0].death.toLocaleString() : 'N/A';
        this.qualityGrade = response.data[0].dataQualityGrade ? response.data[0].dataQualityGrade : 'N/A';

        response.data.forEach((e, i) => {
          // find stats for the first of each month
          if (e.date.toString().substring(6, 9) === '01') {
            // format date
            let abbrevMonth = this.monthNames[e.date.toString().substring(4, 6) - 1].substring(0, 3);
            let abbrevYear = e.date.toString().substring(2, 4);
            
            // push data to arrays
            this.chartData.data.labels.unshift(abbrevMonth + ' \u0027' + abbrevYear);
            this.chartData.data.datasets[0].data.unshift(e.positive);
            this.chartData.data.datasets[1].data.unshift(e.recovered);
            this.chartData.data.datasets[2].data.unshift(e.death);
          }
        });
      }).catch((error)=> {
        console.log(error);
      }).then(()=> {
        // set data ready flag for the onDataReady method
        this.dataReady = true;
        this.onDataReady();
      });
    },
    onDataReady() {
      const check = setTimeout(()=> {
        // call recursively until dateReady is set to true
        this.dataReady ? this.displayData() : this.onDataReady();
      },50);
    },
    displayData() {
      this.selectDisabled = false; // re-enable select elm
      this.loading = false; // reduces opacity of chart to inicate loading
      this.stateName = this.stateNameBuffered; // times the display of the state name heading with the rendering of the chart
      this.vueChart.update(); // render the chart
    },
    createChart() {
      this.vueChart = new Chart(this.vueCanvas, this.chartData);
    }
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 15px;
}

label {
  display: block;
  margin: 20px 0;
  @media screen and (max-width: 600px) {
    text-align: right;
  }
  span {
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }
}

select {
  font-family: "Roboto", sans-serif;
  font-size: 0.8125rem;
  padding: 5px 10px;
  margin-left: 0;
  border-color: #bbb;
  margin-left: 0;
  border-radius: 5px;
}

.chart {
  position: relative;
  background: #fff;
  padding: 5px 10px;
  border-radius: 8px 8px 0 0;
  #covid-chart {
    opacity: 1;
    transition: opacity 0.25s;
    &.loading {
      opacity: 0.7!important;
      transition: opacity 0.25s
    }
    @media screen and (max-width: 539px) {
      display: none !important;
    }
  }
}

.stats {
  h3 {
    margin: 5px 0 20px 0;
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
    margin-bottom: 26px;
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
  font-family: "Roboto", sans-serif;
  padding: 10px 30px 20px 30px;
  background: #fff;
  color: #333;
  border-radius: 0 0 8px 8px;
}
.source {
  font-family: "Roboto", sans-serif;
  font-size: 0.8125rem;
  padding: 3px;
  margin: 30px 0 30px 0;
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

.spinner {
  -webkit-animation: rotate 2s linear infinite;
          animation: rotate 2s linear infinite;
  z-index: 2;
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -25px 0 0 -25px;
  width: 50px;
  height: 50px;
}
.spinner .path {
  stroke: #aaa;
  stroke-linecap: round;
  -webkit-animation: dash 1.5s ease-in-out infinite;
          animation: dash 1.5s ease-in-out infinite;
}

@-webkit-keyframes rotate {
  100% {
    -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
  }
}

@keyframes rotate {
  100% {
    -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
  }
}
@-webkit-keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}
@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}
.hide {
  display: none;
}
</style>
