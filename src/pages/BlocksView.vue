<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

import MainLayout from "../layouts/MainLayout.vue";
import CycleDialog from "../components/CycleDialog.vue";
import CreateBlockDialog from "../components/CreateBlockDialog.vue";
import Button from "primevue/button";
import ConfirmPopup from "primevue/confirmpopup";
import Toast from "primevue/toast";

import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";

import useBlockStore from "../store/blocks.js";

const { trainingCycles, getTrainingCycles } = useBlockStore();

const router = useRouter();
const confirm = useConfirm();
const toast = useToast();

const loading = ref(true);

const selectedBlock = ref(null);

const handleBlockClick = (e, block) => {
  e.stopPropagation();
  selectedBlock.value = block;
};

const handleCycleTitleClick = (e) => {
  if (selectedBlock.value) {
    e.stopPropagation();
    selectedBlock.value = null;
  }
};

const handleBlockDetailClick = () => {
  router.push({ name: "block-detail", params: { id: selectedBlock.value.id } });
};

const confirmDeleteBlock = (event) => {
  confirm.require({
    target: event.currentTarget,
    message: "Are you sure you want to delete this block?",
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
      useBlockStore()
        .deleteTrainingBlock(selectedBlock.value.id)
        .then(() => {
          toast.add({
            severity: "success",
            summary: "Success Message",
            detail: "Training Block deleted successfully",
            life: 3000,
          });
          selectedBlock.value = null;
        });
    },
    reject: () => {},
  });
};

onMounted(() => {
  getTrainingCycles()
    .then(() => {
      loading.value = false;
    })
    .catch(() => {
      loading.value = false;
    })
    .finally(() => {
      loading.value = false;
    });
});
</script>
<template>
  <MainLayout>
    <Toast />
    <div class="min-h-[1200px] flex flex-col gap-4" v-if="!loading">
      <div class="p-6 flex items-center justify-between border shadow-md gap-4">
        <h1 class="text-lg font-bold">Training Cycles</h1>
        <CycleDialog />
      </div>
      <Accordion :activeIndex="0">
        <AccordionTab v-for="cycle in trainingCycles.slice().reverse()" :key="cycle.id">
          <template #header>
            <div
              class="flex gap-2 items-center w-full"
              @click="handleCycleTitleClick"
            >
              <h2 class="font-semibold text-lg">{{ cycle.name }}</h2>
              <i v-if="selectedBlock" class="pi pi-angle-right"></i>
              <h2
                v-if="selectedBlock"
                class="text-primary font-semibold text-lg"
              >
                Block {{ selectedBlock.order }}
              </h2>
            </div>
          </template>
          <div class="m-0 flex flex-col gap-2">
            <div v-if="!selectedBlock" class="flex justify-between items-center gap-2 border border-surface-300 shadow-sm p-1 rounded-xl mb-4">
              <CreateBlockDialog :trainingCycle="cycle" />
              <CycleDialog :trainingCycle="cycle" method="edit" />
              <CycleDialog :trainingCycle="cycle" method="delete" />
            </div>
            <div
              v-if="!selectedBlock"
              v-for="block in cycle.training_blocks"
              class="p-8 bg-primary"
              @click="handleBlockClick($event, block)"
            >
              <h2 class="font-bold text-lg text-center text-white">
                Block {{ block.order }}
              </h2>
            </div>
            <div v-else class="p-2 flex items-center justify-between">
              <div class="flex flex-col gap-1">
                <h2 class="text-xl font-bold">
                  Block {{ selectedBlock.order }}
                </h2>
                <p class="text-lg">{{ selectedBlock.weeks }} weeks</p>
              </div>
              <div class="flex items-center gap-2">
                <Button
                  @click="handleBlockDetailClick"
                  icon="pi pi-eye"
                  outlined
                />
                <ConfirmPopup class="w-64"></ConfirmPopup>
                <Button
                  @click="confirmDeleteBlock"
                  icon="pi pi-trash"
                  severity="secondary"
                  outlined
                />
              </div>
            </div>
          </div>
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
