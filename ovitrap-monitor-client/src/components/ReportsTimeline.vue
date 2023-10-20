<template>
<v-row align="center">
      <v-col
        class="d-flex align-center"
        cols="3" 
      >
          <v-select
          :items="modes"
          v-model="mode"
          :label="$t('time-scale')"
          density="compact"
          variant="plain"
          hide-details
          color="primary"
        ></v-select>
      </v-col>
      <v-col
        class="d-flex align-center"
        cols="3" 
      >
      </v-col>
      <v-col
        class="d-flex justify-end align-center"
        cols="6" 
      >
          <v-btn @click="downloadData()" variant="outlined" color="primary">{{ $t('download') }} {{ $t('data') }}</v-btn>&nbsp;
          <v-btn @click="downloadPlot()" variant="outlined" color="primary">{{ $t('download') }} {{ $t('plot') }}</v-btn>
      </v-col>
</v-row>
  <Line
    ref="LineChart"
    :chart-options="chartOptions"
    :chart-data="chartData"
    :chart-id="chartId"
    :dataset-id-key="datasetIdKey"
    :plugins="plugins"
    :css-classes="cssClasses"
    :styles="styles"
    :width="width"
    :height="height"
  />
</template>

<script>
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Filler,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  Filler,
  PointElement,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  LineController
);
import store from "../store";

import { getWeekNumber, displayDateDash, getDateByWeek, getFirstMondayOfMonth } from "../plugins/utils";

export default {
  name: "ReportsTimeline",
  props: {
    dateReport: Date,
    chartId: { type: String, default: "bar-chart", },
    datasetIdKey: { type: String, default: "label", },
    width: { type: Number, default: 400, },
    height: { type: Number, default: 100, },
    cssClasses: { default: "", type: String, },
    styles: { type: Object, default: () => {}, },
    plugins: { type: Object, default: () => {}, },
  },
  components: {
    Line,
  },
  data() {
    return {
        nToDisplay: 10,
        mode: this.$t('weekly'),
        currentDateDisp: "",
        chartData: {
        labels: ["", "", "", "", "", "", "", "", "", ""],
        datasets: [
          {
            label: this.$t('mean'),
            type: "line",
            backgroundColor: "rgb(0, 0, 0, 0, 1)",
            borderColor: "rgb(0, 0, 0)",
            hoverBorderColor: "rgb(0, 0, 0)",
            fill: 0,
            tension: 0,
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            yAxisID: "y",
            xAxisID: "x",
          },
          {
            label: this.$t('90th') + " " + this.$t('percentile'),
            type: "line",
            backgroundColor: "rgb(200, 200, 200, 0.3)",
            borderColor: "rgb(200, 200, 200, 0.2)",
            hoverBorderColor: "rgb(200, 200, 200)",
            fill: "+1",
            tension: 0,
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            yAxisID: "y",
            xAxisID: "x",
          },
          {
            label: this.$t('10th') + " " + this.$t('percentile'),
            type: "line",
            backgroundColor: "rgb(200, 200, 200, 0.3)",
            borderColor: "rgb(200, 200, 200, 0.2)",
            hoverBorderColor: "rgb(200, 200, 200)",
            fill: "+2",
            tension: 0,
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            yAxisID: "y",
            xAxisID: "x",
          },
        ],
      },
      chartOptions: {
        responsive: true
      },
    };
  },
  mounted: function () {
    
  },
  watch: {
      dateReport: function() {
          this.plot()
      },
      mode: function() {
        this.plot()
      }
  },
  computed: {
    modes: function() { return [this.$t('weekly'), this.$t('monthly')] },
  },
  methods: {
    getRecords: function () {
      store.commit("getDatabaseRecords", {
        username: store.state.user.username,
        date_from: this.filterDateFrom,
        date_until: this.filterDateTo,
        location_code: this.filterLocation,
      });
    },
    downloadData: function() {
      let csvContent = "data:text/csv;charset=utf-8,";

      // header
      let rowArray = [this.$t('mean'), this.$t('10th') + " " + this.$t('percentile'), this.$t('90th') + " " + this.$t('percentile')]
      let row = rowArray.join(",");
      csvContent += row + "\r\n";

      // content
      let weekIndex = 0
      while(weekIndex < this.chartData.datasets[0].data.length) {
        let rowArray = [
          this.chartData.datasets[0].data[weekIndex], 
          this.chartData.datasets[2].data[weekIndex], 
          this.chartData.datasets[1].data[weekIndex],
        ]
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
        weekIndex += 1
      } 

      var encodedUri = encodeURI(csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "mosquitos_" +  this.currentDateDisp + ".csv");
      document.body.appendChild(link); 
      link.click(); 
    },
    downloadPlot: function() {
       // get the component via the ref we set up in the template
      const componentCanvas = document.getElementById('bar-chart')

      const ctx = componentCanvas.getContext('2d');
      ctx.save();
      ctx.globalCompositeOperation = 'destination-over';
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, componentCanvas.width, componentCanvas.height);
      ctx.restore();

      // the component itself has a ref to the canvas element.
      // https://github.com/apertureless/vue-chartjs/blob/develop/src/BaseCharts/Line.js#L20
      var link = document.createElement("a");
      link.setAttribute("href", componentCanvas.toDataURL('image/png'));
      link.setAttribute("download", "mosquitos_" +  this.currentDateDisp + ".png");
      document.body.appendChild(link); 
      link.click(); 

    },
    plot: function() {
      if(this.mode == this.$t('weekly')) {
        this.plotWeekly()
      }
      else {
        this.plotMonthly()
      }
    },
    plotMonthly: function() {
        let n = this.nToDisplay;
        let dateYear = this.dateReport.getFullYear();
        let dateMonth = this.dateReport.getMonth();
        let date_current_mnm = new Date(getFirstMondayOfMonth(dateYear, dateMonth - n))
        // date_current_mnm.setMonth(date_current_mnm.getMonth() - n)// minus n months
        let date_current_p1m = new Date(getFirstMondayOfMonth(dateYear, dateMonth + 1))
        // date_current_p1m.setMonth(date_current_mnm.getMonth() + 1) // plus one month

        console.log("mnm, p1m", date_current_mnm, date_current_p1m)
        this.currentDateDisp = displayDateDash(this.dateReport)
        store.commit('getDatabaseRecords', { 
          username: store.state.user.username,
          date_from: displayDateDash(date_current_mnm),
          date_until: displayDateDash(date_current_p1m),
          processed: 1,
        })
        
        // get records from week n-5 until week n
        // element 0 contains records from current week
        // element 1 contains the ones from week before that, so on
        let monthIndex = n - 1 
        let recordsPerMonth = []
        while(monthIndex >= 0) {
            recordsPerMonth.push({})
            // also use this loop to write the plot labels
            this.chartData.labels[monthIndex] = displayDateDash(getFirstMondayOfMonth(dateYear, dateMonth + monthIndex + (1-n)))
            monthIndex -= 1
        }

        // here we take the records for each month
        if(store.state.map.records) {
            store.state.map.records.forEach(function(record) {
            let date_record = new Date(record.timestamp_upload)

                let monthIndex = n - 1 
                while(monthIndex >= 0) {
                    let date_current = getFirstMondayOfMonth(dateYear, dateMonth - monthIndex) //getDateByWeek(dateYear, dateWeek - monthIndex) 
                    let date_current_p1m = getFirstMondayOfMonth(dateYear, dateMonth - monthIndex + 1) 

                    // current week
                    if(date_current < date_record && date_record < date_current_p1m) {
                        // debug: recordsPerWeek[weekIndex]["A"] = date_current
                        recordsPerMonth[monthIndex][record.timestamp_upload + "_" + record.location_code] = record.front_count + record.back_count
                    }

                    monthIndex -= 1
                }
            })
        }
        
        // for each month
        let recordsAvgs = []
        let recordsPrcs10 = []
        let recordsPrcs90 = []
        recordsPerMonth.forEach(function (records) {
            let recordsWS = []
            Object.keys(records).forEach(function(loc) {
                recordsWS.push(Math.round(records[loc]))
            })
            recordsWS.sort((a, b) => a - b)
            let avg = 0
            let prc10 = 0
            let prc90 = 0
            if(recordsWS.length > 0) {
                // compute mean number of eggs
                avg = recordsWS.reduce((a,b) => a + b) / recordsWS.length

                let indexPrc10 = Math.round(recordsWS.length / 10)
                let indexPrc90 = Math.round(recordsWS.length * 9 / 10)
                prc10 = recordsWS[indexPrc10]
                prc90 = recordsWS[indexPrc90]
            }
            else {
                avg = 0
            }
            recordsAvgs.push(avg)
            recordsPrcs10.push(prc10)
            recordsPrcs90.push(prc90)

        });
        // reverse
        recordsAvgs = recordsAvgs.reverse()
        recordsPrcs10 = recordsPrcs10.reverse()
        recordsPrcs90 = recordsPrcs90.reverse()
        
        // compute 
        monthIndex = 0
        let recordsStdsUp = []
        let recordsStdsDown = []
        while(monthIndex < n) {
            recordsStdsUp.push(recordsPrcs90[monthIndex])
            recordsStdsDown.push(recordsPrcs10[monthIndex])
            monthIndex += 1
        }
        
        // plot time series
        this.chartData.datasets[0].data = recordsAvgs
        this.chartData.datasets[1].data = recordsStdsUp
        this.chartData.datasets[2].data = recordsStdsDown

        // works but UI needs to change mode too
    },
    plotWeekly: function() {
        let n = this.nToDisplay;
        let dateYear = this.dateReport.getFullYear();
        let dateWeek = getWeekNumber(this.dateReport);
        let date_current_mnw = getDateByWeek(dateYear, dateWeek - n) // minus n weeks
        let date_current_p1w = getDateByWeek(dateYear, dateWeek + 1) // plus one week


        this.currentDateDisp = displayDateDash(getDateByWeek(dateYear, dateWeek))
        store.commit('getDatabaseRecords', { 
            username: store.state.user.username,
            date_from: displayDateDash(date_current_mnw),
            date_until: displayDateDash(date_current_p1w),
            processed: 1,
        })
        
        // get records from week n-5 until week n
        // element 0 contains records from current week
        // element 1 contains the ones from week before that, so on
        let weekIndex = n - 1 
        let recordsPerWeek = []
        while(weekIndex >= 0) {
            recordsPerWeek.push({})
            // also use this loop to write the plot labels
            this.chartData.labels[weekIndex] = displayDateDash(getDateByWeek(dateYear, dateWeek + weekIndex + (1-n)))
            weekIndex -= 1
        }

        // here we take the records for each week
        if(store.state.map.records) {
            store.state.map.records.forEach(function(record) {
            let date_record = new Date(record.timestamp_upload)

                let weekIndex = n - 1 
                while(weekIndex >= 0) {
                    let date_current = getDateByWeek(dateYear, dateWeek - weekIndex) 
                    let date_current_p1w = getDateByWeek(dateYear, dateWeek - weekIndex + 1) 

                    // current week
                    if(date_current < date_record && date_record < date_current_p1w) {
                        // debug: recordsPerWeek[weekIndex]["A"] = date_current
                        recordsPerWeek[weekIndex][record.location_code] = record.front_count + record.back_count
                    }

                    weekIndex -= 1
                }
            })
        }
        
        // for each week
        let recordsAvgs = []
        let recordsStds = []
        let recordsPrcs10 = []
        let recordsPrcs90 = []
        recordsPerWeek.forEach(function (records) {
            let recordsWS = []
            Object.keys(records).forEach(function(loc) {
                recordsWS.push(Math.round(records[loc]))
            })
            recordsWS.sort((a, b) => a - b)
            let avg = 0
            let std = 0
            let prc10 = 0
            let prc90 = 0
            if(recordsWS.length > 0) {
                // compute mean number of eggs
                avg = recordsWS.reduce((a,b) => a + b) / recordsWS.length

                let indexPrc10 = Math.round(recordsWS.length / 10)
                let indexPrc90 = Math.round(recordsWS.length * 9 / 10)
                prc10 = recordsWS[indexPrc10]
                prc90 = recordsWS[indexPrc90]
                std = Math.sqrt(
                    recordsWS.map(x => Math.pow(x - avg, 2)).reduce((a,b) => a + b) / recordsWS.length 
                )
            }
            else {
                avg = 0
                std = 0
            }
            recordsAvgs.push(avg)
            recordsStds.push(std)
            recordsPrcs10.push(prc10)
            recordsPrcs90.push(prc90)

        });
        // reverse
        recordsAvgs = recordsAvgs.reverse()
        recordsStds = recordsStds.reverse()
        recordsPrcs10 = recordsPrcs10.reverse()
        recordsPrcs90 = recordsPrcs90.reverse()
        
        // compute 
        weekIndex = 0
        let recordsStdsUp = []
        let recordsStdsDown = []
        while(weekIndex < n) {
            recordsStdsUp.push(recordsPrcs90[weekIndex])
            recordsStdsDown.push(recordsPrcs10[weekIndex])
            weekIndex += 1
        }
        
        // plot time series
        this.chartData.datasets[0].data = recordsAvgs
        this.chartData.datasets[1].data = recordsStdsUp
        this.chartData.datasets[2].data = recordsStdsDown
    }
  },
};
</script>
