<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-4">
          <v-card-title class="text-center text-h5 mb-4">
            Regisztráció
          </v-card-title>
          <v-form @submit.prevent="handleRegister" v-model="isFormValid">
            <FormItem
              v-model="name"
              label="Név"
              :rules="nameRules"
            />
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
            <FormItem
              v-model="passwordConfirm"
              label="Jelszó megerősítése"
              type="password"
              :rules="passwordConfirmRules"
            />
            <v-btn
              block
              color="success"
              type="submit"
              :disabled="!isFormValid"
              class="mt-4"
            >
              Regisztráció
            </v-btn>
            <div class="text-center mt-4">
              <router-link to="/login">Már van fiókod? Jelentkezz be!</router-link>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar
      v-model="showSnackbar"
      color="success"
      timeout="2000"
    >
      Sikeres regisztráció!
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import FormItem from '@/components/FormItem.vue';
import { 
  nameRules, 
  emailRules, 
  passwordRules, 
  createPasswordConfirmRule 
} from '@/utils/vuetifyFormRules';
import { authService } from '@/services/authService'


const router = useRouter();
const isFormValid = ref(false);
const name = ref('');
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');
const showSnackbar = ref(false);

const passwordConfirmRules = computed(() => 
  createPasswordConfirmRule(password.value)
);

const handleRegister = async () => {
  try {
    const response = await authService.register(name.value, email.value, password.value);    
    showSnackbar.value = true;
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    router.push({ name: 'login' });
  } catch (error) {
    console.error('Registration failed:', error);
  }
};
</script> 