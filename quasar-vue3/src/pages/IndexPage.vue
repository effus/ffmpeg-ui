<template>
  
  <div class="q-pa-md">

    <q-banner inline-actions class="text-white bg-red q-mb-md" v-if="!isEngineOk">
      Something goes wrong, FFMpeg Engine unavailable...
    </q-banner>

    <q-toolbar class="bg-secondary text-white shadow-2 rounded-borders" v-if="isEngineOk">
      <q-btn flat :label="tab" />
      <q-space />

      <q-tabs v-model="tab" shrink stretch>
        <q-tab name="Info" label="Info" />
        <q-tab name="Converter" label="Converter" />
      </q-tabs>
    </q-toolbar>

    <q-tab-panels v-model="tab" animated v-if="isEngineOk">

      <!-- Info tab -->
      <q-tab-panel name="Info">
        <div class="text-h6">Get Video Info</div>

        <q-file v-model="fileObj" label="Select video file" accept="video/*" >
          <template v-slot:prepend>
            <q-icon name="movie" />
          </template>
        </q-file>

        <div class="q-pt-md q-gutter-sm">
          <q-btn color="primary" icon="info" label="Get file info" v-bind:disabled="fileObj === null" @click="getFileInfo" />
        </div>


        <div class="q-pt-md">
          <q-table
            title="Video Info"
            dense
            :rows="videoFileInfoRows"
            :columns="columns"
            row-key="name"
            hide-bottom
            :pagination="{rowsPerPage: 100}"
          />
        </div>

        <div class="q-pt-md">
          <q-expansion-item
            class="shadow-1 overflow-hidden"
            icon="explore"
            label="Raw codec response"
            header-class="bg-secondary"
          >
            
            <pre>{{videoFileInfo}}</pre>
          </q-expansion-item>
        </div>


      </q-tab-panel>

      <!-- Converter tab -->
      <q-tab-panel name="Converter">
        <div class="text-h6">Converter</div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </q-tab-panel>

    </q-tab-panels>
  </div>

</template>

<script>
import { defineComponent, ref, computed , reactive, onMounted, toRaw } from 'vue'
import FFMpegFileInfoData from '../libs/FFMpegFileInfoData';

export default defineComponent({
  name: 'IndexPage'
})
</script>

<script setup>
const tab = ref('Info');
const fileObj = ref(null);
const isEngineOk = ref(false);
const videoFileInfo = reactive({});
const videoFileInfoRows = computed(() => {
  if (!videoFileInfo || !videoFileInfo.value) {
    return [];
  }
  const VideoData = new FFMpegFileInfoData(toRaw(videoFileInfo.value));
  return VideoData.formatOutputTable();
});

const columns = [
  { name: 'property', label: 'Property', align: 'left', field: row => row.name, format: val => `${val}`,},
  { name: 'value', align: 'left', label: 'Value', field: 'value'},
]


onMounted(() => {
  if (process.env.MODE === 'electron') {
    window.FFMpegApi.checkEngine('ping', (resp) => {
      isEngineOk.value = true;
    })
  }
})

function getFileInfo() {
  if (process.env.MODE === 'electron') {
    window.FFMpegApi.getVideoInfo(fileObj.value.path, (resp) => {
      console.log('getVideoInfo', resp);
      videoFileInfo.value = resp.info;
    })
  }
}


</script>