<template>
  <div v-if="voice" class="speech-synthesis d-flex">
    <v-btn
      icon="mdi-account-voice"
      :color="isPlaying ? 'green' : ''"
      variant="text"
      @click="Toggle"
      size="small"
    >
    </v-btn>
  </div>
</template>

<script setup>
import { appFunctions } from '@/functions/AppFunctions';
import { defineProps, computed } from 'vue';
import { useSpeechSynthesis } from '@vueuse/core';
import { ref } from 'vue';
let props = defineProps({
  code: {},
  text: {},
});

const pitch = ref(1);
const rate = ref(1);
let voice = computed(() => {
  return appFunctions.voices.value.find((f) => f.lang.startsWith(props.code));
});
const { speak, isPlaying, stop } = useSpeechSynthesis(props.text, {
  voice,
  pitch,
  rate,
});

let Toggle = () => {
  if (!isPlaying.value) {
    speak();
  } else {
    stop();
  }
};
</script>
