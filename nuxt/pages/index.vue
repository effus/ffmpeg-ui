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
        <v-card-text>
          <v-file-input prepend-icon="mdi-video" show-size truncate-length="55" accept="video/*" 
            v-model="inputFile"
            label="Video file input"></v-file-input>            
        </v-card-text>
        <v-card-actions>
          <v-list-item class="grow">
          <v-row align="center" >
          <v-btn color="default" nuxt to="/convert-avi-mpeg" :disabled="inputFile === null">
            Input info
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="default" nuxt to="/convert-avi-mpeg">
            Output format
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="success" nuxt to="/convert-avi-mpeg" :disabled="inputFile === null">
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
      inputFile: null, 
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
  },
  methods: {
    onSelectFile(file) {
      
      var fileinput = document.querySelector('input[type=file]');
      console.log(fileinput.value);
    }
  },
  watch: {
    inputFile: (val) => {
      console.log(val)
    }
  }
}
</script>
