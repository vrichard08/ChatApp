<template>
  <video ref="videoPlayer" class="video-js">
    <slot></slot>
  </video>
</template>
<script setup>
import videojs from 'video.js';
import hu from 'video.js/dist/lang/hu.json';
import 'video.js/dist/video-js.css';
import { onMounted, ref, onBeforeUnmount } from 'vue';

let props = defineProps({
  options: {
    type: Object,
    default() {
      return null;
    },
  },
});

let videoPlayer = ref();
let player = null;
onMounted(() => {
  let opts = props.options || {};
  player = videojs(videoPlayer.value, {
    language: 'hu',
    languages: { hu },
    ...opts,
  });
});
onBeforeUnmount(() => {
  if (player) {
    player.dispose();
  }
});
</script>
