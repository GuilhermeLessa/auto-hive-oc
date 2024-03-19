<script setup lang="ts">
import { inject, ref, onBeforeMount, watch } from "vue";
import Toaster from "./Toaster/Toaster.vue";
import Modal from "./Modal.vue";
import ApplicationError from "../../application/error/ApplicationError";
import StartMonitoring from "../../application/usecase/StartMonitoring";
import StopMonitoring from "../../application/usecase/StopMonitoring";
import { useWorkerStore } from "../../stores/workerStore";

const workerStore = useWorkerStore();

const props = defineProps({
    farmId: {
        type: Number,
        required: true,
    },
    workerId: {
        type: Number,
        required: true,
    },
});

const toaster: Toaster = ref();
const stopConfirmation: Modal = ref();

let startMonitoring: StartMonitoring;
let stopMonitoring: StopMonitoring;

onBeforeMount(() => {
    startMonitoring = inject("startMonitoring");
    stopMonitoring = inject("stopMonitoring");
});

async function start() {
    workerStore.setLoading(true);
    const input = { farmId: props.farmId, workerId: props.workerId };

    const output = await startMonitoring.execute(input);
    if (output.isRight()) {
        workerStore.setMonitoring(true);
        workerStore.setLoading(false);
        toaster.value.success("Overclock monitoring started");
        return;
    }

    const error = output.value;
    if (error instanceof ApplicationError && typeof error.error == "string") {
        toaster.value.error(error.error);
        workerStore.setLoading(false);
        return;
    }
    toaster.value.error("Error trying start monitoring, please try again.");
    workerStore.setLoading(false);
    return;
}

async function stop() {
    workerStore.setLoading(true);
    const input = { farmId: props.farmId, workerId: props.workerId };

    const output = await stopMonitoring.execute(input);
    if (output.isRight()) {
        workerStore.setMonitoring(false);
        workerStore.setLoading(false);
        toaster.value.success("Overclock monitoring stopped");
        return;
    }

    workerStore.setLoading(false);
    toaster.value.error("Error trying stop monitoring, please try again.");
    return;
}
</script>

<template>
    <span>
        <button
            v-if="!workerStore.isMonitoring()"
            type="button"
            id="start-button"
            class="btn btn-outline-primary"
            :disabled="workerStore.isEditing()"
            @click="
                async () => {
                    await start();
                }
            "
            style="margin-right: 10px"
        >
            Start
            <i class="bi bi-play-circle-fill" style="margin-left: 10px"></i>
        </button>
        <button
            v-if="workerStore.isMonitoring()"
            type="button"
            id="stop-button"
            class="btn btn-outline-danger"
            :disabled="workerStore.isEditing()"
            @click="
                () => {
                    stopConfirmation.show();
                }
            "
            style="margin-right: 10px"
        >
            Stop
            <i class="bi bi-stop-circle-fill" style="margin-left: 10px"></i>
        </button>
        <Modal ref="stopConfirmation" id="stop-confirmation" title="Stop">
            <template #content>
                Are you sure you want to stop monitoring?
            </template>
            <template #footer>
                <button
                    type="button"
                    class="btn btn-secondary"
                    id="cancel-button"
                    data-bs-dismiss="modal"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    class="btn btn-primary"
                    id="stop-button"
                    @click="
                        () => {
                            stop();
                            stopConfirmation.hide();
                        }
                    "
                >
                    Stop
                </button>
            </template>
        </Modal>
        <Toaster ref="toaster"></Toaster>
    </span>
</template>