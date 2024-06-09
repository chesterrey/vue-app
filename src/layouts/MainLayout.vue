<script setup>
import { useRouter } from 'vue-router';
import { ref } from "vue";
import useAuthStore from "../store/auth.js";

import Avatar from 'primevue/avatar';
import Menu from 'primevue/menu';

const router = useRouter();

const route = router.currentRoute.value;

const menu = ref();
const items = ref([
    {
        label: 'Profile',
        items: [
            {
                label: 'Logout',
                command: () => {
                    useAuthStore().destroySession();
                    router.push({ name: 'auth' });
                }
            },
        ]
    }
]);

const toggle = (event) => {
    menu.value.toggle(event);
};
</script>
<template>
    <main class="relative">
        <header class="shadow-md py-4 px-8 flex justify-between items-center border-b">
            <h1 class="text-lg font-bold">Training App</h1>
            <Avatar icon="pi pi-user" class="mr-2" size="large" shape="circle" @click="toggle" />
            <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
        </header>
        <slot></slot>
        <nav class="fixed bottom-0 grid grid-cols-3 w-full min-h-20 border-t bg-white">
            <router-link to="/home" class="p-4 text-center" :class="{'bg-gray-200': route.name === 'home'}">
                <i class="pi pi-flag"></i><br><span>Current</span>
            </router-link>
            <router-link to="/blocks" class="p-4 text-center" :class="{'bg-gray-200': route.name === 'blocks'}">
                <i class="pi pi-folder-open"></i><br><span>Blocks</span>
            </router-link>
            <router-link to="/progress" class="p-4 text-center" :class="{'bg-gray-200': route.name === 'progress'}">
                <i class="pi pi-chart-line"></i><br><span>Progress</span>
            </router-link>
        </nav>
    </main>
</template>