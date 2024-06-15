<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router';
import useBlockStore from "../store/blocks.js";
import MainLayout from '../layouts/MainLayout.vue';

import Button from 'primevue/button';
import OverlayPanel from 'primevue/overlaypanel';
import Checkbox from 'primevue/checkbox';
import Chip from 'primevue/chip';

const router = useRouter();

const trainingBlock = ref(null);
const op = ref();
const week = ref(1);
const day = ref(1);

const trainingSession = ref(null);

const exerciseMenu = ref();
const exerciseMenuToggle = (event, exerciseId) => {
    exerciseMenu.value.toggle(event);
};

const setMenu = ref();
const setMenuToggle = (event, setId) => {
    setMenu.value.toggle(event);
};

const toggleOverlay = (event) => {
    op.value.toggle(event);
}


const handleCalendarClick = (wk, d) => {
    week.value = wk;
    day.value = d;
    op.value.hide();
}

watch([week, day], () => {
    trainingSession.value = trainingBlock.value.training_days
        .find((d) => d.day === day.value).weeks
        .find((wk) => wk.week_number === week.value);
});

onMounted(() => {
    useBlockStore().getTrainingBlock(router.currentRoute.value.params.id).then((response) => {
        trainingBlock.value = response.data;
        trainingSession.value = trainingBlock.value.training_days
            .find((d) => d.day === day.value).weeks
            .find((wk) => wk.week_number === week.value);
    });
});

</script>
<template>
    <MainLayout>
        <div class="min-h-[1200px] pb-96 flex flex-col gap-4" v-if="trainingBlock">
            <div class="p-6 flex flex-col border shadow-md">
                <div class="flex justify-between items-center">
                    <div>
                        <h3 class="font-bold text-lg">{{ trainingBlock.training_cycle.name }} <span
                                class="text-primary">Block {{ trainingBlock.order }}</span>
                        </h3>
                        <div class="text-lg">
                            Week <span class="font-bold">{{ week }}</span>
                            Day <span class="font-bold">{{ day }}</span>
                        </div>
                    </div>
                    <Button icon="pi pi-calendar" outlined @click="toggleOverlay" />
                    <OverlayPanel ref="op" appendTo="self">
                        <div class="flex flex-col gap-6 w-[250px]">
                            <h3 class="text-xl font-bold">Block Calendar</h3>
                            <div class="w-full grid gap-4">
                                <div class="w-full grid place-items-center" v-bind:class="`grid-cols-${trainingBlock.weeks}`">
                                    <div v-for="week in trainingBlock.weeks" :key="week">
                                        Wk {{ week }}
                                    </div>
                                </div>
                                <div v-for="trainingDay in trainingBlock.training_days" class="grid place-items-center"
                                    :class="`grid-cols-${trainingBlock.weeks}`">
                                    <div v-for="week in trainingDay.weeks"
                                        @click="handleCalendarClick(week.week_number, trainingDay.day)"
                                        class="w-10 h-8 text-lg font-bold text-white bg-primary flex justify-center items-center">
                                        {{ trainingDay.day }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </OverlayPanel>
                    <OverlayPanel ref="exerciseMenu" appendTo="self">
                        <div class="flex flex-col gap-6 w-[250px]">
                            <h3 class="text-xl font-bold">Exercise menu</h3>
                            <div class="flex flex-col gap-4">
                                <Button label="Add Exercise" icon="pi pi-plus" />
                                <Button label="Edit Exercise" icon="pi pi-pencil" />
                                <Button label="Delete Exercise" icon="pi pi-trash" />
                                <Button label="Add Set" icon="pi pi-plus-circle" />
                            </div>
                        </div>
                    </OverlayPanel>
                    <OverlayPanel ref="setMenu" appendTo="self">
                        <div class="flex flex-col gap-6 w-[250px]">
                            <h3 class="text-xl font-bold">Set menu</h3>
                            <Button label="Delete Set" icon="pi pi-trash" />
                        </div>
                    </OverlayPanel>
                </div>
            </div>
            <div class="p-6 flex flex-col items-start border gap-4 shadow-md"
                v-for="exercise in trainingSession.exercises">
                <div class="flex justify-between items-center w-full">
                    <div>muscle</div>
                    <Button icon="pi pi-ellipsis-v" text rounded @click="exerciseMenuToggle($event, exercise.id)" />
                </div>
                <div class="font-semibold text-lg">{{ exercise.name }}</div>
                <Chip :label="exercise.strength ? 'Strength' : 'Accessory'" class="rounded-none" />
                <div class="flex flex-col gap-3 w-full">
                    <div class="grid grid-cols-9 place-items-center font-bold">
                        <div class="col-span-1"></div>
                        <div class="col-span-3">Load</div>
                        <div class="col-span-3">Reps</div>
                        <div class="col-span-2">Log</div>
                    </div>
                    <div v-for="set in exercise.sets" class="grid grid-cols-9 place-items-center">
                        <Button icon="pi pi-ellipsis-v" text rounded class="col-span-1" @click="setMenuToggle($event, set.id)"/>
                        <div class="col-span-3">
                            <input v-model="set.load" type="number"
                                class="w-[70px] text-center focus:outline-primary p-2 rounded-none border-2">
                        </div>
                        <div class="col-span-3">
                            <input v-model="set.reps" type="number"
                                class="w-[70px] text-center focus:outline-primary p-2 rounded-none border-2">
                        </div>
                        <div class="col-span-2">
                            <Checkbox v-model="set.logged" :binary="true" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </MainLayout>
</template>