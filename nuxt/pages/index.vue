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
          <v-btn color="default" nuxt :disabled="inputFile === null" @click="showFileInfo">
            Input info
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="default" nuxt @click="showOutputSetup">
            Output format
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="success" nuxt to="/convert-avi-mpeg" :disabled="inputFile === null || outputSetup.isVisible === false">
            Start
          </v-btn>
          </v-row>
          </v-list-item>
        </v-card-actions>
      </v-card>

      <v-spacer></v-spacer>

      <v-card class="mt-3" v-if="inputFileInfo.isVisible">
        <v-card-title class="headline">
          Input file info
        </v-card-title>
        <v-card-text>
          <v-simple-table dense>
            <template v-slot:default>
              <tbody>
                <tr>
                  <td colspan="2"> <strong>Format</strong> </td>
                </tr>
                <tr><td>Bitrate</td><td>{{ inputFileInfo.data.format.bit_rate }}</td></tr>
                <tr><td>Duration</td><td>{{ inputFileInfo.data.format.duration }}</td></tr>
                <tr><td>Format long name</td><td>{{ inputFileInfo.data.format.format_long_name }}</td></tr>
                <tr><td>Format short names</td><td>{{ inputFileInfo.data.format.format_name }}</td></tr>
                <tr><td>Created at</td><td>{{ inputFileInfo.data.format.tags.creation_time }}</td></tr>
                <tr><td colspan="2"> <strong>Codecs</strong> </td></tr>
                <tr v-for="codec in inputFileInfo.data.streams" :key="codec.index">
                  <td>{{ codec.codec_long_name }}</td>
                  <td v-if="codec.codec_type === 'video'">
                    Aspect ratio: {{ codec.display_aspect_ratio }}<br />
                    Size: {{ codec.coded_width }} x {{ codec.coded_height }}<br />
                    Profile: {{ codec.profile }}<br />
                    Avg frame rate: {{ codec.avg_frame_rate }}<br />
                  </td>
                  <td v-if="codec.codec_type === 'audio'">
                    Channels: {{ codec.channels }}<br />
                    Sample rate: {{ codec.sample_rate }}<br />
                    Profile: {{ codec.profile }}<br />
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
      </v-card>

      <v-card class="mt-3" v-if="outputSetup.isVisible">
        <v-card-title class="headline">
          Setup output format
        </v-card-title>
        <v-card-text>
        
            <v-select
              v-model="outputSetup.selectedFormat"
              :items="outputSetup.presets"
              item-text="preset"
              item-value="file"
              label="Available presets"
              required
            ></v-select>

            <v-simple-table dense>
              <template v-slot:default>
                <tbody>
                  <tr>
                    <td>
                      <v-select :items="['512k', '1024k']" label="Video Bitrate"></v-select>
                    </td>
                    <td>
                      <v-select :items="outputSetup.videoCodecs" label="Codec"></v-select>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <v-select :items="['16:10', '16:9', '5:4', '4:3', '3:2']" label="Aspect ratio"></v-select>
                    </td>
                    <td>
                      <v-select :items="['24', '30', '60']" label="FPS" ></v-select>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <v-select :items="['32k', '64k', '96k', '128k', '192k', '256k']" label="Audio bitrate"></v-select>
                    </td>
                    <td>
                      <v-select :items="outputSetup.audioCodecs" label="Audio codec"></v-select>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <v-select :items="['1', '2', '6']" label="Audio channels"></v-select>
                    </td>
                    <td>
                      <v-select :items="outputSetup.fileFormats" label="Output file format"></v-select>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>        
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'
import axios from 'axios';
import presets from '../../ffmpeg/presets/ui-description.json';

export default {
  components: {
    Logo,
    VuetifyLogo
  },
  data: function() {
    return {
      isNwAvailable: true,
      inputFile: null, 
      inputFileInfo: {
        isVisible: false,
        data: null
      },
      outputSetup: {
        isVisible: false,
        presets: presets,
        videoCodecs: [],
        audioCodecs: [],
        fileFormats: [],
        selectedFormat: null
      },
      error: ''
    }
  },
  mounted: function() {
    if (typeof nw !== 'undefined') {
      var win = nw.Window.get();
      console.log('nw.window', win);
    } else {
      this.error = 'NW object unavailable'
      this.isNwAvailable = false;
    }
  },
  methods: {
    showFileInfo() {
      let filePath = this.inputFile.path;
      this.outputSetup.isVisible = false;
      if (!this.isNwAvailable) {
        filePath = 'ffmpeg/DemoSampleVideo.mp4';
      }
      axios.get('/api/fileInfo?file=' + filePath).then((response) => {
        this.inputFileInfo.isVisible = true;
        this.inputFileInfo.data = response.data.info;

      }).catch((e) => {
        this.error = e.message;
      });
    },
    showOutputSetup() {
      this.inputFileInfo.isVisible = false;
      this.outputSetup.isVisible = true;
    }
  },
  watch: {
  }
}
</script>
