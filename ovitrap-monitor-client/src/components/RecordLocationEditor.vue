<template>
  <v-card class="oeg-record-loc-editor">
    <v-card-text>
      <v-row>
        <!-- front -->
        <v-col md="12">
          {{ $t('editor-new-location') }} {{ record.location_code }} {{ $t('from') }} {{ recordDate }}?

          <v-text-field
            label="Location code"
            placeholder="XX-XX-X"
            variant="filled"
            v-model="locationCode"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" block variant="outlined" @click="doEdit">{{ $t('edit') }} {{ $t('record') }}</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import store from "../store";
import { displayDate } from '../plugins/utils'

export default {
  name: "RecordEditor",
  props: {
    record: {},
    dialog: Boolean
  },
  computed: {
    recordDate: function() {
      return displayDate(this.record.timestamp_upload)
    }
  },
  components: {
  },
  data: function () {
    return {
      locationCode: this.record.location_code,
    };
  },
  watch: {
    record: function(newv, oldv) {
      console.log("stick", newv, oldv)
    },
  },
  methods: {
    doEdit: async function () {

        // save to database
        const newStickObject = { ...this.record }
        newStickObject.location_code = this.locationCode
        if(this.validateStick(newStickObject)) {
            console.log("validation ok", newStickObject)

            await store.commit("editStick", newStickObject)
            this.$emit("update:dialog", false);
            this.$root.snackbarDefault.show({message: this.$t('editor-record-saved')})
        }
        else {
            console.log("validation nok")
            this.$root.snackbarDefault.show({message: 'Error', color: 'error', icon: 'mdi-alert'})
        }
    },
    validateStick: function(record) {
        console.log(record.locationCode)
        return true
    }
  },
};
</script>

<style>
.oeg-record-loc-editor {
  width: 50vw;
}
</style>
