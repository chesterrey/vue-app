import { reactive, toRefs } from "vue";
import BlockService from "../service/BlockService";

const state = reactive({
  trainingCycles: [],
  trainingBlock: {},
  activeTrainingBlock: {},
});

export default function useBlockStore() {
  const getTrainingCycles = async () => {
    const response = await BlockService.getTrainingCycles();
    if (response.success) {
      state.trainingCycles = response.data;
    }
    return response;
  };

  const addTrainingCycle = async (form) => {
    const response = await BlockService.addTrainingCycle(form);
    if (response.success) {
      state.trainingCycles.push(response.data);
    }
    return response;
  };

  const deleteTrainingCycle = async (id) => {
    const response = await BlockService.deleteTrainingCycle(id);
    if (response.success) {
      state.trainingCycles = state.trainingCycles.filter(
        (cycle) => cycle.id !== id
      );
    }
    return response;
  };

  const editTrainingCycle = async (form) => {
    const response = await BlockService.editTrainingCycle(form);
    if (response.success) {
      state.trainingCycles = state.trainingCycles.map((cycle) => {
        if (cycle.id === form.id) {
          return response.data;
        }
        return cycle;
      });
    }
    return response;
  };

  const addTrainingBlock = async (form) => {
    const response = await BlockService.addTrainingBlock(form);
    if (response.success) {
      state.trainingCycles = state.trainingCycles.map((cycle) => {
        if (cycle.id === form.training_cycle_id) {
          cycle.training_blocks.push(response.data);
        }
        return cycle;
      });
    }
    return response;
  };

  const getTrainingBlock = async (id) => {
    const response = await BlockService.getTrainingBlock(id);
    if (response.success) {
      state.trainingBlock = response.data;
    }
    return response;
  };

  const updateTrainingWeek = async (form) => {
    const response = await BlockService.updateTrainingWeek(form);
    if (response.success) {
      state.trainingBlock = response.data;
    }
    return response;
  };

  const getActiveTrainingBlock = async () => {
    const response = await BlockService.getActiveTrainingBlock();
    if (response.success) {
      state.activeTrainingBlock = response.data;
    }
    return response;
  };

  const setActiveTrainingBlock = async (form) => {
    const response = await BlockService.setActiveTrainingBlock(form);
    if (response.success) {
      state.activeTrainingBlock = response.data;
    }
    return response;
  };

  const reset = () => {
    state.trainingCycles = [];
    state.trainingBlock = {};
    state.activeTrainingBlock = {};
  };

  return {
    ...toRefs(state),
    getTrainingCycles,
    addTrainingCycle,
    deleteTrainingCycle,
    editTrainingCycle,
    addTrainingBlock,
    getTrainingBlock,
    updateTrainingWeek,
    getActiveTrainingBlock,
    setActiveTrainingBlock,
    reset,
  };
}
