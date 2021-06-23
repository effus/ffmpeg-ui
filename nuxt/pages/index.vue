<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <div class="text-center">
        <!-- <logo /> -->
        <!-- <vuetify-logo /> -->
        <v-alert type="error" v-if="error">{{ error }}</v-alert>
      </div>
      <v-card>
        <v-card-title class="headline">
          Converter
        </v-card-title>
        <v-card-actions>
          <v-list-item class="grow">
          <v-row align="center" >
<v-btn color="secondary" nuxt to="/convert-avi-mpeg">
            Select source file
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="default" nuxt to="/convert-avi-mpeg">
            Input info
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="default" nuxt to="/convert-avi-mpeg">
            Output format
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="success" nuxt to="/convert-avi-mpeg">
            Start
          </v-btn>
          </v-row>
          </v-list-item>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'

export default {
  components: {
    Logo,
    VuetifyLogo
  },
  data: function() {
    return {
      error: ''
    }
  },
  mounted: function() {
    if (typeof nw !== 'undefined') {
      var win = nw.Window.get();
      console.log('nw.window', win);
    } else {
      this.error = 'NW object unavailable'
    }
  }
}
</script>
