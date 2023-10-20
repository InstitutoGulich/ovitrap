<template>
    <h3>{{ $t('ovitrap-stations') }}</h3>

        <!-- upload form -->
        <p>{{ $t('settings-upload-stations') }}</p>
    
         <v-file-input
          show-size
          counter
          :label="$t('file-input')"
          v-model="fileGeoJSON"
          @change="doCheck"
        ></v-file-input>

        <!-- map -->
        <l-map style="height:40vh;" v-if="this.showMap">
            <l-tile-layer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            layer-type="base"
            name="OpenStreetMap"
            ></l-tile-layer>
            <l-circle-marker 
                v-for="(station, index) in this.stations"
                :key="index"
                :lat-lng="station.location" 
                :radius="10" 
                color="#ff0000"
                :opacity="0.1"
                :fill="true" 
                fillColor="#ff0000"
                :fillOpacity="0.3">

                    <l-tooltip :content="station.code"/>
            </l-circle-marker>
        </l-map>
        <!-- submit -->
        <div v-if="this.showMap">
      <v-btn color="primary" class="my-5" block variant="outlined" @click="doUpload">{{ $t('upload') }}</v-btn>
        <p>{{ $t('settings-upload-stations-warning') }}.</p>
        </div>
</template>

<script>
import store from "../store";

import "leaflet/dist/leaflet.css"
import { LMap, LTileLayer, LCircleMarker, LTooltip } from "@vue-leaflet/vue-leaflet";
export default {
  name: "SettingsOvitrapStations",
  props: {
  },
  computed: {
  },
  components: {
    LMap,
    LTileLayer,
    LCircleMarker,LTooltip
  },
  data: function () {
    return {
        fileGeoJSON: [],
        content: {},
        stations: [],
        showMap: false
    };
  },
  watch: {
  },
  methods: {
    doCheck: function() {

        // read file 
        var files = this.fileGeoJSON
        let _this = this
        if(this.fileGeoJSON != null) {
            var file = files[0];           
            var reader = new FileReader();
            reader.onload = function(event) {
                console.log(event.target.result);
                _this.content = JSON.parse(event.target.result)   
                _this.showMap = true
                _this.content["features"].forEach(function(feature) {
                    let code = feature.properties.id
                    if(code === undefined) {
                        code = feature.properties.Name
                    }
                    code = String(code)
                    _this.stations.push({
                        code: code,
                        location: [feature.geometry.coordinates[1], feature.geometry.coordinates[0]],
                    }) 
                })
            }
            reader.readAsText(file)
        }

    },
    doUpload: function() {

        // get all previous stations 
        store.commit('getStations', { author: store.state.user.username})

        // upload all new stations
        let stationIndex = 0
        let stations = []
        while(stationIndex < this.stations.length) {
            const stationObject = {
                code: this.stations[stationIndex].code,
                author: store.state.user.username,
                location_gps_lat: this.stations[stationIndex].location[0],
                location_gps_lon: this.stations[stationIndex].location[1]
            }
            stations.push(stationObject)
            stationIndex += 1
        }
        store.commit('uploadStations', stations)
        this.$root.snackbarDefault.show({message: 'Stations uploaded'})
    }
  },
};
</script>

<style>

</style>
