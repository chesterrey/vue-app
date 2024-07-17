<script setup>
import { ref } from "vue";
import Checkbox from "primevue/checkbox";
import useExerciseStore from "../../store/exercises";

const props = defineProps({
  trainingSession: Object,
  exerciseId: Number,
  set: Object,
});

const loading = ref(false);

const handleLogSet = (exerciseId, setId) => {
  loading.value = true;
  const exercise = props.trainingSession.exercises.find(
    (e) => e.id === exerciseId
  );
  const set = exercise.sets.find((s) => s.id === setId);

  const setForm = { ...set };

  if (!set.logged) {
    setForm.load = -1;
    setForm.reps = -1;
  }

  useExerciseStore()
    .updateExerciseSet(setForm)
    .then((res) => {
      set.logged = res.data.logged;
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>
<template>
  <div class="col-span-2">
    <i v-if="loading" class="pi pi-spin pi-spinner"></i>
    <Checkbox
      v-else
      v-model="set.logged"
      :binary="true"
      @change="handleLogSet(exerciseId, set.id)"
      :disabled="!set.load || !set.reps || trainingSession.done"
    />
  </div>
</template>
