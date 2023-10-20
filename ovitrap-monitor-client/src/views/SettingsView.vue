<template>
  <NavigationDrawer />
  <h1 class="mb-5">{{ $t('settings') }}</h1>
   <!--Posted: {{ numberPosted }}
    <v-btn variant="contained-text" class="mt-5" block @click="load">Load previous data</v-btn> -->
  <SettingsAccount />
  <SettingsOvitrapStations />
</template>

<script>
import { defineComponent } from "vue";
import axios from "axios";

import store from "../store";

import NavigationDrawer from "../components/NavigationDrawer.vue";
import SettingsAccount from "../components/SettingsAccount.vue";
import SettingsOvitrapStations from "../components/SettingsOvitrapStations.vue";

export default defineComponent({
  name: "SettingsView",

  components: {
    NavigationDrawer,
    SettingsAccount,
    SettingsOvitrapStations
  },

  data: function () {
    return {
      numberPosted: 0,
    };
  },

  mounted: function() {
  },
  methods: {
    load: async function() {
      // load counts
      let eggCountsPerWeek = store.state.map.eggCounts;
      console.log(eggCountsPerWeek);
      let records = [];
      // for each week
      Object.keys(eggCountsPerWeek).forEach(function (week) {
        // for each location
        Object.keys(eggCountsPerWeek[week]).forEach(function (locationCode) {
          // for each record, prepare object
          console.log(week, locationCode);

          // year
          let year = 2021;
          if (week < 10) {
            year = 2022;
          }

          // compute date of monday of week with correct number
          var simple = new Date(year, 0, 1 + (week - 1) * 7, 12);
          var dow = simple.getDay();
          var date = simple;
          if (dow <= 4) date.setDate(simple.getDate() - simple.getDay() + 1);
          else date.setDate(simple.getDate() + 8 - simple.getDay());

          const newStickObject = {
            uuid: null,
            author: store.state.user.username,
            processed: true,
            location_code: locationCode,
            location_gps_lat: null,
            location_gps_lon: null,
            front_pic_url: "NA",
            front_count: eggCountsPerWeek[week][locationCode],
            back_pic_url: "NA",
            back_count: 0,
            loc_pic_url: "NA",
            happy: true,
            timestamp_upload: date,
            timestamp_process: date,
          };
          records.push(newStickObject);
        });
      });
      records = records.splice(0, 261)
      this.post(records);
    },
    post: async function(records) {
      for(let i = 0; i < records.length; i++) {
        console.log(i, '/', records.length)
        // post
        const res = await axios.get(
          store.state.settings.backend_url + "/get_csrf_token",
          {
            withCredentials: true,
          }
        );
        try {
          let CSRFToken = res.headers["x-csrftoken"];
          store.commit("setUserCSRFToken", CSRFToken);
        } catch (err) {
          console.log("error", err);
        }
        console.log('csrf ok')

        let recordPost = await axios.post(
          store.state.settings.backend_url + "/records/",
          records[i],
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": store.state.user.csrf_token,
            },
          }
        );
        console.log('post ok')
        this.numberPosted += 1;
        if (parseInt(recordPost.status / 100) != 2) console.log(recordPost)
      }
    },
  },
});
</script>
