<script>
let refreshInterval;

export default {
    props: {
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            selected: 0,
            options: [
                { value: 0, label: "Off" },
                { value: 30000, label: "30 seconds" },
                { value: 120000, label: "1 minute" },
                { value: 180000, label: "3 minutes" },
                { value: 300000, label: "5 minutes" },
                { value: 600000, label: "10 minutes" },
                { value: 1800000, label: "30 minutes" },
                { value: 3600000, label: "1 hour" },
            ],
        };
    },
    unmounted() {
        clearInterval(refreshInterval);
    },
    watch: {
        selected(newValue, oldValue) {
            if (newValue == oldValue) {
                return;
            }
            clearInterval(refreshInterval);
            if (newValue == 0) {
                return;
            }
            refreshInterval = setInterval(() => {
                this.$emit("onRefresh");
            }, newValue);
        },
    },
};
</script>

<template>
    <div class="dropdown d-grid">
        <button
            class="btn btn-secondary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            :disabled="disabled"
        >
            <i class="bi bi-stopwatch-fill"></i>
            &nbsp; Auto refresh:
            {{ options.find((option) => option.value == selected).label }}
        </button>
        <ul class="dropdown-menu">
            <li>
                <button
                    class="dropdown-item"
                    type="button"
                    v-for="(option, index) in options"
                    :key="index"
                    @click="selected = option.value"
                >
                    {{ option.label }}
                </button>
            </li>
        </ul>
    </div>
</template>