<template>
  <NavigationDrawer />
  <h1 class="mb-5">{{ $t('contact') }}</h1>

  <p>{{ $t('contact-git') }}</p>
  <a href="https://gitlab.com/charles.hamesse/ovitrap-monitor-client">{{ $t('contact-git-front') }}</a><br />
  <a href="https://gitlab.com/charles.hamesse/ovitrap-monitor-server">{{ $t('contact-git-back') }}</a>
  <br /><br />
  <p>{{ $t('contact-mail') }}</p>
  <a href="mailto:veroandreo@gmail.com">veroandreo@gmail.com</a><br />
  <a href="mailto:charles.hamesse@ugent.be">charles.hamesse@ugent.be</a>
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
