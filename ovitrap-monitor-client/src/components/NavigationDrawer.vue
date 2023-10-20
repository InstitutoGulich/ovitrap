<template>
<v-navigation-drawer v-model="show" permanent>

  <v-list density="compact" nav>
    <v-list-item prepend-icon="mdi-home" :title="$t('home')" value="home" to="home"></v-list-item>
    <v-list-item prepend-icon="mdi-upload" :title="$t('upload')" value="upload" to="upload"></v-list-item>
    <v-list-item prepend-icon="mdi-format-list-bulleted" :title="$t('database')" value="database" to="database"></v-list-item>
    <v-list-item prepend-icon="mdi-clipboard-list-outline" :title="$t('reports')" value="reports" to="reports"></v-list-item>
    </v-list>

  <v-divider></v-divider>

  
  <v-list  v-if="username == 'cordoba-eval'" density="compact" nav>
    <v-list-item prepend-icon="mdi-chart-box-outline" title="Evaluation" value="eval" to="eval"></v-list-item>
  </v-list>
  <v-divider v-if="username == 'cordoba-eval'"></v-divider>


  <v-list density="compact" nav>
    <v-list-item prepend-icon="mdi-cog" :title="$t('settings')" value="settings" to="settings"></v-list-item>
    <v-list-item prepend-icon="mdi-email" :title="$t('contact')" value="contact" to="contact"></v-list-item>
    <v-list-item prepend-icon="mdi-door" :title="$t('log-out')" value="logout" @click="logout"></v-list-item>
  </v-list>

</v-navigation-drawer>
</template>

<script>
import store from '../store'
import router from '../router'
import { isMobile } from '../plugins/utils'

export default {
   name: 'NavigationDrawer',
   data: function() {
      return {
        username: store.state.user.username
      }
   },
   computed: {
     show() {
       if(isMobile()) {
         return store.state.gui.navigation_drawer
       }
       else return true;
     }
   },
   methods: {
     logout: async function() {
       await store.commit('logout')
       router.push('/')
     },
     

   }
};
</script>