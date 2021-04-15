<template>
  <div>
    <h4>
      {{name}}
    </h4>
  </div>
</template>

<script lang="ts">
  import Vue from "vue";

  export default Vue.extend({
    data: function() {
      return {
        name: 'Vue Parsed! ' ,
      }
    },
  });
</script>