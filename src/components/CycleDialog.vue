<script setup>
import { ref, defineProps, onMounted } from "vue";
import useBlockStore from '../store/blocks.js'

import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';

const props = defineProps({
    method: String,
    trainingCycle: Object
});

const toast = useToast();

const visible = ref(false);
const form = ref({
    name: ''
});

const handleDialog = (e) => {
    e.stopPropagation();
    visible.value = true;
};

const handleSave = () => {
    useBlockStore().addTrainingCycle(form.value);
    form.value = {
        name: ''
    };
    toast.add({ severity: 'success', summary: 'Success Message', detail: "Training Cycle added successfully", life: 3000 });
    visible.value = false;
};

const handleEdit = () => {
    useBlockStore().editTrainingCycle(
        {
            id: props.trainingCycle.id,
            name: form.value.name
        }
    );
    form.value = {
        name: ''
    };
    toast.add({ severity: 'success', summary: 'Success Message', detail: "Training Cycle updated successfully", life: 3000 });
    visible.value = false;
};

const handleDelete = () => {
    useBlockStore().deleteTrainingCycle(props.trainingCycle.id);
    toast.add({ severity: 'success', summary: 'Success Message', detail: "Training Cycle deleted successfully", life: 3000 });
    visible.value = false;
};

onMounted(() => {
    if (props.method === 'edit') {
        form.value = {
            name: props.trainingCycle.name
        };
    }
});
</script>
<template>
    <Toast />
    <div class="card flex justify-center">
        <Button icon="pi pi-pencil" outlined v-if="method === 'edit'" @click="handleDialog" />
        <Button icon="pi pi-trash" outlined severity="danger" v-if="method === 'delete'" @click="handleDialog" />
        <Button icon="pi pi-plus" v-if="!method" @click="handleDialog" />
        <Dialog v-model:visible="visible" modal header="New Training Cycle" :style="{ width: '25rem' }" v-if="!method">
            <div class="my-4">
                <label for="name" class="font-semibold">Training Cycle Name</label>
                <InputText id="name" class="mt-2 w-full" autocomplete="off" v-model="form.name" />
            </div>
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button type="button" label="Save" @click="handleSave"></Button>
            </div>
        </Dialog>
        <Dialog v-model:visible="visible" modal header="Edit Training Cycle" :style="{ width: '25rem' }"
            v-if="method === 'edit'">
            <div class="my-4">
                <label for="name" class="font-semibold">Training Cycle Name</label>
                <InputText id="name" class="mt-2 w-full" autocomplete="off" v-model="form.name" />
            </div>
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button type="button" label="Save" @click="handleEdit"></Button>
            </div>
        </Dialog>
        <Dialog v-model:visible="visible" modal header="Delete Training Cycle" :style="{ width: '25rem' }"
            v-if="method === 'delete'">
            <div class="my-4">
                <p>Are you sure you want to delete this training cycle?</p>
            </div>
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button type="button" label="Delete" severity="danger" @click="handleDelete"></Button>  
            </div>
        </Dialog>
    </div>
</template>

