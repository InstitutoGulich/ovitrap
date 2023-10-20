<template>
    <NavigationDrawer />
    <h1 class="mb-5">{{ $t('database') }}</h1>
    <v-form>
        <!-- header -->
        <v-row>
          <v-col cols="12" sm="3" md="3">
          {{ $t('date-from') }}
          </v-col>
          <v-col cols="12" sm="3" md="3">
          {{ $t('date-to') }}
          </v-col>
          <v-col cols="12" sm="3" md="3">
          {{ $t('location') }}
          </v-col>
          <v-col cols="12" sm="3" md="3">
          {{ $t('processed') }}
          </v-col>
        </v-row>

        <!-- user input -->
        <v-row>
          <v-col
            cols="12"
            sm="3"
          >
            <v-text-field
              label="YYYY-MM-DD"
              v-model="filterDateFrom"
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            sm="3"
          >
            <v-text-field
              label="YYYY-MM-DD"
              v-model="filterDateTo"
            ></v-text-field>

          </v-col>
          <v-col
            cols="12"
            sm="3"
          >
            <v-text-field
              label="AA-00"
              placeholder="Placeholder"
              v-model="filterLocation"
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            sm="3"
          >
            <v-layout row justify-space-between>
          <v-checkbox
                v-model="filterProcessedYes"
                :label="$t('yes')"
              ></v-checkbox> &nbsp;
          <v-checkbox
                v-model="filterProcessedNo"
                :label="$t('no')"
              ></v-checkbox>
            </v-layout>
          </v-col>
         
     
        </v-row>
    </v-form>

    
    <DatabaseMain 
    :filterDateFrom="filterDateFrom" 
    :filterDateTo="filterDateTo" 
    :filterLocation="filterLocation"
    :filterProcessed="filterProcessed" />
</template>

<script>
import { defineComponent } from 'vue';

import NavigationDrawer from '../components/NavigationDrawer.vue';

import DatabaseMain from '../components/DatabaseMain.vue';

export default defineComponent({
  name: 'DatabaseView',

  components: {
    NavigationDrawer,
    DatabaseMain
  },

  data: function() {
    return {
      filterDateFrom: "2022-01-01",
      filterDateTo: "2022-01-07",
      filterLocation: "*",
      filterProcessedYes: true,
      filterProcessedNo: true,
    }
  },
  computed: {
    filterProcessed: function() {
      if(this.filterProcessedYes && this.filterProcessedNo)
        return null 
      if(this.filterProcessedYes)
        return 1
      if(this.filterProcessedNo)
        return 0
      return null
    }
  },
  mounted: function() {
    // get date of last Monday
    let dateTo = new Date()
    dateTo.setDate(dateTo.getDate() - dateTo.getDay() + 8) 
    dateTo.setHours(0) 
    this.filterDateTo = dateTo.getFullYear() + "-" + ("0" + (dateTo.getMonth() + 1)).slice(-2) + "-" + ("0" + dateTo.getDate()).slice(-2)
  

    let dateFrom = new Date()
    dateFrom.setDate(dateTo.getDate() - 8) 
    this.filterDateFrom = dateFrom.getFullYear() + "-" + ("0" + (dateFrom.getMonth() + 1)).slice(-2) + "-" + ("0" + dateFrom.getDate()).slice(-2)
  

  },
  methods: {
    filter: function() {

    },
  }
});
</script>
