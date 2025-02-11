<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="pa-4">
          <div class="text-center mb-6">
            <v-avatar size="128" color="grey-lighten-1">
              <v-img
                v-if="form.avatarPreview || userInfo.avatar"
                :src="form.avatarPreview || userInfo.avatar"
                alt="avatar"
                cover
              ></v-img>
              <v-icon v-else size="64">mdi-account-circle</v-icon>
            </v-avatar>
            <h2 class="text-h4 mt-4">{{ userInfo.name || 'Felhasználó' }}</h2>
            <p class="text-subtitle-1 text-medium-emphasis">{{ userInfo.email }}</p>
          </div>

          <v-divider class="mb-8"></v-divider>

          <v-form @submit.prevent="updateProfile" ref="form">
            <v-row>
              <v-col cols="12">
                <FormItem
                  v-model="form.name"
                  label="Név"
                  :rules="nameRules"
                />
              </v-col>

              <v-col cols="12">
                <FormItem
                  v-model="form.email"
                  label="Email"
                  type="email"
                  :rules="emailRules"
                  disabled
                />
              </v-col>

              <v-col cols="12">
                <v-file-input
                  v-model="form.avatar"
                  accept="image/*"
                  label="Profilkép"
                  prepend-icon="mdi-camera"
                  @update:model-value="handleAvatarPreview"
                  :show-size="true"
                ></v-file-input>
              </v-col>

              <v-col cols="12" class="text-center">
                <v-btn
                  color="success"
                  type="submit"
                  :loading="isLoading"
                  min-width="200"
                >
                  Mentés
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import FormItem from '@/components/FormItem.vue';
import { nameRules, emailRules } from '@/utils/vuetifyFormRules';
import { useRouter } from 'vue-router';
import eventBus from '@/utils/eventBus';

const router = useRouter();
const form = ref({
  name: '',
  email: '',
  avatar: null,
  avatarPreview: null
});

const userInfo = ref({
  name: '',
  email: '',
  avatar: null
});

const isLoading = ref(false);

onMounted(() => {
  const user = localStorage.getItem('user');
  if (user) {
    const parsedUser = JSON.parse(user);
    userInfo.value = parsedUser;
    form.value.name = parsedUser.name || '';
    form.value.email = parsedUser.email || '';
  }
});

const handleAvatarPreview = async (file) => {
  if (file) {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        form.value.avatarPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing image:', error);
    }
  } else {
    form.value.avatarPreview = null;
  }
};

const updateProfile = async () => {
  isLoading.value = true;
  try {
    const updatedUser = {
      ...userInfo.value,
      name: form.value.name,
      email: form.value.email,
      avatar: form.value.avatarPreview || userInfo.value.avatar
    };
    
    // Update localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Emit through event bus instead of window event
    eventBus.emit('user-profile-updated', updatedUser);
    
    // Update local state
    userInfo.value = updatedUser;
    
    // Show success message
    alert('Profil sikeresen frissítve!');
    
    // Refresh the page or redirect
    router.go(0);
  } catch (error) {
    console.error('Error updating profile:', error);
    alert('Hiba történt a profil mentése közben!');
  } finally {
    isLoading.value = false;
  }
};
</script> 