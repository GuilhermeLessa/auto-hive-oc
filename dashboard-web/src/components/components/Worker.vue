<script setup lang="ts">
import { onMounted, inject, ref, onBeforeMount, watch } from "vue";
import { useRouter } from "vue-router";
import { useWorkerStore } from "../../stores/workerStore";
import AutoRefreshButton from "./AutoRefreshButton.vue";
import MonitoringButton from "./MonitoringButton.vue";
import EditSettingsButton from "./EditSettingsButton.vue";
import GpuCard from "./GpuCard.vue";
import Toaster from "../components/Toaster/Toaster.vue";

const props: any = defineProps({
    accountId: {
        type: Number,
        required: true,
    },
    farmId: {
        type: Number,
        required: true,
    },
    workerId: {
        type: Number,
        required: true,
    },
});

let dashboardApi;
onBeforeMount(() => {
    dashboardApi = inject("dashboardApi");
});

const workerStore = useWorkerStore();

const toaster: Toaster = ref();

async function loadWorker() {
    workerStore.setLoading(true);
    const workerDataOrError = await dashboardApi.getWorker(
        props.farmId,
        props.workerId
    );
    if (workerDataOrError.isLeft()) {
        toaster.value.error(
            "Something went wrong load worker, please try again"
        );
        workerStore.setLoading(false);
        return;
    }
    const { id, name, monitoring, online, gpus } = workerDataOrError.value;
    workerStore.set(id, name, monitoring, online, gpus);
    workerStore.setLoading(false);
}

onMounted(() => {
    loadWorker();
});

watch(
    () => props.workerId,
    (newValue, oldValue) => {
        loadWorker();
    }
);
</script>

<template>
    <div class="container" style="background-color: #212529">
        <template
            v-if="
                (workerStore.getId() || workerStore.isLoading()) &&
                workerStore.isOnline()
            "
        >
            <div class="row mb-4">
                <div class="col-12 d-md-flex justify-content-md-between">
                    <div
                        class="d-grid gap-2 mb-2 mb-md-0 d-md-flex justify-content-md-start"
                    >
                        <span v-show="workerStore.isLoading()">
                            <button
                                type="button"
                                class="btn btn-outline-secondary"
                                disabled
                                style="margin-right: 10px"
                            >
                                Loading...
                            </button>
                        </span>
                        <span v-show="!workerStore.isLoading()">
                            <MonitoringButton
                                :farmId="props.farmId"
                                :workerId="props.workerId"
                                :editing="workerStore.isEditing()"
                            ></MonitoringButton>
                        </span>
                    </div>
                    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                        <EditSettingsButton
                            :accountId="props.accountId"
                            :farmId="props.farmId"
                            :workerId="props.workerId"
                        ></EditSettingsButton>
                        <button
                            type="button"
                            class="btn btn-outline-secondary"
                            :disabled="
                                workerStore.isEditing() ||
                                workerStore.isLoading()
                            "
                            @click="
                                async () => {
                                    workerStore.setLoading(true);
                                    await loadWorker(true);
                                    workerStore.setLoading(false);
                                }
                            "
                        >
                            Refresh
                            <i class="bi bi-arrow-clockwise"></i>
                        </button>
                        <AutoRefreshButton
                            :disabled="
                                workerStore.isLoading() ||
                                workerStore.isEditing()
                            "
                            @onRefresh="
                                async () => {
                                    if (workerStore.isEditing()) {
                                        return;
                                    }
                                    workerStore.setLoading(true);
                                    await loadWorker(true);
                                    workerStore.setLoading(false);
                                }
                            "
                        ></AutoRefreshButton>
                    </div>
                </div>
            </div>

            <div class="row">
                <div
                    class="col-lg-4 col-md-6 col-sm-12 mb-4"
                    v-for="(gpu, index) in workerStore.getGpus()"
                    :key="index"
                >
                    <GpuCard
                        :loading="workerStore.isLoading()"
                        :editing="workerStore.isEditing()"
                        :gpu="gpu"
                    ></GpuCard>
                </div>
            </div>
        </template>

        <template
            v-else-if="
                !workerStore.isLoading() &&
                workerStore.getId() &&
                !workerStore.isOnline()
            "
        >
            <div class="alert alert-warning" role="alert">
                Worker offline. Make sure your worker are online and
                <a
                    href="#"
                    @click="
                        (data) => {
                            loadWorker();
                        }
                    "
                    class="alert-link"
                >
                    click here to try again
                </a>
                .
            </div>
        </template>

        <template v-else-if="!workerStore.isLoading() && !workerStore.getId()">
            <div class="alert alert-danger" role="alert">
                Something went wrong loading worker,
                <a
                    href="#"
                    @click="
                        (data) => {
                            loadWorker();
                        }
                    "
                    class="alert-link"
                >
                    click here to try again
                </a>
                .
            </div>
        </template>
        <Toaster ref="toaster"></Toaster>
    </div>
</template>