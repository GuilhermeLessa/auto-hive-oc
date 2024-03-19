<script setup lang="ts">
import { inject, ref, onBeforeMount } from "vue";
import Modal from "./Modal.vue";
import Logout from "../../application/usecase/Logout";
import { useRouter } from "vue-router";

const props = defineProps({
    disabled: {
        type: Boolean,
        default: false,
    },
});

const router = useRouter();

const logoutConfirmation: Modal = ref();

let logout: Logout;

onBeforeMount(() => {
    logout = inject("logout");
});
</script>

<template>
    <span>
        <button
            type="button"
            class="btn btn-dark"
            @click="logoutConfirmation.show()"
            :disabled="props.disabled"
        >
            <i class="bi bi-box-arrow-right"></i>
            Log out
        </button>
        <Modal
            ref="logoutConfirmation"
            title="Log out"
        >
            <template #content>Are you sure you want to quit?</template>
            <template #footer>
                <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    class="btn btn-primary"
                    @click="
                        logoutConfirmation.destroy();
                        logout.execute();
                        router.push('/');
                    "
                >
                    Log out
                </button>
            </template>
        </Modal>
    </span>
</template>