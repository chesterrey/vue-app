<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { useToast } from "primevue/usetoast";
import useAuthStore from "../store/auth.js";

import Card from 'primevue/card';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Toast from 'primevue/toast';

const router = useRouter();

const loginForm = ref({
    email: null,
    password: null
});

const registerForm = ref({
    name: null,
    email: null,
    password: null,
    password_confirmation: null
});

loginForm.value = {
    email: 'johndoe@email.com',
    password: 'password123',
};

const toast = useToast();
const showSuccess = (message) => {
    toast.add({ severity: 'success', summary: 'Success Message', detail: message, life: 3000 });
};
const showError = (message) => {
    toast.add({ severity: 'error', summary: 'Error Message', detail: message, life: 3000 });
};

const handleRegister = () => {
    if (registerForm.value.password !== registerForm.value.password_confirmation) {
        showError();
        return;
    }

    useAuthStore().register(registerForm.value).then((res) => {
        if (res.success) {
            showSuccess(res.message);
            setTimeout(() => {
                router.push({ name: 'home' });
            }, 1000);
        } else {
            for (const key in res.data) {
                showError(res.data[key][0]);
            }
        }
    }).catch((error) => {
        showError(error.response.data.message);
    });

};

const handleLogin = () => {
    useAuthStore().login(loginForm.value).then((res) => {
        if (res.success) {
            showSuccess(res.message);
            setTimeout(() => {
                router.push({ name: 'home' });
            }, 1000);
        } else {
            showError(res.message);
        }
    }).catch((error) => {
        showError(error.response);
    });
};

</script>

<template>
    <Toast />
    <div>
        <TabView>
            <TabPanel header="Login">
                <Card>
                    <template #title>Login Form</template>
                    <template #content>
                        <div class="flex flex-col gap-2 mb-4">
                            <label for="login-email">Email Address</label>
                            <InputText id="login-email" v-model="loginForm.email" />
                        </div>
                        <div class="flex flex-col gap-2 mb-4">
                            <label for="login-password">Password</label>
                            <Password id="login-password" v-model="loginForm.password" toggleMask :feedback="false" />
                        </div>
                        <Button label="Login" @click="handleLogin" />
                    </template>
                </Card>
            </TabPanel>
            <TabPanel header="Register">
                <Card>
                    <template #title>Register Form</template>
                    <template #content>
                        <div class="flex flex-col gap-2 mb-4">
                            <label for="register-name">Name</label>
                            <InputText id="register-name" v-model="registerForm.name" />
                        </div>
                        <div class="flex flex-col gap-2 mb-4">
                            <label for="register-email">Email Address</label>
                            <InputText id="register-email" v-model="registerForm.email" />
                        </div>
                        <div class="flex flex-col gap-2 mb-4">
                            <label for="register-password">Password</label>
                            <Password id="register-password" v-model="registerForm.password" toggleMask
                                :feedback="false" />
                        </div>
                        <div class="flex flex-col gap-2 mb-4">
                            <label for="register-confirm-password">Confirm Password</label>
                            <Password id="register-confirm-password" v-model="registerForm.password_confirmation"
                                toggleMask :feedback="false" />
                        </div>
                        <Button label="Register" @click="handleRegister" />
                    </template>
                </Card>
            </TabPanel>
        </TabView>
    </div>
</template>