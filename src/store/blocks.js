import { reactive, toRefs } from "vue";
import BlockService from "../service/BlockService";

const state = reactive({
  trainingCycles: [],
});

export default function useBlockStore() {
  const getTrainingCycles = async () => {
    const response = await BlockService.getTrainingCycles();
    if (response.success) {
      state.trainingCycles = response.data;
    }
    return response;
  };

  const addTrainingCycle = async (trainingCycle) => {
    const response = await BlockService.addTrainingCycle(trainingCycle);
    if (response.success) {
      state.trainingCycles.push(response.data);
    }
    return response;
  }

  return {
    ...toRefs(state),
    getTrainingCycles,
    addTrainingCycle,
  };
}
