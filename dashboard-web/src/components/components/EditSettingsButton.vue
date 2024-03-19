<script setup lang="ts">
import { ref, toRef, onBeforeMount, inject } from "vue";
import Modal from "./Modal.vue";
import Toaster from "../components/Toaster/Toaster.vue";
import { useWorkerStore } from "../../stores/workerStore";
import GpuData from "../../domain/entity/GpuData";
import SettingsErrors from "../components/SettingsErrors.vue";
import ApplicationError from "../../application/error/ApplicationError";

const workerStore = useWorkerStore();

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

const toaster: Toaster = ref();
const cancelConfirmation: Modal = ref();
const saveConfirmation: Modal = ref();

const backup = null;
let gpusData = null;
const errors = ref([]);

let dashboardApi, validateSettings, saveSettings;
onBeforeMount(() => {
    dashboardApi = inject("dashboardApi");
    validateSettings = inject("validateSettings");
    saveSettings = inject("saveSettings");
});

function validate() {
    const input = {
        accountId: props.accountId,
        farmId: props.farmId,
        workerId: props.workerId,
        gpus: workerStore.getGpus(),
    };
    const output = validateSettings.execute(input);
    if (output.isLeft()) {
        errors.value = output.value;
        return;
    }
    gpusData = output.value;
    saveConfirmation.value.show();
}

async function save() {
    workerStore.setLoading(true);
    const input = {
        farmId: props.farmId,
        workerId: props.workerId,
        gpusData,
    };
    const output = await saveSettings.execute(input);
    if (output.isRight()) {
        toaster.value.success("Settings saved");
        workerStore.setEditing(false);
        workerStore.setLoading(false);
        errors.value = [];
        return;
    }

    const error = output.value;
    if (error instanceof ApplicationError && typeof error.error == "string") {
        toaster.value.error(error.error);
        await reloadWorker();
        workerStore.setLoading(false);
        return;
    }

    if (error instanceof ApplicationError && Array.isArray(error.error)) {
        error.error.forEach((e) => toaster.value.error(e));
        await reloadWorker();
        workerStore.setLoading(false);
        return;
    }

    toaster.value.error(
        "Something went wrong saving settings, please try again"
    );
    await reloadWorker();
    workerStore.setLoading(false);
}

async function reloadWorker() {
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
</script>

<template>
    <template v-if="workerStore.isEditing()">
        <button
            type="button"
            class="btn btn-outline-danger"
            :disabled="workerStore.isLoading()"
            @click="
                () => {
                    if (JSON.stringify(workerStore.getGpus()) == backup) {
                        workerStore.setGpus(JSON.parse(backup));
                        workerStore.setEditing(false);
                        errors = [];
                        return;
                    }
                    cancelConfirmation.show();
                }
            "
        >
            Cancel Editing
        </button>
        <button
            type="button"
            class="btn btn-outline-primary"
            :disabled="workerStore.isLoading()"
            @click="validate()"
        >
            Save Settings
            <i class="bi bi-save2-fill" style="margin-left: 10px"></i>
        </button>
    </template>
    <button
        v-else
        type="button"
        class="btn btn-outline-secondary"
        :disabled="workerStore.isEditing() || workerStore.isLoading()"
        @click="
            () => {
                backup = JSON.stringify(workerStore.getGpus());
                workerStore.setEditing(true);
            }
        "
    >
        Edit Settings
        <i class="bi bi-sliders" style="margin-left: 10px"></i>
    </button>
    <Modal ref="cancelConfirmation" title="Cancel">
        <template #content>
            Are you sure to discard settings changes?
        </template>
        <template #footer>
            <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
            >
                Back
            </button>
            <button
                type="button"
                class="btn btn-primary"
                @click="
                    () => {
                        cancelConfirmation.hide();
                        workerStore.setGpus(JSON.parse(backup));
                        workerStore.setEditing(false);
                        errors = [];
                    }
                "
            >
                Discard
            </button>
        </template>
    </Modal>
    <Modal ref="saveConfirmation" title="Save">
        <template #content>Do you confirm settings changes?</template>
        <template #footer>
            <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
            >
                Back
            </button>
            <button
                type="button"
                class="btn btn-primary"
                @click="
                    () => {
                        saveConfirmation.hide();
                        save();
                    }
                "
            >
                Save
            </button>
        </template>
    </Modal>
    <SettingsErrors :errors="errors"></SettingsErrors>
    <Toaster ref="toaster"></Toaster>
</template>