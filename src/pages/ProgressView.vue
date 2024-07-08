<script setup>
import { ref, onMounted, watch } from 'vue';
import MainLayout from '../layouts/MainLayout.vue';

import useExerciseStore from '../store/exercises';

import Dropdown from 'primevue/dropdown';
import Chart from 'primevue/chart';


const exercises = ref([]);
const selectedExercise = ref('');

onMounted(() => {
    useExerciseStore().getGroupedExercises().then((res) => {
        exercises.value = res
    });

});

watch(selectedExercise, () => {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
});

const chartData = ref();
const chartOptions = ref();
        
const setChartData = () => {
    return {
        datasets: [{
            label: selectedExercise.value?.name,
            data: selectedExercise.value?.sessions.sort((a, b) => new Date(a.updated_at) - new Date(b.updated_at)).map((session) => ({
                updated_at: new Date(session.updated_at).toLocaleDateString(),
                load: session.load
            })),
        }]
    };
};
const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    return {
        parsing: {
            xAxisKey: 'updated_at',
            yAxisKey: 'load'
        },
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            }
        }
    };
}
</script>
<template>
  <MainLayout>
    <div class="min-h-[1200px] flex flex-col gap-4">
        <div class="p-6 flex flex-col border shadow-md gap-4">
            <h1 class="text-lg font-bold">Exercise Progress</h1>
        </div>
        <div class="p-6 flex flex-col border shadow-md gap-4">
            <Dropdown v-model="selectedExercise" :options="exercises" optionLabel="name" placeholder="Select an Exercise" class="w-full" />
        </div>
        <div class="p-2 flex flex-col border shadow-md gap-4" v-if="selectedExercise">
            <Chart type="line" :data="chartData" :options="chartOptions" class="h-[20rem]" />
        </div>
    </div>
  </MainLayout>
</template>