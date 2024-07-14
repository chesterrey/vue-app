<script setup>
import { ref, defineProps, watch, onMounted } from "vue";

import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Stepper from "primevue/stepper";
import StepperPanel from "primevue/stepperpanel";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Dropdown from "primevue/dropdown";
import Checkbox from "primevue/checkbox";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";

import useBlockStore from "../store/blocks";
import { setsEqual } from "chart.js/helpers";

const props = defineProps({
  trainingCycle: Object,
});

const toast = useToast();
const loading = ref(false);

const visible = ref(false);
const weeks = ref(4);
const days = ref(4);
const trainingDays = ref([]);
const selectedTrainingDay = ref(null);

watch(days, (newDays) => {
  trainingDays.value = Array.from({ length: newDays }, (_, i) => ({
    day: i + 1,
    exercises: [],
  }));

  selectedTrainingDay.value = trainingDays.value[0];
});

const handleDialog = (e) => {
  e.stopPropagation();
  visible.value = true;
};

const handleAddExercise = (e) => {
  const trainingDay = trainingDays.value.find(
    (day) => day.day === selectedTrainingDay.value.day
  );
  trainingDay.exercises.push({
    name: "",
    strength: false,
    muscle_group: "",
  });
};

const removeExercise = (e) => {
  const trainingDay = trainingDays.value.find(
    (day) => day.day === selectedTrainingDay.value.day
  );
  trainingDay.exercises.splice(trainingDay.exercises.indexOf(e), 1);
};

const verifyExercises = () => {
  return trainingDays.value.every((day) => {
    return (
      day.exercises.length > 0 &&
      day.exercises.every((exercise) => {
        return exercise.name && exercise.muscle_group;
      })
    );
  });
};

const handleCreateTrainingBlock = () => {
  loading.value = true;

  const form = {
    training_cycle_id: props.trainingCycle.id,
    weeks: weeks.value,
    training_days: trainingDays.value,
  };

  useBlockStore()
    .addTrainingBlock(form)
    .then(() => {
      toast.add({
        severity: "success",
        summary: "Success Message",
        detail: "Training Block added successfully",
        life: 3000,
      });
    })
    .catch(() => {
      return;
    })
    .finally(() => {
      loading.value = false;
      visible.value = false;
    });
};

onMounted(() => {
  trainingDays.value = Array.from({ length: days.value }, (_, i) => ({
    day: i + 1,
    exercises: [],
  }));

  selectedTrainingDay.value = trainingDays.value[0];
});
</script>
<template>
  <Toast />
  <Button icon="pi pi-plus" text @click="handleDialog" />
  <Dialog
    v-model:visible="visible"
    modal
    header="Add Training Block"
    :style="{ width: '25rem' }"
  >
    <Stepper linear>
      <StepperPanel>
        <template #content="{ nextCallback }">
          <div class="flex flex-col">
            <div class="flex flex-col gap-2 mb-4">
              <label class="font-bold" for="weeks">Weeks</label>
              <InputNumber
                id="weeks"
                v-model="weeks"
                mode="decimal"
                :min="1"
                class="w-2"
              />
            </div>
            <div class="flex flex-col gap-2 mb-4">
              <label class="font-bold" for="days">Days</label>
              <InputNumber
                id="days"
                v-model="days"
                mode="decimal"
                :min="1"
                class="w-2"
              />
            </div>
          </div>
          <div class="flex pt-4 justify-end">
            <Button
              label="Next"
              icon="pi pi-arrow-right"
              iconPos="right"
              @click="nextCallback"
            />
          </div>
        </template>
      </StepperPanel>
      <StepperPanel>
        <template #content="{ prevCallback, nextCallback }">
          <div class="flex flex-col gap-4">
            <div class="flex items-center justify-between w-full">
              <Button
                severity="secondary"
                rounded
                outlined
                icon="pi pi-angle-left"
                :disabled="selectedTrainingDay.day === 1"
                @click="
                  () => {
                    selectedTrainingDay = trainingDays.find(
                      (day) => day.day === selectedTrainingDay.day - 1
                    );
                  }
                "
              />
              <Dropdown
                v-model="selectedTrainingDay"
                :options="trainingDays"
                :optionLabel="(day) => 'Day ' + day.day"
                placeholder="Select a Day"
              />
              <Button
                severity="secondary"
                rounded
                outlined
                icon="pi pi-angle-right"
                :disabled="selectedTrainingDay.day === days"
                @click="
                  () => {
                    selectedTrainingDay = trainingDays.find(
                      (day) => day.day === selectedTrainingDay.day + 1
                    );
                  }
                "
              />
            </div>
            <div v-if="selectedTrainingDay" class="p-4">
              <div class="flex flex-col gap-6">
                <div v-for="(exercise, index) in selectedTrainingDay.exercises">
                  <div class="grid grid-cols-2">
                    <label :for="index">Exercise {{ index + 1 }}</label>
                    <div class="flex items-center gap-2 place-content-end">
                      <label :for="index">Strength</label>
                      <Checkbox
                        v-model="exercise.strength"
                        :binary="true"
                        class="mr-2"
                      />
                    </div>
                  </div>
                  <InputText
                    :id="index"
                    class="w-full mt-2"
                    v-model="exercise.name"
                    placeholder="Exercise Name"
                  />
                  <div class="flex items-center gap-2 mt-2">
                    <InputText
                      :id="`muscle-${index}`"
                      class="w-full"
                      placeholder="Muscle Group"
                      v-model="exercise.muscle_group"
                    />
                    <Button outlined icon="pi pi-trash" @click="removeExercise" />
                  </div>
                </div>
                <Button label="Add" @click="handleAddExercise" />
              </div>
            </div>
          </div>
          <div class="flex pt-4 justify-between">
            <Button
              label="Back"
              severity="plain"
              icon="pi pi-arrow-left"
              @click="prevCallback"
            />
            <Button
              label="Next"
              icon="pi pi-arrow-right"
              iconPos="right"
              @click="nextCallback"
              :disabled="!verifyExercises()"
            />
          </div>
        </template>
      </StepperPanel>
      <StepperPanel>
        <template #content="{ prevCallback }">
          <div class="flex flex-col">
            <Button
              @click="handleCreateTrainingBlock"
              label="Create training block"
              :loading="loading"
            ></Button>
          </div>
          <div class="flex pt-4 justify-start">
            <Button
              label="Back"
              severity="plain"
              icon="pi pi-arrow-left"
              @click="prevCallback"
            />
          </div>
        </template>
      </StepperPanel>
    </Stepper>
  </Dialog>
</template>
