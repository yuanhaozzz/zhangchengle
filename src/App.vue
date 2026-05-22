<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style>
/* 全局金融庄重风格 */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  color: #333;
}

.van-toast {
  background: rgba(0, 0, 0, 0.75) !important;
}

.van-dialog__confirm {
  color: #b71c1c !important;
}
</style>
