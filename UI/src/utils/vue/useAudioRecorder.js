import { useUserMedia } from '@vueuse/core';
import { ref, watchEffect } from 'vue';

export const useAudioRecorder = (onFileCreated) => {
  let { start, stop, stream } = useUserMedia({
    constraints: { video: false, audio: true },
  });
  let mediaRecorder = null;
  let chunks = [];
  let isActive = ref(false);

  let StartRecord = () => {
    start();
  };
  let StopRecord = () => {
    mediaRecorder.stop();
    stop();
  };
  let ToggleRecord = () => {
    if (isActive.value) {
      StopRecord();
    } else {
      StartRecord();
    }
  };

  let CreateMediaRecorder = (stream) => {
    mediaRecorder = new MediaRecorder(stream);
    chunks = [];
    mediaRecorder.ondataavailable = (e) => {
      chunks.push(e.data);
    };
    mediaRecorder.onstart = () => {
      isActive.value = true;
    };
    mediaRecorder.onstop = () => {
      let filename = +new Date();
      const blob = new Blob(chunks, { type: 'audio/ogg' });
      const file = new File([blob], filename + '.ogg', { type: 'audio/ogg' });
      if (onFileCreated) {
        onFileCreated(file);
      }
      isActive.value = false;
    };
    mediaRecorder.start(500);
  };

  watchEffect(() => {
    if (stream.value) {
      CreateMediaRecorder(stream.value);
    }
  });

  return { StartRecord, StopRecord, ToggleRecord, isActive };
};
