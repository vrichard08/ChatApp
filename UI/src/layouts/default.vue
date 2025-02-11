<template>
  <v-app>
    <v-app-bar scroll-behavior="elevate">
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <router-link to="/" class="d-flex">
          <img src="@/assets/logo_rich-removebg-preview.png" alt="Konasoft" width="200px" />
        </router-link>
      </template>

      <v-spacer></v-spacer>

      <v-autocomplete
        v-model="search"
        :items="potentialFriends"
        item-title="userName"
        item-value="id"
        label="Új barát keresése..."
        prepend-inner-icon="mdi-magnify"
        single-line
        hide-details
        density="compact"
        class="mx-4"
        style="max-width: 300px;"
        @update:modelValue="onPotentialFriendSelect"
      ></v-autocomplete>

      <v-spacer></v-spacer>
      <v-btn
        variant="text"
        to="/profile"
      >
        <v-avatar size="32" color="grey-lighten-1">
          <v-img
            v-if="userInfo?.avatar"
            :src="userInfo.avatar"
            alt="avatar"
            cover
          ></v-img>
          <v-icon v-else>mdi-account-circle</v-icon>
        </v-avatar>
          <span class="ml-2 d-none d-sm-flex">{{ userInfo?.name || userInfo?.email }}</span>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer">
      <v-list v-if="users">
        <v-list-subheader class="d-flex align-center">
          Beszélgetések
          <!-- <v-expand-transition>
            <v-text-field
              v-if="showSearch"
              v-model="conversationSearch"
              single-line
              hide-details
              density="compact"
              class="ml-2"
              style="max-width: 150px;"
              @blur="showSearch = false"
            ></v-text-field>
            <v-btn
              v-else
              icon="mdi-magnify"
              size="small"
              variant="text"
              class="ml-2"
              @click="showSearch = true"
            ></v-btn>
          </v-expand-transition> -->
        </v-list-subheader>

        <v-list-item
          v-for="user in filteredUsers"
          :key="user.id"
          :to="`/chat/${user.id}`"
          link
        >
          <template v-slot:prepend>
            <v-avatar size="40" color="grey-lighten-1">
              <v-img
                v-if="user.avatar"
                :src="user.avatar"
                alt="avatar"
                cover
              ></v-img>
              <v-icon v-else>mdi-account-circle</v-icon>
            </v-avatar>
          </template>
          <v-list-item-title>{{ user.name }}</v-list-item-title>
          <v-list-item-subtitle class="text-truncate">
            {{ user.message?.messageText ?? "Start new conversation" }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <v-divider></v-divider>
        <v-list-item
          link
          title="Kijelentkezés"
          @click="handleLogout"
          class="mt-2"
        >
          <template v-slot:prepend>
            <v-icon icon="mdi-logout"></v-icon>
          </template>
        </v-list-item>
      </template>
    </v-navigation-drawer>
    <v-main>
      <router-view v-slot="{ Component }">
        <component 
          :is="Component || HomeView" 
          :selected-user="route.name === 'chat' ? users.find(u => u.id.toString() === route.params.id) : undefined"
        />
      </router-view>
    </v-main>
    <v-dialog v-model="showAddFriendDialog" max-width="400">
      <v-card>
        <v-card-title>Add New Friend</v-card-title>
        <v-card-text>
          Are you sure you want to add {{ selectedFriend?.name }} as a friend?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="showAddFriendDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="addFriend">Add Friend</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watchEffect, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { authService } from '@/services/authService'
import { apiService } from '@/services/apiService'
import eventBus from '@/utils/eventBus';
import HomeView from '@/views/HomeView.vue';

const router = useRouter();
const route = useRoute();
const drawer = ref(true);
const currentRoute = ref('/');
const userInfo = ref(null);
const users = ref([]);

const search = ref('');
const conversationSearch = ref('');
const potentialFriends = ref([]);
const showAddFriendDialog = ref(false);
const selectedFriend = ref(null);
const showSearch = ref(false);

const handleProfileUpdate = (updatedUser) => {
  userInfo.value = updatedUser;
};

const filteredUsers = computed(() => {
  if (!conversationSearch.value) return users.value;
  return users.value.filter(user => 
    user.name.toLowerCase().includes(conversationSearch.value.toLowerCase())
  );
});

const userId = computed(() => {
  return JSON.parse(localStorage.getItem('user'))?.id;
});

onMounted(() => {
  currentRoute.value = route.path;
  const user = localStorage.getItem('user');
  if (user) {
    userInfo.value = JSON.parse(user);
  }
  
  eventBus.on('user-profile-updated', handleProfileUpdate);
  fetchUsers();
  fetchPotentialFriends();
});

onBeforeUnmount(() => {
  eventBus.off('user-profile-updated', handleProfileUpdate);
});

const handleLogout = () => {
  authService.logout()
  router.push({ name: 'login' });
};

const fetchUsers = async () => {
  try {
    if (userId) {
      const response = await apiService.getUserFriendsWithMessages(userId.value);
      users.value = response;
    }
  } catch (error) {
    console.error('Failed to fetch users:', error);
  }
};

const onUserSelect = (selectedUserId) => {
  if (selectedUserId) {
    console.log('Navigating to chat with user ID:', selectedUserId);
    router.push({ name: 'chat', params: { id: selectedUserId } });
  }
};

const onPotentialFriendSelect = (selectedUserId) => {
  if (selectedUserId) {
    selectedFriend.value = potentialFriends.value.find(f => f.id === selectedUserId);
    showAddFriendDialog.value = true;
  }
};

const fetchPotentialFriends = async () => {
  try {
    const response = await apiService.getPotentialFriends(userId.value);
    potentialFriends.value = response;
  } catch (error) {
    console.error('Failed to fetch potential friends:', error);
  }
};

const addFriend = async () => {
  try {
    await apiService.addFriend({userId: userId.value,friendId: selectedFriend.value?.id});
  } catch (error) {
    console.error('Failed to add user as friend:', error);
  }
  showAddFriendDialog.value = false;
};
</script>
