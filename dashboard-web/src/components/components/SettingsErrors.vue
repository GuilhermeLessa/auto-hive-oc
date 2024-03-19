<script>
export default {
    props: {
        errors: {
            required: true,
            default: [],
        },
    },
    data() {
        return {
            show: false,
            errorGroup: [],
            selectedTab: null,
            componentKey: 1,
        };
    },
    mounted() {
        this.mountErrors();
    },
    methods: {
        mountErrors() {
            if (!this.errors.length) {
                this.show = false;
                return;
            }
            const errorGroup = this.errors.map((errorGroup) => ({
                bus: errorGroup[0].bus,
                title: `GPU BUS ${errorGroup[0].bus}`,
                errors: errorGroup,
            }));
            this.selectedTab = errorGroup[0].bus;
            this.errorGroup = errorGroup;
            this.show = true;
        },
    },
    watch: {
        async errors(newValue, oldValue) {
            if (newValue == oldValue) {
                return;
            }
            this.mountErrors();
            this.componentKey++;
        },
    },
    computed: {
        selectedTabErrors() {
            const group = this.errorGroup.find(
                (group) => group.bus == this.selectedTab
            );
            if (!group) {
                return [];
            }
            return group.errors;
        },
    },
};
</script>

<template>
    <div>
        <div
            :key="componentKey"
            class="offcanvas offcanvas-top"
            :class="{
                show,
            }"
            tabindex="-1"
            id="settings-errors-canvas"
            aria-labelledby="settings-errors-title"
            data-bs-backdrop="false"
            data-bs-scroll="true"
        >
            <div class="offcanvas-header">
                <div class="offcanvas-title" id="settings-errors-title">
                    <h6>
                        <i class="bi bi-exclamation-octagon-fill"></i>
                        &nbsp;Settings Errors
                    </h6>
                    <p>
                        <small>
                            Please fix all errors and try save again
                        </small>
                    </p>
                </div>

                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                    @click="show = false"
                ></button>
            </div>
            <div class="offcanvas-body pt-0 mt-0">
                <ul class="nav nav-tabs">
                    <li
                        class="nav-item"
                        v-for="(group, index) in errorGroup"
                        :key="index"
                    >
                        <a
                            class="nav-link"
                            style="cursor: pointer"
                            aria-current="page"
                            @click="selectedTab = group.bus"
                            :class="{
                                active: selectedTab == group.bus,
                            }"
                        >
                            {{ group.title }}
                        </a>
                    </li>
                </ul>
                <div class="p-2">
                    <p v-for="(error, index) in selectedTabErrors" :key="index">
                        {{ error.message }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>