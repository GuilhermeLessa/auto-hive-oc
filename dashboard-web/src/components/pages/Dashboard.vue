<script setup lang="ts">
import { onMounted, inject, ref, reactive, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { useWorkerStore } from "../../stores/workerStore";
import LogoutButton from "../components/LogoutButton.vue";
import FarmsTabs from "../components/FarmsTabs.vue";
import WorkersTabs from "../components/WorkersTabs.vue";
import Worker from "../components/Worker.vue";

let checkLogin;
const router = useRouter();
let loginData: any = {};
let dashboardApi;

onBeforeMount(() => {
    checkLogin = inject("checkLogin");
    const loginDataOrError = checkLogin.execute();
    if (loginDataOrError.isLeft()) {
        router.push("/dashboard");
        return;
    }
    loginData = loginDataOrError.value;
    dashboardApi = inject("dashboardApi");
    dashboardApi.setAccountId(loginData.accountId);
    dashboardApi.setToken(loginData.token);
});

const workerStore = useWorkerStore();

const loadFarmsError = ref(false);
const selectedFarmId = ref();

const loadWorkersError = ref(false);
const selectedWorkerId = ref();
</script>

<template>
    <div class="container" data-bs-theme="dark">
        <div class="d-flex justify-content-end">
            <LogoutButton :disable="workerStore.isEditing()"></LogoutButton>
        </div>

        <h1 class="mb-5">Automatic Hive OS Overclock</h1>

        <div>
            <h3>Farms</h3>
            <FarmsTabs
                @onSelect="
                    (farmId) => {
                        selectedFarmId = farmId;
                    }
                "
                @onError="
                    () => {
                        loadFarmsError = true;
                    }
                "
            ></FarmsTabs>
        </div>

        <div class="mt-3" v-if="!loadFarmsError && selectedFarmId">
            <h3>Workers</h3>

            <WorkersTabs
                :farmId="selectedFarmId"
                @onSelect="
                    async (workerId) => {
                        selectedWorkerId = workerId;
                    }
                "
                @onError="
                    () => {
                        loadWorkersError = true;
                    }
                "
            ></WorkersTabs>

            <Worker
                v-if="
                    !loadFarmsError &&
                    !loadWorkersError &&
                    selectedFarmId &&
                    selectedWorkerId
                "
                :accountId="loginData.accountId"
                :farmId="selectedFarmId"
                :workerId="selectedWorkerId"
            ></Worker>
        </div>
    </div>
</template>

<style scoped>
.container {
    color: white;
    background-color: #363d45;
    padding: 2vw;
}
</style>
