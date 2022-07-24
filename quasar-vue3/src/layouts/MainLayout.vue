<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          FFMpeg UI v0.2
        </q-toolbar-title>

        <q-btn @click="onClickClose" color="black" glossy size="sm" icon="close"></q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Essential Links
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
      <q-list>
        <q-item-label header>App Commands</q-item-label>

        <q-item clickable tag="a" @click="onClickClose">
          <q-item-section avatar>
            <q-icon name="close" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Exit</q-item-label>
          </q-item-section>
        </q-item>
        

      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'Github',
    caption: 'ffmpeg-ui',
    icon: 'code',
    link: 'https://evgenykon.github.io/ffmpeg-ui'
  }
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  

  setup () {
    const leftDrawerOpen = ref(false)

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      onClickClose() {
        if (process.env.MODE === 'electron') {
          window.FFMpegApi.windowClose()
        }
      }
    }
  }
})
</script>
