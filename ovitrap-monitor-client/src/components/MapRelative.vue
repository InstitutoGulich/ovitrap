

<template>
  <l-map style="height:50vh" 
      v-model="zoom"
      v-model:zoom="zoom"
      :center="userGpsCoords"> 
       <l-tile-layer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      layer-type="base"
      name="OpenStreetMap"
      :options="options"
    ></l-tile-layer>



    <l-circle-marker 
      v-for="(eggMarker, index) in this.mapEggMarkers"
      :key="index"
      :lat-lng="eggMarker.location" 
      :radius="eggMarker.radius" 
      :color="eggMarker.color"
      :opacity="0.1"
      :fill="true" 
      :fillColor="eggMarker.color"
      :fillOpacity="0.3" />
  </l-map>
  <v-container>
    <v-row dense>
      <v-col class="d-flex justify-space-around  mb-2">
    <p class="font-weight-light">
      {{ this.mapStatus }}
    </p>
      </v-col>
    </v-row>
  </v-container>
</template>

  
<script>
// DON'T load Leaflet components here!
// Its CSS is needed though, if not imported elsewhere in your application.
import "leaflet/dist/leaflet.css"
import { LMap, LTileLayer, LCircleMarker } from "@vue-leaflet/vue-leaflet";

import store from '../store'
import { getWeekNumber, getDateByWeek } from '../plugins/utils'

export default {
  components: {
    LMap,
    LTileLayer,
    LCircleMarker
  },
  props: {
    dateMap: Date
  },
  data() {
    return {
      userGpsCoords: [-31.4135, -64.1810],
      zoom: 11,
      geojsonOptions: {},
      options: {
        zoomControl: false
      },
      circleMarkerOptions: {
      },
      mapEggMarkers: [],
      mapStatus: "",
      eggCounts: store.state.map.eggCounts,
      ovisLocations: store.state.map.ovisLocations,
    };
  },
  mounted: function() {
    // load stations 
    store.commit('getStations', { 
      username: store.state.user.username,
    })
    // load eggs 
    store.commit('getSticksByUser', { 
      username: store.state.user.username,
      processed: 1
    })
    this.plotEggs()
  },
  watch: {
    dateMap: function() {
      this.plotEggs()
    }
  },
  methods: {
    filterCounts: function() {
      let recordsKeptCurrentWeek = {}
      let recordsKeptLastWeek = {}
      let recordsKept = {}
      let dateYear = this.dateMap.getFullYear()
      let dateWeek = getWeekNumber(this.dateMap)
      let date_current = getDateByWeek(dateYear, dateWeek) 
      let date_current_m1w = getDateByWeek(dateYear, dateWeek - 1) 
      let date_current_p1w = getDateByWeek(dateYear, dateWeek + 1) // plus one week

      // here we take the count of the current week - the count of previous week
      if(store.state.map.records) {
        store.state.map.records.forEach(function(record) {
          let date_record = new Date(record.timestamp_upload)
          // previous week
          if(date_current_m1w < date_record && date_record < date_current) {
            recordsKeptLastWeek[record.location_code] = record.front_count + record.back_count
          }

          // current week
          if(date_current < date_record && date_record < date_current_p1w) {
            recordsKeptCurrentWeek[record.location_code] = record.front_count + record.back_count
          }
        })

        // substraction
        Object.keys(recordsKeptCurrentWeek).forEach(function(key) {
          if(Object.keys(recordsKeptCurrentWeek).indexOf(key) > -1 && Object.keys(recordsKeptLastWeek).indexOf(key) > -1)
            recordsKept[key] = recordsKeptCurrentWeek[key] - recordsKeptLastWeek[key]
        })
        return recordsKept
      }
      else return []
    },
    plotEggs: function() {
      // console.log("will plot eggs for", this.dateMap)
      let counts = this.filterCounts()
      this.mapEggMarkers = []
      let _this = this
      if(counts == undefined) {
        this.mapStatus = this.$t('database-no-data')
        return 
      }
      Object.keys(counts).forEach(function(locationCode) {
        let radius = 10 // counts[locationCode] / 10
        let color = "#ff0000"
        if(counts[locationCode] < 0) {
          color = "#0000ff"
        }
        let location = store.state.database.stations[locationCode.replace('-', '')]
        location = [location[1], location[0]]
        _this.mapEggMarkers.push({
          location,
          radius,
          color
        })
        _this.mapStatus = ""
      })
    }
  },
  async beforeMount() {
    const { circleMarker } = await import("leaflet/dist/leaflet-src.esm");

    this.geojsonOptions.pointToLayer = (feature, latLng) =>
      circleMarker(latLng, { radius: 8 });
    this.mapIsReady = true;
  },
};
</script>