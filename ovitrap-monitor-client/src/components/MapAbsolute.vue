

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
      color="#ff0000"
      :opacity="0.1"
      :fill="true" 
      fillColor="#ff0000"
      :fillOpacity="0.3">

            <l-tooltip :content="eggMarker.text"/>
    </l-circle-marker>
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
import { LMap, LTileLayer, LCircleMarker, LTooltip } from "@vue-leaflet/vue-leaflet";

import store from '../store'
import { getWeekNumber, getDateByWeek } from '../plugins/utils'

export default {
  components: {
    LMap,
    LTileLayer,
    LCircleMarker,
    LTooltip
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
      stations: store.state.database.stations,
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
    },
  },
  methods: {
    filterCounts: function() {
      let recordsKept = {}
      let dateYear = this.dateMap.getFullYear()
      let dateWeek = getWeekNumber(this.dateMap)
      let date_current = getDateByWeek(dateYear, dateWeek) 
      let date_current_p1w = getDateByWeek(dateYear, dateWeek + 1) // plus one week
      if(store.state.map.records) {
        store.state.map.records.forEach(function(record) {
          let date_record = new Date(record.timestamp_upload)
          if(date_current < date_record && date_record < date_current_p1w) {
            // date_record_between = true
            recordsKept[record.location_code] = record.front_count + record.back_count
          }
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
      let totalEggs = 0
      Object.keys(counts).forEach(function(locationCode) {
        let radius = counts[locationCode] / 10
        let location = store.state.database.stations[locationCode.replace('-', '')]
        let text = locationCode + ": " + counts[locationCode]
        if(location != undefined) {
          location = [location[1], location[0]]
          _this.mapEggMarkers.push({
            location,
            radius,
            text
          })
          totalEggs += counts[locationCode]
        }
      })
      _this.mapStatus = this.$t('database-total-count') + ": " + totalEggs
    }
  },
  async beforeMount() {
    // HERE is where to load Leaflet components!
    const { circleMarker } = await import("leaflet/dist/leaflet-src.esm");

    // And now the Leaflet circleMarker function can be used by the options:
    this.geojsonOptions.pointToLayer = (feature, latLng) =>
      circleMarker(latLng, { radius: 8 });
    this.mapIsReady = true;
  },
};
</script>