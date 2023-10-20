<template>
    <NavigationDrawer />

      <v-row dense>
        <v-col class="d-flex justify-space-between">
          <h1 class="mb-5">{{ $t('reports') }}</h1>
        </v-col>
        <v-col class="d-flex align-center justify-end">
          <v-btn flat
              icon="mdi-chevron-left"
              color="secondary"
              @click="changeWeek(-1)"
            ></v-btn> 
            &nbsp;
            &nbsp;
            <h4 class="align-self-center ">{{ dateDisplay }}</h4>
            &nbsp;
            &nbsp;
          <v-btn flat
              icon="mdi-chevron-right"
              color="secondary"
              @click="changeWeek(1)"
            ></v-btn>
        </v-col>
      </v-row>


    <v-container>
      <v-row dense class="mb-5">

        <v-col class="md-12 mb-5">
          <h3 class="mb-5">{{ $t('reports-current-trend') }}</h3>
          <ReportsTimeline :dateReport="this.dateReport" />
        </v-col>

      </v-row>
      <v-row dense>

        <v-col class="md-4 mb-5">
          <h3 class="mb-5">{{ $t('reports-insights-for-week') }} {{ dateDisplayShort }} </h3>
                   
          <!-- Number of positive ovitraps / number of ovitraps collected (%)  -->
          <p><strong>{{ $t('reports-positive-ovitrap-ratio') }} :</strong><br />{{ stats.ratio }}<br /><br /></p>
          
          <!-- Non-zero mean and std of positive ovitrap counts -->
          <p><strong>{{ $t('reports-average-positive-ovitrap-count') }} :</strong><br />  {{ stats.avg[0] }} +/- {{ stats.avg[1] }}<br /><br /></p>

          <!-- Increase / decrease since last week -->
          <p><strong>{{ $t('reports-difference-since-previous-week') }} :</strong><br /> {{ stats.difference }}%<br /><br /></p>


    
        </v-col>


        <v-col class="md-4">
          <h3 class="mb-5">{{ $t('reports-eggs-per-ovitrap-station-at-week') }} {{ dateDisplayShort }}</h3>
          <MapAbsolute :dateMap="this.dateReport" />
       </v-col>

        <v-col class="md-4">
          <h3 class="mb-5">{{ $t('reports-evolution-from-week') }} {{ dateDisplayShort-1 }} {{ $t('until') }} {{ dateDisplayShort }}</h3>
          <MapRelative :dateMap="this.dateReport" />
       </v-col>
      </v-row>


    </v-container>



</template>

<script>
import { defineComponent } from 'vue';

import store from '../store'

import NavigationDrawer from '../components/NavigationDrawer.vue';
import MapAbsolute from '../components/MapAbsolute.vue';
import MapRelative from '../components/MapRelative.vue';
import ReportsTimeline from '../components/ReportsTimeline.vue';

import { getWeekNumber, getDateByWeek, getMonthInLetters } from '../plugins/utils'

export default defineComponent({
  name: 'ReportsView',
  data: function() {
    return {
      dateReport:  new Date(),
      dateDisplay: "",
      dateDisplayShort: "",
    }
  },
  components: {
    NavigationDrawer,
    MapAbsolute,
    MapRelative,
    ReportsTimeline
  },
  mounted: function() {
    // get date of last Monday
    this.dateReport = new Date()
    this.dateReport.setDate(this.dateReport.getDate() - this.dateReport.getDay() + 1) 
    this.dateReport.setHours(0) 
    this.displayDate(this.dateReport)

    // load eggs 
    store.commit('getSticksByUser', { 
      username: store.state.user.username,
      processed: 1
    })

  },
  computed: {
    stats: function() {
      let recordsKeptCurrentWeek = {}
      let recordsKeptLastWeek = {}
      let dateYear = this.dateReport.getFullYear()
      let dateWeek = getWeekNumber(this.dateReport)
      let date_current = getDateByWeek(dateYear, dateWeek) 
      let date_current_m1w = getDateByWeek(dateYear, dateWeek - 1) 
      let date_current_p1w = getDateByWeek(dateYear, dateWeek + 1) // plus one week

      // here we take the count of week n and week n-1
      if(store.state.map.records) {
        let numberOfOvitraps = 0
        let numberOfPositiveOvitraps = 0
        let totalCountLastWeek = 0
        let totalCountCurrentWeek = 0
        store.state.map.records.forEach(function(record) {
          let date_record = new Date(record.timestamp_upload)
          // previous week
          if(date_current_m1w < date_record && date_record < date_current) {
            totalCountLastWeek += record.front_count + record.back_count
            recordsKeptLastWeek[record.location_code] = record.front_count + record.back_count
          }

          // current week
          if(date_current < date_record && date_record < date_current_p1w) {
            numberOfOvitraps += 1
            totalCountCurrentWeek += record.front_count + record.back_count
            if(record.front_count + record.back_count > 0) numberOfPositiveOvitraps += 1
            recordsKeptCurrentWeek[record.location_code] = record.front_count + record.back_count
          }
        })


        let avg = 0
        let std = 0

        let recordsWS = []
        Object.keys(recordsKeptCurrentWeek).forEach(function(loc) {
          recordsWS.push(recordsKeptCurrentWeek[loc])
        })
        if(recordsWS.length > 0) {
          avg = recordsWS.reduce((a,b) => a + b) / recordsWS.length 
          std = Math.sqrt(
            recordsWS.map(x => Math.pow(x - avg, 2)).reduce((a,b) => a + b) / recordsWS.length 
          )
        }

        return {
          'ratio': this.r100(numberOfPositiveOvitraps / numberOfOvitraps),
          'avg': [this.r100(avg), this.r100(std)],
          'difference': this.r100((totalCountCurrentWeek - totalCountLastWeek) / totalCountLastWeek * 100),
        }

      }
      else {
        return null
      }
    }
  },
  methods: {
    changeWeek: function(delta) {
      this.dateReport = new Date(this.dateReport)
      this.dateReport.setDate(this.dateReport.getDate() + delta * 7)  // add +/- 7 days
      this.displayDate(this.dateReport)
    },
    displayDate: function(date) {
      this.dateDisplay = "Week " + date.getFullYear() + "-" + getWeekNumber(date)
      +  " (" + getMonthInLetters(date.getMonth()) + " " + date.getDate() + ")"
      this.dateDisplayShort = getWeekNumber(date) 
    },
    r100: function(n) {
      return Math.round(n * 100) / 100
    }
  }
});
</script>
