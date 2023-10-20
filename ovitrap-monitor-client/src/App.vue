<template>
  <v-app>
      <v-app-bar color="primary">
        <v-app-bar-title @click="goHome">Ovitrap Monitor</v-app-bar-title>
        <v-spacer></v-spacer>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props">
              <v-icon left>mdi-translate</v-icon>&nbsp; 
                {{ getLanguageFromCode($i18n.locale) }}
              <v-icon small right>mdi-menu-down</v-icon>
            </v-btn>
          </template>
          
          <v-list dense>
            <v-list-item v-for="(lang, index) in langs" :key="index" @click="handleLanguageChange(lang.code)">
              <v-list-item-title>{{ lang.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      
        <template v-slot:append v-if="isMobile">
          <v-btn icon="mdi-dots-vertical" @click="toggleNavigationDrawer"></v-btn>
        </template>
      </v-app-bar>

  <!-- Sizes your content based upon application components -->
  <v-main>

    <!-- Provides the application the proper gutter -->
    <v-container fluid>
      <!-- If using vue-router -->
      <router-view></router-view>
    </v-container>


  </v-main>

  <v-footer app>
    <!-- -->
  </v-footer>


    <!-- toast -->
    <SnackbarDefault ref="snackbarDefault"/>

    <!-- loader --> 
    <v-overlay v-model="this.guiLoading"  class="align-center justify-center app-loader">
        <div>
          <v-progress-circular indeterminate size="32" color="indigo darken-1"></v-progress-circular>
        </div>
    </v-overlay>
  </v-app>
</template>

<script>
import store from './store'
import router from './router'
import { isMobile } from './plugins/utils'
import SnackbarDefault from './components/SnackbarDefault'

export default {
  name: 'App',

  components: {
    SnackbarDefault
  },

  data: () => ({
    langs: [
        { title: 'English', code: 'en' },
        { title: 'Español', code: 'es' },
      ],
    languageMenu: false,
  }),
  mounted() {
    this.$root.snackbarDefault = this.$refs.snackbarDefault
  },
  computed: {
    isMobile: function() { return isMobile() },
    guiLoading: function() { return  store.state.gui.loading }
  },
  methods: {
    toggleNavigationDrawer: function() {
      store.commit('toggleNavigationDrawer')
    },
    goHome: function() {
      router.push("/")
    },
    handleLanguageChange: function(lang) {
      this.$i18n.locale = lang
    },
    getLanguageFromCode: function(code) {
      let languages = {
        'en': 'English',
        'es': 'Español'
      }
      return languages[code]
    }
  }
}
</script>
<style>
h1:first-letter, h2:first-letter, h3:first-letter, .v-list-item-title:first-letter {
  text-transform: capitalize;
}
*:first-letter{
  text-transform: capitalize
}
.app-loader {
  z-index: 2002;
}
</style>