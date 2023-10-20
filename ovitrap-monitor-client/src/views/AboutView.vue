<template>
  <Introduction />
</template>

<script>
import { defineComponent } from 'vue';
import Introduction from '../components/Introduction.vue';

export default defineComponent({
  name: 'AboutView',
  components: {
    Introduction,
  },
});
</script>
