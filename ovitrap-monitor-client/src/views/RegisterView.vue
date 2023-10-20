<template>
 <v-container >
        <v-row>
            <v-col 
        offset-md="3" md="6">
            <v-card class="elevation-12">
                <v-toolbar dark color="primary">
                <v-toolbar-title>{{ $t('register-form') }}</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                <v-form @keyup.enter="register">
                    <v-text-field
                        prepend-icon="person"
                        name="email"
                        :label="$t('email')"
                        type="text"
                        v-model="email"
                    ></v-text-field>
                    <v-text-field
                        prepend-icon="person"
                        name="username"
                        :label="$t('username')"
                        type="text"
                        v-model="username"
                    ></v-text-field>
                    <v-text-field
                        id="password"
                        prepend-icon="lock"
                        name="password"
                        :label="$t('password')"
                        type="password"
                        v-model="password"
                    ></v-text-field>
                </v-form>
                </v-card-text>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="register">{{ $t('log-in') }}</v-btn>
                </v-card-actions> 
            </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
<script>
import { defineComponent } from 'vue';
import axios from 'axios';
import store from '../store'
import router from '../router'


// Components

export default defineComponent({
  name: 'RegisterView',
  data() {
      return {
          email: '',
          username: '',
          password: '',
          backendUrl: store.state.settings.backend_url,
          csrf: null,
          user: store.state.user
      }
  },
  components: {
  },
  computed: {
      isLogged: function() {
        return store.state.user.username != null
      },
      error: function() { return  store.state.user.error }
  },
  watch: {
      isLogged: function(newValue) {
          if(newValue) router.push('/home')
      },
      error: function(newValue) {
        console.log("new err", newValue)
        this.$root.snackbarDefault.show({message: newValue.response.data.detail, color: 'error', icon: 'mdi-alert'})
        
      }
  },
  mounted() {
    
  },
  methods: {
    whoAmI: function() {
        axios.get(this.backendUrl + "/whoami/", {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => {
            store.commit('setUsername', res.data.username)
            router.push('/home')
        }).catch((err) => {
            console.log("whoami nok", err)
            console.log(err);
        });
    },
    getCSRF: function() {
        axios.get(this.backendUrl + "/get_csrf_token", {
            withCredentials: true,
        })
        .then((res) => {
            let CSRFToken = res.headers["x-csrftoken"]
            store.commit('setUserCSRFToken', CSRFToken)
        })
        .catch((err) => {
            console.log('error', err);
        });
    },
    register: async function() {
        if(this.username != "" && this.password != "" && this.email != "") {
            store.commit('register', {
                email: this.email, 
                username: this.username, 
                password: this.password
            })
        }
    }
  }
});
</script>
