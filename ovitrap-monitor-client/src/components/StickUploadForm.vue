<template>
  <v-card class="elevation-12 mx-0">
    <v-toolbar dark color="primary">
      <v-toolbar-title>#{{ stickNumber+1 }} <span v-if="this.locationCode != '' && this.uploaded == true">| {{ this.locationCode }} &nbsp; <v-badge content="Uploaded" floating color="success" /></span> 
      
      </v-toolbar-title>
    </v-toolbar>
    <v-card-text v-show="!this.uploaded">
      <v-form>


        {{ $t('upload-enter-location-code') }}<br /><br />
        <v-autocomplete
            v-model="locationCode"
            :items="stationCodes"
            dense
            filled
            :label="$t('location-code')"
          ></v-autocomplete>

        {{ $t('upload-1-2-pics') }}<br /><br />
        <v-file-input
          show-size
          counter
          multiple
          :label="$t('file-input')"
          v-model="files"
        ></v-file-input>

        {{ $t('upload-otherwise-manual') }}
        <v-text-field
            :label="$t('number-of-eggs')"
            placeholder=""
            variant="filled"
            v-model="numberOfEggs"
          ></v-text-field>

        {{ $t('date') }}
        <v-text-field
            placeholder="YYYY-MM-DD"
            variant="filled"
            v-model="date"
          ></v-text-field>

        <v-btn v-if="!uploaded" variant="outlined" block @click="upload">{{ $t('upload') }}</v-btn>

      </v-form>

    </v-card-text>
      <!-- loader-->
        <v-overlay v-model="this.isUploading"  contained class="align-center justify-center">
        <div><v-progress-circular
        
        :model-value="this.uploadProgress"
        size="32"
        color="indigo darken-1"
        ></v-progress-circular>
        </div>
        </v-overlay>
  </v-card>
</template>

<script>
import axios from 'axios';
import store from '../store'
import { displayDateDash } from '../plugins/utils'

export default {
  name: "StickUploadForm",
  components: {
  },
  props: {
    stickNumber: Number,
  },
  data: function() {
    return {
        files: [],
        locationCode: "",
        numberOfEggs: null,
        date: "",
        uploaded: false,
        isUploading: false,
        uploadProgress: 0,
    }
  },
  mounted: function() {
    // load stations 
    store.commit('getStations', { 
      username: store.state.user.username,
    })
    var dateLastMonday = new Date();
    var numberDateOfLastMonday = dateLastMonday.getDate() - dateLastMonday.getDay() + 1;
    dateLastMonday.setDate(numberDateOfLastMonday);
    dateLastMonday.setUTCHours(15);
    this.date = displayDateDash(dateLastMonday);
  },
  computed: {
    stationCodes: function() {
      let ret = []
      if(!store.state.database.stationsLoading) {
        if(Object.keys(store.state.database.stations).length == 0) {
          this.$root.snackbarDefault.show({message: 'You need to upload ovitrap locations before updating pictures.', color: 'error', icon: 'mdi-alert'})
        }
        Object.keys(store.state.database.stations).forEach(function(station) {
          ret.push(station)
        })
        return ret
      }
      else return ['Loading...']
    }
  },
  methods: {
      upload: async function() {
          console.log(this.numberOfEggs)

          // perform checks 
          if(this.numberOfEggs == null) {
            // if user did not enter manual count, check that there are pictures
            if(this.files.length < 1) {
              this.$root.snackbarDefault.show({message: 'Error, you need to upload at least one picture', color: 'error', icon: 'mdi-alert'})
              return 
            }
            if(this.files.length > 2) {
              this.$root.snackbarDefault.show({message: 'Error, you can upload maximum two pictures', color: 'error', icon: 'mdi-alert'})
              return 
            }
          }
          if(this.locationCode == "") {
            this.$root.snackbarDefault.show({message: 'Error, you need to enter the location code', color: 'error', icon: 'mdi-alert'})
            return 
          }
          
          // upload 
          this.isUploading = true
          let fileNames = []
          let fileIndex = 0
          while(fileIndex < this.files.length) {
            await this.uploadFile(this.files[fileIndex])
            this.uploadProgress += 100.0 / this.files.length
            fileNames.push(this.files[fileIndex].name)
            fileIndex += 1
          }

          var dateFromForm = new Date(Date.parse(this.date));
          dateFromForm.setUTCHours(15);
          console.log(dateFromForm);

          // commit mutation to add to database
          store.commit('uploadStick', {
            fileNames,
            locationCode: this.locationCode,
            numberOfEggs: this.numberOfEggs,
            date: dateFromForm,
          })
          

          // return
          this.isUploading = false
          this.uploaded = true
          this.$root.snackbarDefault.show({message: 'Record uploaded'})
      },
    handleUploadRecordError(resp) {
      console.log("Error during record upload")
      console.log(resp)
      this.snackbarUploadText = "Error! " + resp 
      this.snackbarUpload = true
      this.isUploading = false
    },
    async uploadFile(file) {
      console.log("uploadFile 1")
      
      // getting pre-signed upload request for uploading pics to S3
      const res_upload_sign_resp = await axios.get(store.state.settings.backend_url + "/sign_s3?file_name="+file.name+"&file_type=" + file.type)
      if(res_upload_sign_resp.status != 200) return this.handleUploadRecordError(res_upload_sign_resp)
      console.log("uploadFile 2")

      // uploading to S3 with pre-signed upload request
      let s3Data = res_upload_sign_resp.data 
      let postData = new FormData();
      for(let key in s3Data.data.fields){
        postData.append(key, s3Data.data.fields[key]);
      }
      postData.append('file', file);
      console.log("uploadFile 3")
          
      const res_upload_resp = await axios.post(s3Data.url, postData)
      console.log("uploadFile 4", res_upload_resp)
      return file.name
    },
  }
};
</script>

<style>
.v-autocomplete .v-field .v-field__input > input {
  width: 100px !important; /* vuetify bug */
}
</style>
