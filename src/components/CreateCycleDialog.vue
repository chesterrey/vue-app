<script setup>
import { ref } from "vue";
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';

const visible = ref(false);
const value = ref('');

const handleSave = () => {
    console.log(value.value);
    value.value = '';
    visible.value = false;
};
</script>
<template>
    <div class="card flex justify-center">
        <Button icon="pi pi-plus" @click="visible = true" />
        <Dialog v-model:visible="visible" modal header="New Training Cycle" :style="{ width: '25rem' }">
            <div class="my-4">
                <label for="name" class="font-semibold">Training Cycle Name</label>
                <InputText id="name" class="mt-2 w-full" autocomplete="off" v-model="value" />
            </div>
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button type="button" label="Save" @click="handleSave"></Button>
            </div>
        </Dialog>
    </div>
</template>
