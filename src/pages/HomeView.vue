<script setup>
import { useRouter } from 'vue-router';
import useAuthStore from "../store/auth.js";
import MainLayout from '../layouts/MainLayout.vue';

import Button from 'primevue/button';

const router = useRouter();

const user = useAuthStore().user;

const handleLogout = () => {
    useAuthStore().destroySession();
    router.push({ name: 'auth' });
};
</script>
<template>
    <MainLayout>
        <div class="min-h-[1200px]">
            <h1>Home</h1>
            <p>Welcome, {{ user }}</p>
            <Button outlined label="Logout" @click="handleLogout" />
        </div>
    </MainLayout>
</template>