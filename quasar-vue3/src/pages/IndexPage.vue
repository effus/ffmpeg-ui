<template>
  <q-page class="flex flex-center">
    
    Some page content

    <q-btn @click="onClick"></q-btn>


  </q-page>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IndexPage'
})
</script>

<script setup>
function onClick() {
  if (process.env.MODE === 'electron') {
    window.FFMpegApi.checkEngine('ping', (resp) => {
      console.log('UI', resp);
    })
  }
}
</script>