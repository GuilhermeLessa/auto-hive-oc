<script setup lang="ts">
import { onMounted, inject, ref, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { useWorkerStore } from "../../stores/workerStore";
import TabsBar from "../components/TabsBar.vue";

const workerStore = useWorkerStore();
const emit = defineEmits(["onSelect", "onError"]);
const router = useRouter();

const farms = ref([]);
const selected = ref(null);
const error = ref(false);

let dashboardApi;
onBeforeMount(() => {
    dashboardApi = inject("dashboardApi");
});

onMounted(async () => {
    workerStore.setLoading(true);
    const farmsDataOrError = await dashboardApi.getFarms();
    if (farmsDataOrError.isLeft()) {
        error.value = true;
        emit("onError");
        workerStore.setLoading(false);
        return;
    }
    farms.value = farmsDataOrError.value;
    selected.value = farms.value[0].id;
    emit("onSelect", selected.value);
    workerStore.setLoading(false);
});
</script>

<template>
    <TabsBar
        v-if="!error && farms.length"
        :tabs="farms.map((i) => ({ id: i.id, label: i.name }))"
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
        Something went wrong when loading farms,
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