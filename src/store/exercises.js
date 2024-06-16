import { reactive, toRefs } from "vue";
import ExerciseService from "../service/ExerciseService";

const state = reactive({});

export default function useExerciseStore() {
  const editExercise = async (form) => {
    const response = await ExerciseService.editExercise(form);
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

  return {
    ...toRefs(state),
    editExercise,
    addExerciseSet,
    deleteExerciseSet,
  };
}
