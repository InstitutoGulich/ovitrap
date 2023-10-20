<template>
    <NavigationDrawer />

      <v-row dense>
        <v-col class="d-flex justify-space-between">
          <h1 class="mb-5">Evaluation</h1>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>
          <h2 class="mb-5">Upload all records</h2>
          <!-- <v-btn variant="contained-text" class="mt-5" block @click="upload">Upload</v-btn> -->
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>
          <h2 class="mb-5">Evaluation metrics</h2>
          <!-- <v-btn variant="contained-text" class="mt-5" block @click="upload">Upload</v-btn> -->
          Found {{ eval.numberOfMatchedRecords }} matches with dataset. 
          <p>
            <strong>Average absolute error:</strong><br />
            {{ eval.avg_abs_error }}
          </p>
          <p>
            <strong>Average relative error for positive records:</strong><br />
            {{ eval.avg_rel_error_nonzero }}
          </p>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>
          <h2 class="mb-5">Download</h2>
          <p>
             <v-btn variant="contained-text" class="mt-5" block @click="download">Download</v-btn>
          </p>
        </v-col>
      </v-row>

      

      <div v-for="(record, index) in records" v-bind:key="index">
        {{ record.front_pic_url }}
        <v-img :src="s3_url + record.front_pic_url" width="40" />
      </div>







</template>

<script>
import { defineComponent } from 'vue';

import store from '../store'
import dataset from '../store/egg_counts_dense_frente.json'
import { getDateByWeek, displayDate} from '../plugins/utils'

import NavigationDrawer from '../components/NavigationDrawer.vue';

export default defineComponent({
  name: 'EvalView',
  data: function() {
    return {
      records: [],
      s3_url: store.state.settings.s3_url,
      eval: {
        numberOfMatchedRecords: 0,
        counts_gt: [],
        counts_est: [],
        avg_abs_error: 0,
        avg_rel_error_nonzero: 0,
        csvContent: ""
      },      
    }
  },
  components: {
    NavigationDrawer,
  },
  mounted: function() {
    // load eggs 
    store.commit('getSticksByUser', { 
      username: store.state.user.username,
      processed: 1
    })
    // prep download
    let rows = []
    let _this = this

    this.eval.csvContent = "data:text/csv;charset=utf-8,";
    let row = ["id", "date", "location", "count (gt)", "count (est)"]
    rows.push(row)

    // eval
    if(store.state.map.records.length > 0) {
      console.log(store.state.map.records)
      let i = 0 
      while(i < store.state.map.records.length) {
        let record = store.state.map.records[i]
        console.log(record.front_pic_url) // example: eval/RGB_3/3-NE-8.JPEG
        let week = record.front_pic_url.split('/')[1].split('_')[1]
        let locationCode = record.front_pic_url.split('/')[2].split('.')[0].split('-')
        locationCode = locationCode[1] + '-' + locationCode[2]

        let match = (week in dataset) && (locationCode in dataset[week])
        if(match) {
          this.eval.numberOfMatchedRecords += 1
          this.eval.counts_gt.push(dataset[week][locationCode])
          this.eval.counts_est.push(record.front_count)

          // add to csv content
          let row = [i, displayDate(record.timestamp_upload), record.location_code, dataset[week][locationCode], record.front_count + record.back_count]
          rows.push(row)
        }
        i += 1
      }


    rows.forEach(function(rowArray) {
      let row = rowArray.join(",");
      _this.eval.csvContent += row + "\r\n";
    });
    console.log(this.eval.csvContent)

    /*

      // plot prep 
      let avg_abs_error_per_n_eggs = []
      i = 0 
      while(i < 500) {
        avg_abs_error_per_n_eggs.push([])
        i += 1
      }


      // eval
      i = 0 
      while(i < this.eval.counts_gt.length) {
        this.eval.avg_abs_error += Math.abs(this.eval.counts_est[i] - this.eval.counts_gt[i])
        if(this.eval.counts_gt[i] > 0) {
          this.eval.avg_rel_error_nonzero += Math.abs(this.eval.counts_est[i] - this.eval.counts_gt[i]) / this.eval.counts_gt[i]
        }

        // plot 
        avg_abs_error_per_n_eggs[this.eval.counts_gt[i]].push(Math.abs(this.eval.counts_est[i] - this.eval.counts_gt[i]))

        
        i += 1
      }
      this.eval.avg_abs_error /= this.eval.counts_gt.length
      this.eval.avg_rel_error_nonzero /= this.eval.counts_gt.length


      // plot postp 
      console.log("here")
      console.log(avg_abs_error_per_n_eggs)
      i = 0 
      let j = 0
      while(i < 500) {
        if(avg_abs_error_per_n_eggs[i].length > 0) {
          let avg = 0
          j = 0 
          while(j < avg_abs_error_per_n_eggs[i].length) { 
            avg += avg_abs_error_per_n_eggs[i][j]
            j +=1 
          }
          avg /= avg_abs_error_per_n_eggs[i].length
          avg_abs_error_per_n_eggs[i] = avg
        }
        else {
          avg_abs_error_per_n_eggs[i] = -1
        }
        i += 1
      }
    */
    }
  },
  computed: {
  },
  methods: {
    download: function() {
      console.log(this.eval.csvContent)
      var encodedUri = encodeURI(this.eval.csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      console.log(encodedUri)
      link.setAttribute("download", "ovitrap-eval.csv");
      document.body.appendChild(link); 
      link.click(); 
    },
    upload: function()  {
      let _this = this
      let recordsIndex = 0
      Object.keys(dataset).forEach(function(week) {
        Object.keys(dataset[week]).forEach(function(station) {
          console.log(week, station, dataset[week][station])
           // year
          let year = 2021;
          if (week < 10) year = 2022;

          let weekFile = week
          if (weekFile == 1) weekFile = 53

          // object
          const record = {
            author: store.state.user.username,
            processed: false,
            front_pic_url: "eval/RGB_" + week + "/" + weekFile + "-" + station + ".JPEG",
            back_pic_url: "N/A",
            loc_pic_url: "N/A",
            location_code: station,
            timestamp_upload:  new Date(getDateByWeek(year, week)).toISOString(),
          }
          
          _this.records.push(record)   
          recordsIndex += 1       
        })
      })
      console.log(_this.records)
      console.log("number of records:", _this.records.length, recordsIndex)

      // commit mutation to add to database
      // store.commit('uploadRecords', this.records)
    },
    r100: function(n) {
      return Math.round(n * 100) / 100
    }
  }
});
</script>
