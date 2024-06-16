import { reactive, toRefs } from "vue";
import ExerciseService from "../service/ExerciseService";

const state = reactive({});

export default function useExerciseStore() {
  const addExercise = async (form) => {
    const response = await ExerciseService.addExercise(form);
    return response;
  };

  const editExercise = async (form) => {
    const response = await ExerciseService.editExercise(form);
    return response;
  };

  const deleteExercise = async (id) => {
    const response = await ExerciseService.deleteExercise(id);
    return response;
  };

  const addExerciseSet = async (id) => {
    const response = await ExerciseService.addExerciseSet(id);
    return response;
  };

  const deleteExerciseSet = async (id) => {
    const response = await ExerciseService.deleteExerciseSet(id);
    return response;
  };

  const updateExerciseSet = async (form) => {
    const response = await ExerciseService.updateExerciseSet(form);
    return response;
  };

  return {
    ...toRefs(state),
    addExercise,
    editExercise,
    deleteExercise,
    addExerciseSet,
    deleteExerciseSet,
    updateExerciseSet,
  };
}
