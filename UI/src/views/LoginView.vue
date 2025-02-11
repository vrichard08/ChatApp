<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-4">
          <v-card-title class="text-center text-h5 mb-4">
            Bejelentkezés
          </v-card-title>
          <v-form @submit.prevent="handleLogin" v-model="isFormValid">
            <FormItem
              v-model="email"
              label="Email"
              type="email"
              :rules="emailRules"
            />
            <FormItem
              v-model="password"
              label="Jelszó"
              type="password"
              :rules="passwordRules"
            />
            <v-btn
              block
              color="success"
              type="submit"
              :disabled="!isFormValid"
              class="mt-4"
            >
              Bejelentkezés
            </v-btn>
            <div class="text-center mt-4">
              <router-link to="/register">Még nincs fiókod? Regisztrálj!</router-link>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import FormItem from '@/components/FormItem.vue';
import { emailRules, passwordRules } from '@/utils/vuetifyFormRules';
import { authService } from '@/services/authService'

const router = useRouter();
const isFormValid = ref(false);
const email = ref('');
const password = ref('');

const handleLogin = async () => {
  try {
    const response = await authService.login(email.value, password.value);
    const user = {
      id: response.user,
      email: email.value,
      token: response.token
    };
    localStorage.setItem('user', JSON.stringify(user));
    
    router.push({ name: 'default' });
  } catch (error) {
    console.error('Login failed:', error);
  }
};
</script> 