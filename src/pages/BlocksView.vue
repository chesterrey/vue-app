<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from 'vue-router';

import MainLayout from '../layouts/MainLayout.vue';
import CycleDialog from '../components/CycleDialog.vue';
import CreateBlockDialog from "../components/CreateBlockDialog.vue";

import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';

import useBlockStore from '../store/blocks.js';

const { trainingCycles, getTrainingCycles } = useBlockStore();

const router = useRouter();

const loading = ref(true);

const handleBlockClick = (e, id) => {
    e.stopPropagation();
    router.push({ name: 'block-detail', params: { id: id } });
};

onMounted(() => {
    getTrainingCycles().then(() => {
        loading.value = false;
    }).catch(() => {
        loading.value = false;
    }).finally(() => {
        loading.value = false;
    });
});

</script>
<template>
    <MainLayout>
        <div class="min-h-[1200px]" v-if="!loading">
            <div class="p-8 my-4 border-y flex justify-between items-center">
                <h1 class="font-bold text-xl">Training Blocks</h1>
                <CycleDialog />
            </div>
            <Accordion :activeIndex="0">
                <AccordionTab v-for="cycle in trainingCycles" :key="cycle.id">
                    <template #header>
                        <div class="flex justify-between items-center w-full">
                            <h2 class="font-semibold text-lg">{{ cycle.name }}</h2>
                            <div class="flex items-center gap-2">
                                <CreateBlockDialog :trainingCycle="cycle" />
                                <CycleDialog :method="'edit'" :trainingCycle="cycle" />
                                <CycleDialog :method="'delete'" :trainingCycle="cycle" />
                            </div>
                        </div>
                    </template>
                    <p class="m-0 flex flex-col gap-2">
                    <div v-for="block in cycle.training_blocks" class="p-8 bg-primary"
                        @click="handleBlockClick($event, block.id)">
                        <h2 class="font-bold text-lg text-center text-white">Block {{ block.order }}</h2>
                    </div>
                    </p>
                </AccordionTab>
            </Accordion>
        </div>
        <div v-else>
            <div class="flex flex-col items-center justify-center p-20">
                <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
            </div>
        </div>
    </MainLayout>
</template>