<template>
  <v-card class="oeg-record-editor"> <!--
    <v-card-title>
            <v-spacer></v-spacer>
            <v-icon @click="close" class="close-btn">mdi-close</v-icon>
          </v-card-title> -->
    <v-card-text>
      <v-row>
        <!-- front -->
        <v-col md="4">
          <h2 class="my-4">{{ $t('editor-front-picture') }}</h2>
          <EggCounter
            v-model:imgUrl="frontPicUrl"
            v-model:eggCount="frontCount"
          />
        </v-col>

        <!-- back -->
        <v-col md="4" 
          v-if="!backPicUrl.endsWith('N/A')">
          <h2 class="my-4">{{ $t('editor-front-picture') }}</h2>
          <EggCounter
            v-model:imgUrl="backPicUrl"
            v-model:eggCount="backCount"
          />
        </v-col>

        <!-- meta -->
        <v-col md="4">
          <h2 class="my-4">{{ $t('metadata') }}</h2>

          
          <h3 class="my-4">{{ $t('date') }}</h3>
          {{ uDisplayDate(timestamp_upload) }}
          <br />
          <br />


          <h3 class="my-4">{{ $t('location-code') }}</h3>
          <v-text-field
            :label="$t('location-code')"
            placeholder="XX-XX-X"
            variant="filled"
            hide-details=""
            v-model="locationCode"
          ></v-text-field>
          <br />
          <br />

          <h3 class="my-4">{{ $t('save') }}</h3>
          <v-checkbox
            v-model="happy"
            :label="$t('editor-happy')"
            hide-details=""
          ></v-checkbox>

          <v-btn color="success" block variant="outlined" @click="save" class="mb-3">{{ $t('save') }}</v-btn>
          <v-btn color="error" block variant="outlined" @click="close">{{ $t('close') }}</v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from "axios";
import store from "../store";
import { displayDate } from '../plugins/utils'
import EggCounter from "./EggCounter.vue";

export default {
  name: "RecordEditor",
  props: {
    stick: {},
    dialog: Boolean
  },
  computed: {
    frontPicUrl: function () {
      if (this.stick) return this.stick.front_pic_url;
      else return "";
    },
    backPicUrl: function () {
      if (this.stick) return this.stick.back_pic_url;
      else return "";
    },
    locPicUrl: function () {
      if (this.stick) return this.stick.loc_pic_url;
      else return "";
    },
  },
  components: {
    EggCounter,
  },
  data: function () {
    return {
      frontCount: 0,
      backCount: 0,
      timestamp_upload: this.stick.timestamp_upload,
      locationCode: this.stick.location_code,
      happy: this.stick.happy,
      errorsInStick: false,
      errorsInStickMessage: "",
      s3_url: store.state.settings.s3_url 
    };
  },
  watch: {
  },
  methods: {
    uDisplayDate: function(d) { return displayDate(d) },
    save: async function () {
      // unload pics from back-end workspace
      const res_proc_unload_1 = await axios.get(
        store.state.settings.backend_url +
          "/unload_pic?pic_url=" +
          this.stick.front_pic_url
      );
      if (res_proc_unload_1.status != 200) return false;
      const res_proc_unload_2 = await axios.get(
        store.state.settings.backend_url +
          "/unload_pic?pic_url=" +
          this.stick.back_pic_url
      );
      if (res_proc_unload_2.status != 200) return false;

      // save to database
      const newStickObject = {
        id: this.stick.id,
        uuid: null,
        author: store.state.user.username,
        processed: true,
        location_code: this.locationCode,
        location_gps_lat: null,
        location_gps_lon: null,
        front_pic_url: this.frontPicUrl,
        front_count: this.frontCount,
        back_pic_url: this.backPicUrl,
        back_count: this.backCount,
        loc_pic_url: this.locPicUrl,
        happy: this.happy,
        timestamp_upload: this.stick.timestamp_upload,
        timestamp_process: new Date().toISOString(),
      };
      if(this.validateStick(newStickObject)) {
        await store.commit("editStick", newStickObject)
        this.$emit("update:dialog", false);
        this.$root.snackbarDefault.show({message: this.$t('editor-record-saved')})
      }
      else {
        console.log("validation nok")
        this.$root.snackbarDefault.show({
          message: 'Error',
          color: 'error'
        })
      }
    },
    validateStick: function(stickObject) {
      if(stickObject.location_code == "") {
        this.errorsInStickMessage = this.$t('editor-location-code-required')
        this.errorsInStick = true
        return false
      }
      return true
    },
    close: function() {
      this.$emit("update:dialog", false);
    }
  },
};
</script>

<style>
.close-btn {
  cursor: pointer;
}
.oeg-record-editor {
  width: 90vw;
  max-height: 80vh;
}
.oeg-record-editor-img-location {
  height: 30vh;
}
.oeg-record-editor-img-stick {
  max-height: 56vh;
}
</style>
