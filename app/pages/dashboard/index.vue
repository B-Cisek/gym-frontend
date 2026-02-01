<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});

const { user, fetchUser, logout } = useAuth();

const handleLogout = async () => {
  await logout();
  navigateTo("/login");
};

const fetch = async () => {
  await fetchUser();
};
</script>

<template>
  <div>
    <h1>Dashboard</h1>
    <p v-if="user">Witaj, {{ user.email }}</p>
    <button @click="handleLogout">Wyloguj</button>

    <button @click="fetch">Fetch User</button>
  </div>
</template>
