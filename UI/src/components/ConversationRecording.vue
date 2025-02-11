<template>
  <v-card>
    <v-card-title primary-title>
      {{ recordingState.from.name }} ({{ recordingState.from.language.name }})
    </v-card-title>
    <v-card-text class="d-flex">
      <v-icon
        :disabled="isDoneLoading"
        @click="ToggleRecording()"
        class="mr-5"
        icon="mdi-microphone"
        :color="isListening ? 'green' : 'red'"
      ></v-icon>
      <div class="flex-grow-1">{{ localModel || 'Kezdjen beszélni...' }}</div>
      <v-btn
        color="success"
        @click="Done"
        :loading="isDoneLoading"
        :disabled="!localModel || localModel.length == 0"
      >
        Rendben
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { defineProps, onMounted, onBeforeUnmount, watch } from 'vue';
import { useSpeechRecognition } from '@vueuse/core';
import cloneDeep from 'lodash/cloneDeep';
import { ref } from 'vue';
import { getNumber, isMobileOrTablet } from '@/utils/common';
import { translateFunctions } from '@/functions/TranslateFunctions';
let emit = defineEmits(['done']);
let props = defineProps({
  recordingState: {},
});
let isMobile = isMobileOrTablet();
let enabled = ref(false);
let localModel = ref('');
let previousValue = '';

let { start, isListening, toggle, recognition, isSupported } =
  useSpeechRecognition({
    lang: props.recordingState.from.language.code,
    interimResults: true,
    continuous: true,
  });

if (recognition) {
  recognition.onresult = (e) => {
    let results = Array.from(e.results);
    if (isMobile) {
      const currentResult = results[e.resultIndex];
      const { transcript } = currentResult[0];
      localModel.value = previousValue + transcript;
    } else {
      const transcript = results
        .map((r) => {
          return r[0].transcript;
        })
        .join('');
      localModel.value = previousValue + transcript;
    }
  };
}
if (!isSupported.value) {
  alert('A beszédfelismerés nem támogatott!');
}
let ToggleRecording = (enable) => {
  enabled.value = enable ?? !enabled.value;
  if (!isListening.value) {
    localModel.value = '';
    previousValue = '';
  }

  toggle(enabled.value);
};
watch(isListening, (listening) => {
  if (!listening && enabled.value) {
    if (localModel.value) {
      previousValue = localModel.value.trim() + ' ';
    }

    start();
  }
});
onMounted(async () => {
  ToggleRecording(true);
});
onBeforeUnmount(() => {
  ToggleRecording(false);
});
let isDoneLoading = ref(false);
let Done = async () => {
  ToggleRecording(false);
  isDoneLoading.value = true;
  try {
    let sourceLang = props.recordingState.from.language;
    let targetLang = props.recordingState.to.language;
    let translation = await translateFunctions.TranslateWithApi(
      localModel.value,
      sourceLang,
      targetLang
    );
    let payload = {
      ...cloneDeep(props.recordingState),
      createdAt: new Date().toISOString(),
      id: getNumber(),
    };
    payload.from.text = localModel.value;
    payload.from.isTranslated = false;
    payload.to.text = translation;
    payload.to.isTranslated = true;
    emit('done', payload);
  } catch (error) {
    console.log(error);
    alert('Hiba történt fordítás közben');
  }
  isDoneLoading.value = false;
};
</script>
