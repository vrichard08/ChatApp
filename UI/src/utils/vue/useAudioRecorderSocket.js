import { useDevicesList, usePermission, useUserMedia } from '@vueuse/core';
import { computed, onBeforeUnmount, onMounted, ref, watchEffect } from 'vue';
import settings from '@/data/settings';

export const useAudioRecorderSocket = (onText, onStart) => {
  const microphoneAccess = usePermission('microphone');
  const { audioInputs } = useDevicesList({ requestPermissions: false });

  let isMicEnabled = computed(() => {
    return microphoneAccess.value != 'denied';
  });
  let hasMic = computed(() => {
    return audioInputs.value.length > 0;
  });

  let { start, stop, stream, isSupported, enabled } = useUserMedia({
    constraints: { video: false, audio: true },
  });

  let starting = ref(false);
  let audioRecorderId = ref(+new Date());
  let StartRecord = async () => {
    starting.value = true;
    try {
      await startWebSocket();
      await start();
      if (onStart) {
        onStart();
      }
    } catch (error) {
      console.log(error);
    }
    starting.value = false;
  };
  let StopRecord = () => {
    stopWebSocket();
    if (context && context.state != 'closed') {
      context.close();
    }
    stop();
  };
  let ToggleRecord = () => {
    if (enabled.value) {
      StopRecord();
    } else {
      StartRecord();
    }
  };

  const bufferSize = 4096;
  const chunk_length_seconds = 3;
  const chunk_offset_seconds = 0.1;
  const language = 'hu';
  let websocket = null;
  let processor = null;
  let chunks = [];

  let context = null;

  let startWebSocket = () => {
    return new Promise((resolve, reject) => {
      const websocketAddress = settings.whisperUrl;

      if (!websocketAddress) {
        return;
      }

      websocket = new WebSocket(websocketAddress);
      websocket.addEventListener('open', (event) => {
        resolve(websocket);
      });

      websocket.onclose = (event) => {
        reject(event);
      };
      websocket.onerror = (e) => {
        console.log('onerror', e);
      };
      websocket.onmessage = (event) => {
        const transcript_data = JSON.parse(event.data);
        if (onText) {
          onText(transcript_data);
        }
      };
    });
  };

  let stopWebSocket = () => {
    if (websocket) {
      websocket.close();
    }
  };

  let downsampleBuffer = (buffer, inputSampleRate, outputSampleRate) => {
    if (inputSampleRate === outputSampleRate) {
      return buffer;
    }
    var sampleRateRatio = inputSampleRate / outputSampleRate;
    var newLength = Math.round(buffer.length / sampleRateRatio);
    var result = new Float32Array(newLength);
    var offsetResult = 0;
    var offsetBuffer = 0;
    while (offsetResult < result.length) {
      var nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
      var accum = 0,
        count = 0;
      for (
        var i = offsetBuffer;
        i < nextOffsetBuffer && i < buffer.length;
        i++
      ) {
        accum += buffer[i];
        count++;
      }
      result[offsetResult] = accum / count;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }
    return result;
  };

  let processAudio = (e) => {
    const inputSampleRate = context.sampleRate;
    const outputSampleRate = 16000;

    const left = e.inputBuffer.getChannelData(0);
    const downsampledBuffer = downsampleBuffer(
      left,
      inputSampleRate,
      outputSampleRate
    );
    const audioData = convertFloat32ToInt16(downsampledBuffer);

    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send(audioData);
    }

    chunks.push(audioData); // Store audio data chunks for the new functionality
  };

  let convertFloat32ToInt16 = (buffer) => {
    let l = buffer.length;
    const buf = new Int16Array(l);
    while (l--) {
      buf[l] = Math.min(1, buffer[l]) * 0x7fff;
    }
    return buf.buffer;
  };

  let sendAudioConfig = () => {
    const audioConfig = {
      type: 'config',
      data: {
        sampleRate: context.sampleRate,
        bufferSize: bufferSize,
        channels: 1,
        language: language,
        processing_strategy: 'silence_at_end_of_chunk',
        processing_args: { chunk_length_seconds, chunk_offset_seconds },
        id: audioRecorderId.value,
      },
    };

    websocket.send(JSON.stringify(audioConfig));
  };

  let CreateMediaRecorder = (stream) => {
    context = new AudioContext();
    const input = context.createMediaStreamSource(stream);
    processor = context.createScriptProcessor(bufferSize, 1, 1);
    processor.onaudioprocess = (e) => processAudio(e);
    input.connect(processor);
    processor.connect(context.destination);
    sendAudioConfig();
  };

  let AcceptTranscribe = () => {
    websocket.send(1);
  };

  watchEffect(() => {
    if (stream.value) {
      CreateMediaRecorder(stream.value);
    }
  });
  onMounted(() => {});
  onBeforeUnmount(() => {
    stopWebSocket();
    stop();
  });

  return {
    StartRecord,
    StopRecord,
    ToggleRecord,
    AcceptTranscribe,
    isActive: enabled,
    starting,
    isSupported,
    isMicEnabled,
    hasMic,
    audioRecorderId,
  };
};
