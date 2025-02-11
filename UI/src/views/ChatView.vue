<template>
  <v-responsive class="mx-auto" max-width="900">
    <v-container>
      <!-- Chat Header -->
      <div class="d-flex align-center mb-5">
        <v-avatar size="40" color="grey-lighten-1" class="mr-3">
          <v-img
            v-if="selectedUser?.avatar"
            :src="selectedUser.avatar"
            alt="avatar"
            cover
          ></v-img>
          <v-icon v-else>mdi-account-circle</v-icon>
        </v-avatar>
        <h1>{{ selectedUser?.name || 'Chat' }}</h1>
      </div>

      <!-- Chat Messages -->
      <v-card class="chat-container mb-5" height="60vh">
        <v-card-text class="chat-messages" ref="messagesContainer">
          <template v-for="(message, index) in messages" :key="index">
            <div :class="['message-bubble mb-3', message.from == userId ? 'user' : 'assistant']">
              <div class="message-content">
                {{ message.messageText }}
              </div>
              <div class="message-timestamp text-caption text-grey">
                {{ formatTime(message.messageSentAt) }}
              </div>
            </div>
          </template>
        </v-card-text>
      </v-card>

      <!-- Input Area -->
      <v-form @submit.prevent="sendMessage" ref="formRef">
        <div class="d-flex align-center space-x-2">
          <v-text-field
            v-model="newMessage"
            :rules="validations.input"
            label="Írj valamit..."
            :loading="isLoading"
            :disabled="isLoading"
            hide-details
            class="flex-grow-1"
            @keyup.enter="sendMessage"
          ></v-text-field>
          <v-btn
            color="success"
            :loading="isLoading"
            :disabled="!newMessage"
            @click="sendMessage"
          >
            Küldés
          </v-btn>
        </div>
      </v-form>
    </v-container>
  </v-responsive>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { vRequired } from '@/utils/vuetifyFormRules';
import { apiService } from '@/services/apiService';
import { connection } from '@/utils/signalR';

const route = useRoute();
const messagesContainer = ref(null);
const formRef = ref(null);
const newMessage = ref('');
const isLoading = ref(false);
const messages = ref([]);
const skipCounter = ref(0);

const props = defineProps({
  selectedUser: {
    type: Object,
    required: true
  }
});

const validations = computed(() => ({
  input: [vRequired()],
}));

const userId = computed(() => {
  return JSON.parse(localStorage.getItem('user'))?.id;
});


const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    const container = messagesContainer.value.$el;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }
};

const fetchMessages = async () => {
  try {
    let skip = skipCounter.value * 20;
    const response = await apiService.getChat(userId.value, props.selectedUser.id, skip);
    messages.value.unshift(...response.map(x => ({
      from: x.from,
      to: x.to,
      messageText: x.messageText,
      messageSentAt: x.messageSentAt
    })));
    skipCounter.value++;
  } catch (error) {
    console.error('Failed to fetch messages:', error);
  }
};

watch(() => props.selectedUser?.id, async (newId) => {
  if (newId) {
    await fetchMessages(newId);
    scrollToBottom();
  }
});

const handleReceiveMessage = (user, message) => {
  console.log('message', {
    from: user,
    to: userId.value,
    messageText: message,
    messageSentAt: new Date()
  })
  messages.value.push({
    from: user,
    to: userId.value,
    messageText: message,
    messageSentAt: new Date()
  });
  scrollToBottom();
};

const handleScroll = () => {
  if (messagesContainer.value) {
    const container = messagesContainer.value.$el;
    if (container.scrollTop === 0) {
      fetchMessages();
    }
  }
};

onMounted(async () => {
  connection.on('ReceiveMessage', handleReceiveMessage);
  await fetchMessages();
  scrollToBottom();
  messagesContainer.value.$el.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  connection.off('ReceiveMessage', handleReceiveMessage);
  if (messagesContainer.value) {
    messagesContainer.value.$el.removeEventListener('scroll', handleScroll); 
  }
});

const sendMessage = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid || isLoading.value) return;

  const message = {
    from: userId.value,
    to: props.selectedUser.id,
    messageText: newMessage.value,
    messageSentAt: new Date()
  };  
  newMessage.value = '';
  await scrollToBottom();

  isLoading.value = true;
  try {
    await apiService.sendMessage(message);
    await connection.invoke('SendMessage', userId.value, message.messageText);
  } catch (error) {
    console.error('Failed to send message:', error);
  } finally {
    isLoading.value = false;
  }
};

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};
</script>

<style scoped>
.chat-messages {
  height: 100%;
  overflow-y: auto;
  padding: 1rem;
}

.message-bubble {
  max-width: 80%;
  padding: 0.8rem;
  border-radius: 1rem;
}

.message-bubble.user {
  margin-left: auto;
  background-color: rgb(var(--v-theme-primary), 0.1);
}

.message-bubble.assistant {
  margin-right: auto;
  background-color: rgb(var(--v-theme-surface-variant));
}

.message-timestamp {
  text-align: right;
  margin-top: 0.25rem;
}
</style> 