<template>
  <v-card class="oeg-record-deleter">
    <v-card-text>
      <v-row>
        <!-- front -->
        <v-col md="12">
          {{ $t('editor-sure-delete') }} {{ record.location_code }} {{ $t('from') }} {{ recordDate }}?
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn color="error" block variant="outlined" @click="doDelete">{{ $t('delete') }}</v-btn
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
      errorsInStick: false,
      errorsInStickMessage: "",
      s3_url: store.state.settings.s3_url 
    };
  },
  watch: {
    record: function(newv, oldv) {
      console.log("stick", newv, oldv)
    },
  },
  methods: {
    doDelete: async function () {
        // delete to database
        const stickObject = {
            id: this.record.id,
        };
        await store.commit("deleteRecord", stickObject);
        this.$emit("update:dialog", false);
        this.$root.snackbarDefault.show({message: this.$t('editor-record-deleted')})
    },
  },
};
</script>

<style>
.oeg-record-deleter {
  width: 50vw;
}
.oeg-record-deleter-img-location {
  height: 30vh;
}
.oeg-record-deleter-img-stick {
  max-height: 66vh;
}
</style>
