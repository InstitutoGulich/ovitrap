<template>
    <h3>{{ $t('account') }}</h3>

        <p>
            <strong>{{ $t('username') }}</strong><br />
            {{ username }}<br /> 
            <br />
        </p>
        <p>
            <strong>backend</strong><br />
            {{ backend_url }}<br /> 
            <br />
        </p>


</template>

<script>
import store from "../store";

export default {
  name: "SettingsAccount",
  props: {
  },
  computed: {
  },
  components: {
  },
  data: function () {
    return {
        username: store.state.user.username,
        backend_url: process.env.VUE_APP_BACKEND_URL,
    };
  },
  watch: {
  },
  methods: {
  },
};
</script>

<style>

</style>
