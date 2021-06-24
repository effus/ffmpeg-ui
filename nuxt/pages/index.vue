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
            Input video info
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="default" nuxt @click="showOutputSetup">
            Output config
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="success" nuxt to="/convert-avi-mpeg" :disabled="inputFile === null || outputSetup.isVisible === false">
            Convert
          </v-btn>
          </v-row>
          </v-list-item>
        </v-card-actions>
      </v-card>

      <v-spacer></v-spacer>

      <v-card class="mt-3" v-if="inputFileInfo.isVisible">
        <v-card-title class="headline">
          Input video info
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
          Output config
        </v-card-title>
        <v-card-text>
        
            <v-select
              v-model="outputSetup.selected.preset"
              :items="outputSetup.lists.presets"
              item-text="preset"
              item-value="file"
              label="Available presets"
              required
              @change="changePreset"
            ></v-select>

            <table class="w-100">
              <tbody>
                  <tr>
                    <td width="33%">
                      <v-autocomplete item-text="name" item-value="tag" @change="changeOption" label="Video Codec" 
                      :items="outputSetup.lists.videoCodecs" v-model="outputSetup.selected.videoCodec"></v-autocomplete>
                    </td>
                    <td  width="33%">
                      <v-select :items="['Leave origin', '128k', '512k', '1024k']" label="Video Bitrate" 
                        v-model="outputSetup.selected.videoBitrate" @click="changeOption"></v-select>
                    </td>
                    <td>
                      <v-select :items="['Leave origin', '16:10', '16:9', '5:4', '4:3', '3:2']" label="Aspect ratio" 
                        v-model="outputSetup.selected.aspectRatio" @click="changeOption"></v-select>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <v-select :items="['Leave origin', 24, 30, 60]" label="FPS" 
                        v-model="outputSetup.selected.fps" @click="changeOption"></v-select>
                    </td>
                    <td>
                      <v-select :items="['Leave origin', '320x?', '640x?', '720x?', '768x?', '1080x?', '1280x?', '1440x?', '1920x?', '3840x?']" 
                        label="Size" v-model="outputSetup.selected.size" @click="changeOption"></v-select>
                    </td>
                    <td>
                      <v-autocomplete :items="outputSetup.lists.fileFormats" label="Output file format" item-text="name" item-value="tag"
                        v-model="outputSetup.selected.fileFormat" @click="changeOption"></v-autocomplete>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <v-autocomplete item-text="name" item-value="tag" :items="outputSetup.lists.audioCodecs" label="Audio codec" 
                        v-model="outputSetup.selected.audioCodec" @click="changeOption"></v-autocomplete>
                    </td>
                    <td>
                      <v-select :items="['Leave origin', '32k', '64k', '96k', '128k', '192k', '256k']" label="Audio bitrate" 
                        v-model="outputSetup.selected.audioBitrate" @click="changeOption"></v-select>
                    </td>
                    <td>
                      <v-select :items="['Leave origin', 1, 2, 6]" label="Audio channels" 
                        v-model="outputSetup.selected.audioChannels" @click="changeOption"></v-select>
                    </td>
                  </tr>
                </tbody>
            </table>

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
        lists: {
          presets: presets,
          videoCodecs: [],
          audioCodecs: [],
          fileFormats: [],
        },
        selected: {
          preset: null,
          videoCodec: null,
          audioCodec: null,
          fileFormat: null,
          audioChannels: null,
          audioBitrate: null,
          fps: null,
          aspectRatio: null,
          videoBitrate: null,
          size: null
        },
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
    axios.get('/api/codec/list').then((response) => {
      const codecs = [];
      for (let i in response.data.codecs) {
        codecs.push({
          type: response.data.codecs[i].type,
          tag: i,
          name: response.data.codecs[i].description
        });
      }
      this.outputSetup.lists.videoCodecs = codecs.filter(item => item.type === 'video').map(item => {
        return {name: item.name + ' / tag:' + item.tag, tag: item.tag};
      });
      this.outputSetup.lists.audioCodecs = codecs.filter(item => item.type === 'audio').map(item => {
        return {name: item.name + ' / tag:' + item.tag, tag: item.tag};
      });
    });
    axios.get('/api/format/list').then((response) => {
      const formats = [];
      for (let i in response.data.formats) {
        formats.push({
          tag: i,
          name: response.data.formats[i].description
        });
      }
      this.outputSetup.lists.fileFormats = formats.map(item => {
        return {name: item.name + ' / tag:' + item.tag, tag: item.tag};
      });

    });
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
    },
    changePreset(presetFile) {
      const preset = presets.filter(item => item.file === presetFile)[0];
      this.outputSetup.selected.aspectRatio = preset.aspectRatio;
      this.outputSetup.selected.audioBitrate = preset.audioBitrate;
      this.outputSetup.selected.audioChannels = preset.audioChannels;
      const audioCodec = this.outputSetup.lists.audioCodecs.filter(item => item.tag === preset.audioCodec);
      this.outputSetup.selected.audioCodec = audioCodec.length > 0 ? audioCodec[0] : null;
      this.outputSetup.selected.fileFormat = preset.fileFormat;
      this.outputSetup.selected.fps = preset.fps;
      this.outputSetup.selected.size = preset.size;
      this.outputSetup.selected.videoBitrate = preset.videoBitrate;
      const videoCodec = this.outputSetup.lists.videoCodecs.filter(item => item.tag === preset.videoCodec);
      this.outputSetup.selected.videoCodec = videoCodec.length > 0 ? videoCodec[0] : null;
    },
    changeOption() {
      this.outputSetup.selected.preset = 'custom';
    }
  },
  watch: {
  }
}
</script>
