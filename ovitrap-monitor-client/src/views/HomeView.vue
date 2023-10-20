<template>
  <NavigationDrawer />
  <HomeGuide />
</template>

<script>
import { defineComponent } from 'vue';

// Components
import HomeGuide from '../components/HomeGuide.vue';

import NavigationDrawer from '../components/NavigationDrawer.vue';


export default defineComponent({
  name: 'HomeView',

  components: {
    HomeGuide,
    NavigationDrawer
  },
});
</script>
