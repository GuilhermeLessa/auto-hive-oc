<script setup lang="ts">
import { onMounted, inject, ref, onBeforeMount, watch } from "vue";
import { useRouter } from "vue-router";
import { useWorkerStore } from "../../stores/workerStore";
import TabsBar from "./TabsBar.vue";

const props: any = defineProps({
    farmId: {
        type: Number,
        required: true,
    },
});

const emit = defineEmits(["onSelect", "onError"]);

const workerStore = useWorkerStore();

const router = useRouter();

const workers = ref([]);
const selected = ref(null);
const error = ref(false);

let dashboardApi;
onBeforeMount(() => {
    dashboardApi = inject("dashboardApi");
});

async function loadWorkers() {
    workerStore.setLoading(true);
    const workersDataOrError = await dashboardApi.getWorkers(props.farmId);
    if (workersDataOrError.isLeft()) {
        error.value = true;
        emit("onError");
        workerStore.setLoading(false);
        return;
    }
    workers.value = workersDataOrError.value;
    selected.value = workers.value[0].id;
    emit("onSelect", selected.value);
    workerStore.setLoading(false);
}

onMounted(() => {
    loadWorkers();
});

watch(
    () => props.farmId,
    (newValue, oldValue) => {
        loadWorkers();
    }
);
</script>

<template>
    <TabsBar
        v-if="!error && workers.length"
        :tabs="workers.map((i) => ({ id: i.id, label: i.name }))"
        :selectedId="selected"
        :disableAll="workerStore.isEditing() || workerStore.isLoading()"
        @onSelect="
            (selectedId) => {
                selected = selectedId;
                emit('onSelect', selectedId);
            }
        "
    ></TabsBar>
    <div v-if="error" class="alert alert-danger" role="alert">
        Something went wrong when loading workers,
        <a
            href="#"
            @click="
                (data) => {
                    router.go();
                }
            "
            class="alert-link"
        >
            click here to try again
        </a>
        .
    </div>
</template>