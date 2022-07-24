<template>
  <v-app dark>
  
    <v-app-bar
      fixed
      app
    >
      <v-toolbar-title v-text="title" />
      
    </v-app-bar>
    <v-main>
      <v-container>
        <Converter></Converter>
      </v-container>
    </v-main>
    
    <v-footer
      app
    >
      <v-container>
      <v-row justify="space-between">
        <span>&copy; {{ new Date().getFullYear() }}</span>
        <a href="https://github.com/effus/ffmpeg-ui" target="_blank">Github</a>
      </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>

<style lang="scss">
#loader {
  display: none;
}
</style>

<script>
import Converter from './components/Converter';

export default {
  name: 'App',

  components: {
    Converter,
  },

  data: () => ({
    title: 'FFMpeg UI Tools'
  }),
};
</script>
