<script setup>
import { ref } from 'vue';
import TodoList from './components/TodoList.vue';
import { SpeedInsights } from "@vercel/speed-insights/vue"

</script>

<template>
  <SpeedInsights/>
  <RouterView/>
</template>

<style scoped>

</style>
