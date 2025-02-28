<template>
  <q-page class="">
    <table-statuses />
  </q-page>
</template>

<script>
import TableStatuses from 'components/statuses/TableStatuses.vue';

export default {
  components: { TableStatuses },
  data() {
    return {
    };
  },
  name: 'PageStatuses',
};
</script>
