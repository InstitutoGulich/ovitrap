<template> 

  <v-table>
    <thead>
      <tr>
        <th class="text-left">
          #
        </th>
        <th class="text-left" @click="sort('timestamp_upload')">
           {{ $t('date') }}
        </th>
        <th class="text-left" @click="sort('location_code')">
           {{ $t('location') }}
        </th>
        <th class="text-left" @click="sort('count')">
           {{ $t('database-total-count') }}
        </th>
        <th class="text-left">
           {{ $t('processed') }}
        </th>
        <th class="text-left">
           {{ $t('actions') }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(record, index) in sortedRecords" :key="index">
      <td>{{ index+1 }}</td>
      <td>{{ uDisplayDate(record.timestamp_upload) }} </td>
      <td>{{ record.location_code }} <v-btn size="x-small" flat icon="mdi-pencil" @click="changeLocation(record)"></v-btn> </td>
      <td>{{ record.front_count + record.back_count }}</td>
      <td>{{ boolToYesNo(record.processed) }}</td>
      <td>
        <v-layout row justify-space-between>
          <v-btn @click="process(record)" variant="outlined" color="success">{{ $t('process') }}</v-btn> &nbsp;
          <v-btn @click="doDelete(record)" variant="outlined" color="error">{{ $t('delete') }}</v-btn>
        </v-layout>
      </td>
    </tr>
    </tbody>
  </v-table>
  <p class="text-center mt-3" v-if="records.length == 0"> {{ $t('database-no-data') }}</p>

  <!-- change location -->
  <v-dialog
    v-model="dialogLocation"
    class="oeg-record-location-editor">
    <RecordLocationEditor v-model:record="stickBeingLocationChanged" v-model:dialog="dialogLocation" />
  </v-dialog>

  <!-- process  -->
  <v-dialog
    v-model="dialog"
    class="oeg-record-editor">
    <RecordEditor v-model:stick="stickBeingProcessed" v-model:dialog="dialog" />
  </v-dialog>

  <!-- delete -->
  <v-dialog
    v-model="dialogDelete"
    class="oeg-record-deleter">
    <RecordDeleter v-model:record="stickBeingDeleted" v-model:dialog="dialogDelete" />
  </v-dialog>

          <v-btn @click="download()" variant="outlined" color="primary">{{ $t('download') }}</v-btn>
</template>

<script>
import store from '../store'
import { displayDate } from '../plugins/utils'
import RecordEditor from '../components/RecordEditor.vue'
import RecordDeleter from '../components/RecordDeleter.vue'
import RecordLocationEditor from '../components/RecordLocationEditor.vue'

export default {
  name: 'DatabaseMain',
  props: {
    filterDateFrom: String,
    filterDateTo: String,
    filterLocation: String,
    filterProcessed: Number,
  },
  components: {
    RecordEditor,
    RecordDeleter,
    RecordLocationEditor
  },
  data: function() {
    return { 
      currentSort: 'timestamp_upload',
      currentSortDir: 'desc',
      dialog: false,
      stickBeingProcessed: null,
      dialogDelete: false,
      stickBeingDeleted: null,
      dialogLocation: false,
      stickBeingLocationChanged: null 
    }
  },
  mounted: function() {
  },
  watch: {
    filterDateFrom: function() {
      console.log(this.filterDateFrom.split("-").length == 3, this.filterDateFrom.length == 10)
      if(this.filterDateFrom.split("-").length == 3 && this.filterDateFrom.length == 10) {
        this.getRecords()
      }
    },
    filterDateTo: function() {
      if(this.filterDateTo.split("-").length == 3 && this.filterDateTo.length == 10) {
        this.getRecords()
      }
    },
    filterLocation: function() {
      // removed check for other cities if(this.filterLocation.split("-").length == 2 && this.filterLocation.length >= 4) {
      this.getRecords()
      // }
    },
    filterProcessed: function() {
      this.getRecords()
    },
    dialog: function(newValue) {
      if(!newValue) {
        console.log("re-load")
        this.getRecords()
      }
    },
    dialogDelete: function(newValue) {
      if(!newValue) {
        this.getRecords()
      }
    },
    needsUpdate: function(newValue) {
      if(newValue) {
        this.getRecords()
        store.state.database.needsUpdate = false
      }
    }
  },
  computed: {
    records: function() {
      return store.state.database.records
    },
    needsUpdate: function() {
      return store.state.database.needsUpdate
    },
    sortedRecords: function() {
      return [...this.records].sort((a,b) => {
        let modifier = 1;
        if(this.currentSortDir === 'desc') modifier = -1;
        if(this.currentSort == "count") {
          // specific case: if it's count, add both sides
          let a_count = a["front_count"] + a["back_count"]
          let b_count = b["front_count"] + b["back_count"]
          if(a_count < b_count) return -1 * modifier;
          if(a_count > b_count) return 1 * modifier;
        }
        else {
          // general case
          if(a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
          if(a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
        }
        return 0;
      })
    }
  },
  methods: {
    getRecords: function() {
      store.commit('getDatabaseRecords', { 
        username: store.state.user.username,
        date_from: this.filterDateFrom,
        date_until: this.filterDateTo,
        location_code: this.filterLocation,
        processed: this.filterProcessed,
      })
    },
    uDisplayDate: function(e) {
      return displayDate(e)
    },
    process(stick) {
      this.stickBeingProcessed = stick
      this.dialog = true
    },
    doDelete(stick) {
      this.stickBeingDeleted = stick
      this.dialogDelete = true
    },
    changeLocation(stick) {
      this.stickBeingLocationChanged = stick
      this.dialogLocation = true
    },
    boolToYesNo(bool) {
      if(bool) return "Yes"
      else return "No"
    },
    download() {
      let rows = []
      let _this = this
      this.records.forEach(function(record, index) {
        let row = [index, _this.uDisplayDate(record.timestamp_upload), record.location_code, record.front_count + record.back_count, record.processed]
        rows.push(row)
      })

      let csvContent = "data:text/csv;charset=utf-8,";

      rows.forEach(function(rowArray) {
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
      });

      var encodedUri = encodeURI(csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "ovitrap-monitor-export.csv");
      document.body.appendChild(link); 
      link.click(); 
    },
    sort: function(s) {
      if(s === this.currentSort) {
        // reverse 
        this.currentSortDir = this.currentSortDir==='asc'?'desc':'asc';
      }
      this.currentSort = s;
    }
  }
}
</script>
