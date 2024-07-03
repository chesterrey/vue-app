<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import useBlockStore from "../store/blocks.js";
import useExerciseStore from "../store/exercises.js";
import { useConfirm } from "primevue/useconfirm";
import MainLayout from "../layouts/MainLayout.vue";

import Button from "primevue/button";
import OverlayPanel from "primevue/overlaypanel";
import Checkbox from "primevue/checkbox";
import Chip from "primevue/chip";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import ConfirmPopup from "primevue/confirmpopup";

const router = useRouter();
const confirm = useConfirm();

const trainingBlock = ref(null);
const op = ref();
const week = ref(1);
const day = ref(1);

const trainingSession = ref(null);
const selectedExercise = ref(null);

const editDialog = ref(false);
const deleteDialog = ref(false);

const activeTrainingBlock = ref(null);

const exerciseMenu = ref();
const exerciseMenuToggle = (event, exerciseId, index) => {
  exerciseMenu.value[index].toggle(event);
};

const setMenu = ref();
const setMenuToggle = (event, index) => {
  setMenu.value[index].toggle(event);
};

const sessionDone = () => {
  return trainingSession.value.exercises.every((exercise) => isDone(exercise));
};

const isDone = (exercise) => {
  return exercise.sets.every((set) => set.logged) && exercise.sets.length > 0;
};

const saveEditedExercise = () => {
  if (!selectedExercise.value.id) {
    useExerciseStore()
      .addExercise(selectedExercise.value)
      .then((res) => {
        trainingSession.value.exercises.push(res.data);
        editDialog.value = false;
      });
    return;
  }

  useExerciseStore()
    .editExercise(selectedExercise.value)
    .then((res) => {
      const index = trainingSession.value.exercises.findIndex(
        (e) => e.id === selectedExercise.value.id
      );
      trainingSession.value.exercises[index] = res.data;
      editDialog.value = false;
    });
};

const toggleOverlay = (event) => {
  op.value.toggle(event);
};

const handleCalendarClick = (wk, d) => {
  week.value = wk;
  day.value = d;
  op.value.hide();
};

const handleAddSet = (exerciseId, index) => {
  const exercise = trainingSession.value.exercises.find(
    (e) => e.id === exerciseId
  );
  useExerciseStore()
    .addExerciseSet(exerciseId)
    .then((response) => {
      exercise.sets.push(response.data);
    });
  exerciseMenu.value[index].hide();
};

const handleRemoveSet = (exerciseId, setId, index) => {
  const exercise = trainingSession.value.exercises.find(
    (e) => e.id === exerciseId
  );
  const setIndex = exercise.sets.findIndex((s) => s.id === setId);

  useExerciseStore()
    .deleteExerciseSet(setId)
    .then(() => {
      exercise.sets.splice(setIndex, 1);
    });
};

const handleLogSet = (exerciseId, setId) => {
  const exercise = trainingSession.value.exercises.find(
    (e) => e.id === exerciseId
  );
  const set = exercise.sets.find((s) => s.id === setId);

  const setForm = {...set};

  if (!set.logged) {
    setForm.load = -1;
    setForm.reps = -1;
  }

  useExerciseStore()
    .updateExerciseSet(setForm)
    .then((res) => {
      set.logged = res.data.logged;
    });
};

const handleDeleteExercise = () => {
  useExerciseStore()
    .deleteExercise(selectedExercise.value.id)
    .then(() => {
      const index = trainingSession.value.exercises.findIndex(
        (e) => e.id === selectedExercise.value.id
      );
      trainingSession.value.exercises.splice(index, 1);
      deleteDialog.value = false;
    });
};

const handleSessionDone = () => {
  trainingSession.value.done = true;
  useBlockStore()
    .updateTrainingWeek(trainingSession.value)
    .then((res) => {
      trainingSession.value = res.data;
    });
};

const handleSetActiveBlock = () => {
  useBlockStore()
    .setActiveTrainingBlock({
      training_block_id: trainingBlock.value.id,
    })
    .then((res) => {
      activeTrainingBlock.value = res.data;
    });
};

const confirmRemoveSet = (event, exerciseId, setId) => {
  confirm.require({
    target: event.currentTarget,
    message: "Are you sure you want to remove this set?",
    icon: "pi pi-exclamation-triangle",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Save",
    },
    accept: () => {
      handleRemoveSet(exerciseId, setId);
    },
    reject: () => {},
  });
};

watch([week, day], () => {
  trainingSession.value = trainingBlock.value.training_days
    .find((d) => d.day === day.value)
    .weeks.find((wk) => wk.week_number === week.value);
});

onMounted(() => {
  const goToNextSession = (session) => {
    if (!session.done) {
      week.value = session.week_number;
      day.value = session.day;
      return;
    }

    var nextDay = session.day;
    var nextWeek = session.week_number;

    if (nextDay >= trainingBlock.value.training_days.length) {
      nextDay = 1;
      nextWeek++;
    } else {
      nextDay++;
    }

    trainingSession.value = trainingBlock.value.training_days
      .find((d) => d.day === nextDay)
      .weeks.find((wk) => wk.week_number === nextWeek);

    goToNextSession(trainingSession.value);
  };

  useBlockStore()
    .getActiveTrainingBlock()
    .then((response) => {
      activeTrainingBlock.value = response.data;
      if (router.currentRoute.value.name === "home") {
        if (response.data.length === 0) {
          return;
        }
        trainingBlock.value = response.data;
        trainingSession.value = trainingBlock.value.training_days
          .find((d) => d.day === day.value)
          .weeks.find((wk) => wk.week_number === week.value);

        goToNextSession(trainingSession.value);
      }
    });

  if (router.currentRoute.value.name === "block-detail") {
    useBlockStore()
      .getTrainingBlock(router.currentRoute.value.params.id)
      .then((response) => {
        trainingBlock.value = response.data;
        trainingSession.value = trainingBlock.value.training_days
          .find((d) => d.day === day.value)
          .weeks.find((wk) => wk.week_number === week.value);

        goToNextSession(trainingSession.value);
      });
  }
});
</script>
<template>
  <MainLayout>
    <div class="min-h-[1200px] pb-96 flex flex-col gap-4" v-if="trainingBlock">
      <div class="p-6 flex flex-col border shadow-md gap-4">
        <div class="flex justify-between items-center">
          <div class="flex flex-col gap-1">
            <h3 class="font-bold text-lg">
              {{ trainingBlock.training_cycle.name }}
              <span class="text-primary">Block {{ trainingBlock.order }}</span>
            </h3>
            <div class="flex items-center gap-4">
              <div class="text-lg">
                Week <span class="font-bold">{{ week }}</span> Day
                <span class="font-bold">{{ day }}</span>
              </div>
              <i
                v-if="trainingSession.done"
                class="pi pi-check-circle text-primary text-2xl"
              ></i>
              <i v-else class="pi pi-spinner text-gray-800 text-2xl"></i>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <Button icon="pi pi-calendar" outlined @click="toggleOverlay" />
          </div>
          <OverlayPanel ref="op" appendTo="self">
            <div class="flex flex-col gap-6 w-[250px]">
              <h3 class="text-xl font-bold">Block Calendar</h3>
              <div class="w-full grid gap-4">
                <div
                  class="w-full grid place-items-center"
                  v-bind:class="`grid-cols-${trainingBlock.weeks}`"
                >
                  <div v-for="week in trainingBlock.weeks" :key="week">
                    Wk {{ week }}
                  </div>
                </div>
                <div
                  v-for="trainingDay in trainingBlock.training_days"
                  class="grid place-items-center"
                  :class="`grid-cols-${trainingBlock.weeks}`"
                >
                  <div
                    v-for="week in trainingDay.weeks"
                    @click="
                      handleCalendarClick(week.week_number, trainingDay.day)
                    "
                    class="w-10 h-8 text-lg font-semibold border-2 flex justify-center items-center"
                    :class="{
                      'text-white bg-primary border-primary': week.done,
                      'text-primary border-primary':
                        week.id === trainingSession.id && !week.done,
                      'text-gray-500 border-gray-500':
                        week.id !== trainingSession.id && !week.done,
                    }"
                  >
                    D{{ trainingDay.day }}
                  </div>
                </div>
              </div>
            </div>
          </OverlayPanel>
        </div>
        <Button
          outlined
          label="Set as active block"
          class="m-auto"
          v-if="trainingBlock?.id !== activeTrainingBlock?.id"
          @click="handleSetActiveBlock"
        />
      </div>
      <div
        class="p-6 flex flex-col items-start border gap-2 shadow-md"
        v-for="(exercise, index) in trainingSession.exercises"
      >
        <div class="flex justify-between items-center w-full">
          <Chip class="pl-0 pr-3">
            <span
              class="text-primary-inverse rounded-full w-8 h-8 flex items-center justify-center"
              :class="isDone(exercise) ? 'bg-primary' : 'bg-gray-500'"
            >
              <i v-if="isDone(exercise)" class="pi pi-check-circle"></i>
              <i v-else class="pi pi-circle"></i>
            </span>
            <span class="ml-2 font-medium">{{ exercise.muscle_group }}</span>
          </Chip>
          <Button
            icon="pi pi-ellipsis-v"
            text
            rounded
            :disabled="trainingSession.done"
            @click="exerciseMenuToggle($event, exercise.id, index)"
          />
          <OverlayPanel ref="exerciseMenu" appendTo="self">
            <div class="flex flex-col gap-6 w-[220px]">
              <h3 class="text-xl font-bold">Exercise menu</h3>
              <div class="flex flex-col gap-4">
                <Button
                  label="Add Exercise"
                  icon="pi pi-plus"
                  @click="
                    () => {
                      editDialog = true;
                      selectedExercise = {
                        week_id: trainingSession.id,
                        name: '',
                        strength: false,
                        rpe: 6,
                        muscle_group: '',
                      };
                    }
                  "
                />
                <Button
                  label="Edit Exercise"
                  icon="pi pi-pencil"
                  @click="
                    () => {
                      editDialog = true;
                      selectedExercise = { ...exercise };
                    }
                  "
                />
                <Button
                  label="Delete Exercise"
                  icon="pi pi-trash"
                  @click="
                    () => {
                      deleteDialog = true;
                      selectedExercise = { ...exercise };
                    }
                  "
                />
                <Button
                  label="Add Set"
                  icon="pi pi-plus-circle"
                  @click="handleAddSet(exercise.id, index)"
                />
              </div>
            </div>
          </OverlayPanel>
        </div>
        <div class="font-semibold text-xl">{{ exercise.name }}</div>
        <Chip
          :label="exercise.strength ? 'Strength' : 'Accessory'"
          class="rounded-none"
        />
        <div class="flex flex-col gap-3 w-full">
          <div class="grid grid-cols-9 place-items-center font-bold">
            <div class="col-span-1"></div>
            <div class="col-span-3">Load</div>
            <div class="col-span-3">Reps</div>
            <div class="col-span-2">Log</div>
          </div>
          <div
            v-for="(set, setIndex) in exercise.sets"
            class="grid grid-cols-9 place-items-center"
          >
            <ConfirmPopup class="w-72"></ConfirmPopup>
            <Button
              @click="confirmRemoveSet($event, exercise.id, set.id)"
              icon="pi pi-times-circle"
              text
              rounded
            ></Button>
            <div class="col-span-3">
              <input
                v-model="set.load"
                type="number"
                :disabled="set.logged"
                class="w-[75px] text-center focus:outline-primary p-2 rounded-none border-2"
              />
            </div>
            <div class="col-span-3">
              <input
                v-model="set.reps"
                type="number"
                :disabled="set.logged"
                class="w-[75px] text-center focus:outline-primary p-2 rounded-none border-2"
              />
            </div>
            <div class="col-span-2">
              <Checkbox
                v-model="set.logged"
                :binary="true"
                @change="handleLogSet(exercise.id, set.id)"
                :disabled="!set.load || !set.reps || trainingSession.done"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="flex gap-4 justify-center w-full">
        <Button
          v-if="!trainingSession.done && sessionDone()"
          label="Session Done"
          @click="handleSessionDone"
        />
      </div>
    </div>
    <Dialog
      v-model:visible="editDialog"
      modal
      header="Exercise Form"
      :style="{ width: '20rem' }"
    >
      <div class="flex flex-col gap-2 py-6">
        <div class="grid grid-cols-2">
          <div class="flex items-center gap-2 place-content-start">
            <label>Strength</label>
            <Checkbox v-model="selectedExercise.strength" :binary="true" />
          </div>
        </div>
        <InputText
          class="w-full mt-2"
          placeholder="Exercise Name"
          v-model="selectedExercise.name"
        />
        <InputText
          class="w-full"
          placeholder="Muscle Group"
          v-model="selectedExercise.muscle_group"
        />
      </div>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancel"
          severity="secondary"
          @click="editDialog = false"
        ></Button>
        <Button type="button" label="Save" @click="saveEditedExercise"></Button>
      </div>
    </Dialog>
    <Dialog
      v-model:visible="deleteDialog"
      modal
      header="Delete exercise"
      :style="{ width: '20rem' }"
    >
      <div class="flex flex-col gap-2 py-6">
        <p>Are you sure you want to delete this exercise?</p>
      </div>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancel"
          severity="secondary"
          @click="deleteDialog = false"
        ></Button>
        <Button
          type="button"
          label="Delete"
          @click="handleDeleteExercise"
        ></Button>
      </div>
    </Dialog>
  </MainLayout>
</template>
