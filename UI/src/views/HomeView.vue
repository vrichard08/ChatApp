<template>
    <v-container class="fill-height">
      <v-row align="center" justify="center">
        <v-col cols="12" md="8" class="text-center">
          <h2 class="text-h2 mb-6">Let's connect with Your Friends in Real Time</h2>
          
          <!-- Random message boxes -->
          <div class="message-container">
            <v-card
              v-for="(msg, index) in messages"
              :key="index"
              :style="msg.style"
              class="message-box pa-4"
              elevation="2"
              max-width="300"
            >
              <v-card-text>
                {{ msg.text }}
              </v-card-text>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const messages = ref([
    {
      text: "Hey! How's your day going?",
      style: {
        position: 'absolute',
        top: '20%',
        left: '15%',
        transform: 'rotate(-5deg)'
      }
    },
    {
      text: "Let's catch up soon!",
      style: {
        position: 'absolute',
        top: '40%',
        right: '20%',
        transform: 'rotate(3deg)'
      }
    },
    {
      text: "Miss our conversations 😊",
      style: {
        position: 'absolute',
        bottom: '30%',
        left: '25%',
        transform: 'rotate(-2deg)'
      }
    }
  ]);
  </script>
  
  <style scoped>
  .message-container {
    position: relative;
    min-height: 60vh;
  }
  
  .message-box {
    position: absolute;
    transition: transform 0.3s ease;
    cursor: pointer;
    background: rgba(var(--v-theme-surface-variant), 0.9);
  }
  
  .message-box:hover {
    transform: scale(1.05) !important;
  }

  </style>