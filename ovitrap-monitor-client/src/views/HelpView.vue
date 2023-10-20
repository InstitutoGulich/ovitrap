<template>
  <NavigationDrawer />
  <h1 class="mb-5">{{ $t('help') }}</h1>

  
</template>

<script>
import { defineComponent } from "vue";

import NavigationDrawer from "../components/NavigationDrawer.vue";

export default defineComponent({
  name: "ContactView",

  components: {
    NavigationDrawer,
  },

  data: function () {
    return {
      numberPosted: 0,
    };
  },

});
</script>
