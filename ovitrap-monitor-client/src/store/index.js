import { createStore } from 'vuex'
import axios from 'axios';

import eggCountsFromFile from './egg_counts.json'
import ovisLocationsFromFile from './ovis_locations.json'

export default createStore({
  state: {
    user: {
      username: null,
      csrf_token: null,
      error: null,
    },
    gui: {
      navigation_drawer: true,
      loading: false,
    },
    workspace:  {
      sticksUnprocessed: []
    },
    map: {
      eggCounts: eggCountsFromFile,
      ovisLocations: ovisLocationsFromFile,
      records: []
    },
    database: {
      records: [],
      needsUpdate: false,
      stations: [],
      stationsLoading: true,
    },
    settings: {
      backend_url: process.env.VUE_APP_BACKEND_URL,
      s3_url: process.env.VUE_APP_S3_URL, 
    }
  },
  getters: {
  },
  mutations: {
    toggleNavigationDrawer(state) {
      state.gui.navigation_drawer = !state.gui.navigation_drawer
    },
    closeNavigationDrawer(state) {
      state.gui.navigation_drawer = false
    },
    setUserCSRFToken(state, payload) {
      state.user.csrf_token = payload
    },
    setUsername(state, payload) {
      state.user.username = payload
    },
    async getSticksByUser(state, payload) {
      // returns sticks by user, processed or not
      const res = await axios.get(this.state.settings.backend_url  + "/get_csrf_token", {
        withCredentials: true,
      })
      try {
          let CSRFToken = res.headers["x-csrftoken"]
          this.commit('setUserCSRFToken', CSRFToken)
      }
      catch(err) {
          console.log('error', err);
          return 
      }

      const recordGet = await axios.get(state.settings.backend_url + "/records/?author=" + payload.username + "&processed=" + payload.processed, {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': state.user.csrf_token,
        }})
      if(parseInt(recordGet.status / 100) != 2) return false

      if(payload.processed == 0) {
        state.workspace.sticksUnprocessed = recordGet.data
      }
      else {
        // TODO refactor to get only relevant data
        state.map.records = recordGet.data
      }
    },
    async uploadStick(state, payload) {

      const res = await axios.get(this.state.settings.backend_url  + "/get_csrf_token", {
        withCredentials: true,
      })
      try {
          let CSRFToken = res.headers["x-csrftoken"]
          this.commit('setUserCSRFToken', CSRFToken)
      }
      catch(err) {
          console.log('error', err);
      }
      

      // add file names depending on number of uploads
      let fileNameFront = "N/A"
      let fileNameBack = "N/A"
      if(payload.fileNames.length == 1) {
        fileNameFront = payload.fileNames[0]
      }
      if(payload.fileNames.length == 2) {
        fileNameFront = payload.fileNames[0]
        fileNameBack = payload.fileNames[1]
      }
      let processed = false 
      let front_count = null
      if(payload.numberOfEggs != null) {
        processed = true
        front_count = payload.numberOfEggs
      }

      const record = {
        author: state.user.username,
        processed,
        front_pic_url: fileNameFront,
        front_count,
        back_pic_url: fileNameBack,
        loc_pic_url: "N/A",
        location_code: payload.locationCode,
        timestamp_upload:  payload.date.toISOString(),
      }
      const recordPost = await axios.post(state.settings.backend_url + "/records/", record, {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': state.user.csrf_token,
        }})
      if(parseInt(recordPost.status / 100) != 2) return false
      else return true

    },
    async editStick(state, payload) {
      // get csrf
      const res = await axios.get(this.state.settings.backend_url  + "/get_csrf_token", {
        withCredentials: true,
      })
      try {
          let CSRFToken = res.headers["x-csrftoken"]
          this.commit('setUserCSRFToken', CSRFToken)
      }
      catch(err) {
        console.log('error', err);
      }

      // put record
      const recordPut = await axios.put(
        state.settings.backend_url + "/records/" + payload.id + "/", 
        payload, 
        {
          withCredentials: true,
          headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': state.user.csrf_token,
          }
        })
      console.log(recordPut)
      if(parseInt(recordPut.status / 100) != 2) return false
      else {
        state.database.needsUpdate = true
        return true
      }
    },
    async getDatabaseRecords(state, payload) {
      state.gui.loading = true
      console.log("store:getDatabaseRecords")
      // returns sticks by user, processed or not
      const res = await axios.get(this.state.settings.backend_url  + "/get_csrf_token", {
        withCredentials: true,
      })
      try {
          let CSRFToken = res.headers["x-csrftoken"]
          this.commit('setUserCSRFToken', CSRFToken)
      }
      catch(err) {
          console.log('error', err);
          state.gui.loading = false
          return 
      }
      let recordGetUrl = state.settings.backend_url + "/records/" 
      + "?author=" + payload.username 

      if(payload.date_from != null) {
        recordGetUrl += "&date_from=" + payload.date_from 
      }
      if(payload.date_until != null) {
        recordGetUrl += "&date_until=" + payload.date_until 
      }
      if(payload.location_code != null && payload.location_code != "*") {
        recordGetUrl += "&location_code=" + payload.location_code
      }
      if(payload.processed != null) {
        recordGetUrl += "&processed=" + payload.processed
      }
      // console.log(recordGetUrl)
      const recordGet = await axios.get(recordGetUrl, 
          {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': state.user.csrf_token,
        }})
      if(parseInt(recordGet.status / 100) != 2) return false
      if(payload.processed == 0) {
        console.log("new record data")
        state.database.records = recordGet.data
      }
      else {
        state.database.records = recordGet.data
      }
      state.gui.loading = false
    },
    async deleteRecord(state, payload) {
      // returns sticks by user, processed or not
      const res = await axios.get(this.state.settings.backend_url  + "/get_csrf_token", {
        withCredentials: true,
      })
      try {
          let CSRFToken = res.headers["x-csrftoken"]
          this.commit('setUserCSRFToken', CSRFToken)
      }
      catch(err) {
          console.log('error', err);
          return 
      }

      // 
      const recordDelete = await axios.delete(state.settings.backend_url + "/records/" + payload.id, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': state.user.csrf_token, }
      })
      if(parseInt(recordDelete.status / 100) != 2) return false
      state.database.needsUpdate = true
      return true
    },
    async uploadRecords(state, payload) {
      // csrf
      const res = await axios.get(this.state.settings.backend_url  + "/get_csrf_token", {
        withCredentials: true,
      })
      try {
          let CSRFToken = res.headers["x-csrftoken"]
          this.commit('setUserCSRFToken', CSRFToken)
      }
      catch(err) {
          console.log('error', err);
      }
      

      // batch post
      const recordsPost = await axios.post(state.settings.backend_url + "/record_batch_post/", payload, {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': state.user.csrf_token,
        }})
      if(parseInt(recordsPost.status / 100) != 2) return false
      else return true

    },
    // stations
    async getStations(state, payload) {
      state.database.stationsLoading = true
      console.log("store:getStations")
      // returns sticks by user, processed or not
      const res = await axios.get(this.state.settings.backend_url  + "/get_csrf_token", {
        withCredentials: true,
      })
      try {
          let CSRFToken = res.headers["x-csrftoken"]
          this.commit('setUserCSRFToken', CSRFToken)
      }
      catch(err) {
          console.log('error', err);
          return 
      }
      let stationGetUrl = state.settings.backend_url + "/stations/" 
      if(payload.author != null) {
        stationGetUrl += "?author=" + payload.username 
      }

      // console.log(recordGetUrl)
      const stationGet = await axios.get(stationGetUrl, 
          {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': state.user.csrf_token,
        }})
      state.database.stationsLoading = false
      if(parseInt(stationGet.status / 100) != 2) return false
      stationGet.data.forEach(function(station) {

        state.database.stations = {
          ...state.database.stations,
          [station.code]: [
            station.location_gps_lon,
            station.location_gps_lat
          ]
        }
      })
    },
    async deleteStation(state, payload) {
      // 
      const res = await axios.get(this.state.settings.backend_url  + "/get_csrf_token", {
        withCredentials: true,
      })
      try {
          let CSRFToken = res.headers["x-csrftoken"]
          this.commit('setUserCSRFToken', CSRFToken)
      }
      catch(err) {
          console.log('error', err);
          return 
      }

      // 
      const stationDelete = await axios.delete(state.settings.backend_url + "/stations/" + payload, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': state.user.csrf_token, }
      })
      if(parseInt(stationDelete.status / 100) != 2) return false
      return true
    },
    async uploadStations(state, payload) {
      // csrf
      const res = await axios.get(this.state.settings.backend_url  + "/get_csrf_token", {
        withCredentials: true,
      })
      try {
          let CSRFToken = res.headers["x-csrftoken"]
          this.commit('setUserCSRFToken', CSRFToken)
      }
      catch(err) {
          console.log('error', err);
      }
      
      // batch delete
      console.log("store:station_batch_delete")
      const stationDelete = await axios.get(state.settings.backend_url + "/station_batch_delete/?author=" + state.user.username, {
        withCredentials: true,
        headers: { 
          'Content-Type': 'application/json', 
          'X-CSRFToken': state.user.csrf_token, 
        }})
      if(parseInt(stationDelete.status / 100) != 2) return false

      // batch post
      const stationPost = await axios.post(state.settings.backend_url + "/station_batch_post/", payload, {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': state.user.csrf_token,
        }})
      if(parseInt(stationPost.status / 100) != 2) return false
      else return true

    },
    // auth
    async register(state, payload) {
      state.gui.loading = true
      // csrf
      const res = await axios.get(this.state.settings.backend_url  + "/get_csrf_token", {
        withCredentials: true,
      })
      try {
          let CSRFToken = res.headers["x-csrftoken"]
          this.commit('setUserCSRFToken', CSRFToken)
      }
      catch(err) {
          console.log('error', err);
          state.gui.loading = false
          return 
      }

      return await axios.post(state.settings.backend_url + "/register/", {
          username: payload.username, 
          password: payload.password,
          email: payload.email
        },
        {
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': state.user.csrf_token,
        },
        withCredentials: true,
      })
      .then(() => {
          state.user.username = payload.username
          state.gui.loading = false
          return true
          // this.setState({isAuthenticated: true, username: "", password: "", error: ""});
      })
      .catch((err) => {
          console.log(err);
          state.user.error = err
          state.gui.loading = false
          this.commit("logout")
      });
    },
    async login(state, payload) {
      state.gui.loading = true
      // csrf
      const res = await axios.get(this.state.settings.backend_url  + "/get_csrf_token", {
        withCredentials: true,
      })
      try {
          let CSRFToken = res.headers["x-csrftoken"]
          this.commit('setUserCSRFToken', CSRFToken)
      }
      catch(err) {
          console.log('error', err);
          state.gui.loading = false
          return 
      }

      return await axios.post(state.settings.backend_url + "/login/", {
          username: payload.username, 
          password: payload.password
        },
        {
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': state.user.csrf_token,
        },
        withCredentials: true,
      })
      .then(() => {
          state.user.username = payload.username
          state.gui.loading = false
          return true
          // this.setState({isAuthenticated: true, username: "", password: "", error: ""});
      })
      .catch((err) => {
          console.log(err);
          state.user.error = err
          state.gui.loading = false
          this.commit("logout")
      });
    },
    logout(state) {
      axios.get(state.settings.backend_url + "/logout/", {
        withCredentials: true,
      })
      .then(() => {
        state.user.username = null
        state.user.csrf_token = null
      })
      .catch((err) => {
        console.log(err);
      });
    },
    showLoader(state) {
      state.gui.loading = true
    },
    hideLoader(state) {
      state.gui.loading = false

    }
  },
  actions: {
  },
  modules: {
  }
})
