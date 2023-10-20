<template>
      <NavigationDrawer  />
    <h1 class="mb-5">{{ $t('upload') }}</h1>

    {{ $t('upload-description') }}
    <div class="mt-5" v-for="(stick, index) in this.sticks" v-bind:key="index">
      <StickUploadForm 
        :stickNumber="index"
      />
    </div>
    <v-btn variant="contained-text" class="mt-5" block @click="addStickForm">{{ $t('upload-add-record') }}</v-btn>
</template>

<script>
import { defineComponent } from 'vue';

import NavigationDrawer from '../components/NavigationDrawer.vue';
import StickUploadForm from '../components/StickUploadForm.vue';

export default defineComponent({
  name: 'UploadView',
  components: {
    NavigationDrawer,
    StickUploadForm
  },
  data() {
    return {
      sticks: [{}]
    }
  },
  methods: {
    addStickForm: function() {
      this.sticks.push({})
    }
  }
});
</script>
