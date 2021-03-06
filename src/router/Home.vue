<template>
  <StateSelect @stateChosen="onInputChange" :loading="loading" />
  <div class="chart">
    <Spinner :loading="loading" />
    <canvas
      id="covid-chart"
      width="400"
      height="200"
      :class="{ loading: loading }"
    ></canvas>
  </div>
  <Stats
    :stateName="stateName"
    :totalPositives="totalPositives"
    :totalRecovered="totalRecovered"
    :totalDeaths="totalDeaths"
    :qualityGrade="qualityGrade"
    :increase="increasedDeaths"
  />
</template>

<script>
import Chart from 'chart.js';
import axios from 'axios';

import StateSelect from '../components/StateSelect';
import Spinner from '../components/Spinner';
import Stats from '../components/Stats';

export default {
  name: 'Home',
  components: {
    StateSelect,
    Spinner,
    Stats
  },
  created() {
    document.title = 'U.S. COVID-19 data by state | ryanwells.com';
    this.getData(this.stateAbbrev);
  },
  mounted() {
    this.vueCanvas = document.getElementById('covid-chart').getContext('2d');
    this.createChart();

    // fix chart not resizing correctly
    window.addEventListener('resize', () => {
      if (this.chartReady) {
        let delay = setTimeout(() => {
          this.vueChart.resize();
        }, 450);
      }
    });
    window.addEventListener('deviceorientation', () => {
      if (this.chartReady) {
        this.vueChart.resize();
      }
    });
  },
  data() {
    return {
      vueCanvas: null,
      vueChart: null,
      loading: true,
      monthNames: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ],
      chartReady: false,
      stateAbbrev: 'mi',
      stateNameBuffered: 'Michigan',
      stateName: '',
      totalPositives: '',
      totalRecovered: '',
      totalDeaths: '',
      increasedDeaths: '',
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
            onHover: function(e) {
              e.target.style.cursor = 'pointer';
            }
          },
          hover: {
            onHover: (event, chartElement) => {
              event.target.style.cursor = chartElement[0]
                ? 'pointer'
                : 'default';
            }
          },
          tooltips: {
            mode: 'nearest',
            callbacks: {
              label: function(tooltipItem, data) {
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
                  callback: function(value, index, values) {
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
    onInputChange(state) {
      this.loading = true;
      this.stateAbbrev = state.value.toLowerCase();
      this.stateNameBuffered = state.text;
      this.vueChart.reset();
      // api call using selected state
      this.getData(this.stateAbbrev);
    },
    getData(state) {
      axios
        .get(`https://api.covidtracking.com/v1/states/${state}/daily.json`)
        .then(response => {
          // clear existing arrays
          this.chartData.data.labels = [];
          this.chartData.data.datasets[0].data = [];
          this.chartData.data.datasets[1].data = [];
          this.chartData.data.datasets[2].data = [];
          // set stats for totals
          this.totalPositives = response.data[0].positive
            ? response.data[0].positive.toLocaleString()
            : 'N/A';
          this.totalRecovered = response.data[0].recovered
            ? response.data[0].recovered.toLocaleString()
            : 'N/A';
          this.totalDeaths = response.data[0].death
            ? response.data[0].death.toLocaleString()
            : 'N/A';
          this.qualityGrade = response.data[0].dataQualityGrade
            ? response.data[0].dataQualityGrade
            : 'N/A';
          this.increasedDeaths =
            response.data[0].deathIncrease !== null
              ? response.data[0].deathIncrease.toLocaleString()
              : 'N/A';

          response.data.forEach((e, i) => {
            // find stats for the first of each month
            if (e.date.toString().substring(6, 9) === '01') {
              // format date
              let abbrevMonth = this.monthNames[
                e.date.toString().substring(4, 6) - 1
              ].substring(0, 3);
              let abbrevYear = e.date.toString().substring(2, 4);

              // push data to arrays
              this.chartData.data.labels.unshift(
                abbrevMonth + ' \u0027' + abbrevYear
              );
              this.chartData.data.datasets[0].data.unshift(e.positive);
              this.chartData.data.datasets[1].data.unshift(e.recovered);
              this.chartData.data.datasets[2].data.unshift(e.death);
            }
          });
        })
        .finally(() => {
          this.displayData();
        })
        .catch(error => {
          console.log(error);
        });
    },
    displayData() {
      this.loading = false;
      this.stateName = this.stateNameBuffered; // times the display of the state name heading with the rendering of the chart
      if (!this.chartReady) {
        this.$nextTick(this.vueChart.update());
      } else {
        this.vueChart.update();
      } // render/re-render the chart
    },
    createChart() {
      this.vueChart = new Chart(this.vueCanvas, this.chartData);
      if (!this.chartReady) {
        this.chartReady = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.chart {
  position: relative;
  background: #fff;
  padding: 5px 10px;
  border-radius: 8px 8px 0 0;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  @media screen and (max-width: 539px) {
    display: none !important;
  }
  #covid-chart {
    opacity: 1;
    transition: opacity 0.25s;
    &.loading {
      opacity: 0.7 !important;
      transition: opacity 0.25s;
    }
  }
}
</style>
