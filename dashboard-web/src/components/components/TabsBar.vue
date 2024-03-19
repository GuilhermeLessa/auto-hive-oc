<script setup lang="ts">
interface TabsArray {
    id: number | string;
    label: string;
}

const props = defineProps({
    tabs: {
        type: Array<TabsArray>,
        default: [],
        required: true,
    },
    selectedId: {
        type: [Number, String],
        default: null,
        required: true,
    },
    disableAll: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(["onSelect"]);
</script>

<template>
    <ul class="nav nav-tabs">
        <li class="nav-item" v-for="(tab, index) in props.tabs" :key="index">
            <a
                v-if="props.disableAll"
                class="nav-link text-muted"
                :class="{
                    active: tab.id == props.selectedId,
                }"
            >
                {{ tab.label }}
            </a>
            <a
                v-else
                style="cursor: pointer"
                class="nav-link"
                aria-current="page"
                @click="emit('onSelect', tab.id)"
                :class="{
                    active: tab.id == props.selectedId,
                }"
            >
                {{ tab.label }}
            </a>
        </li>
    </ul>
</template>