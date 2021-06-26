import Vue from 'vue';
import layout from './layout/layout.vue';

new Vue({
    components: {layout},
    template: '<layout></layout>'
  }).$mount('#app')