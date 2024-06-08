<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from 'vue-router';
import useAuthStore from "../store/auth.js";

import MainLayout from '../layouts/MainLayout.vue';
import CreateCycleDialog from '../components/CreateCycleDialog.vue';

import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Button from 'primevue/button';

import useBlockStore from '../store/blocks.js';

const { trainingCycles, getTrainingCycles, addTrainingCycle } = useBlockStore();

onMounted(() => {
    getTrainingCycles();
});

</script>
<template>
    <MainLayout>
        <div class="min-h-[1200px]">
            <div class="p-8 my-4 border-y flex justify-between items-center">
                <h1 class="font-bold text-xl">Training Blocks</h1>
                <CreateCycleDialog />
            </div>
            <Accordion :activeIndex="0">
                <AccordionTab :header="cycle.name" v-for="cycle in trainingCycles" :key="cycle.id">
                    <p class="m-0">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris nisi ut aliquip ex ea commodo
                        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                        fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                        deserunt mollit anim id est
                        laborum.
                    </p>
                </AccordionTab>
            </Accordion>
        </div>
    </MainLayout>
</template>