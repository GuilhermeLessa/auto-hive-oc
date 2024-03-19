<script setup lang="ts">
import { useRouter } from "vue-router";
import { onBeforeMount, inject, ref } from "vue";
import { UnauthorizedHttpError } from "../../application/http/HttpClient";
import Toaster from "../components/Toaster/Toaster.vue";

const router = useRouter();
const toaster: Toaster = ref();
const token = ref("");
let checkLogin: CheckLogin;
let login: Login;

onBeforeMount(() => {
    checkLogin = inject("checkLogin");
    const loginDataOrError = checkLogin.execute();
    if (loginDataOrError.isRight()) {
        router.push("/dashboard");
        return;
    }
    login = inject("login");
});

async function onClickLogin() {
    const input = { token: token.value.trim() };
    const loginOrError = await login.execute(input);
    if (loginOrError.isRight()) {
        router.push("/dashboard");
    }
    const error = loginOrError.value;
    toaster.value.error(error.error);
}
</script>

<template>
    <div data-bs-theme="dark">
        <div class="container mt-5">
            <h1>Auto OC</h1>
            <h6 class="mb-5">Increase your gains, protect your workers</h6>
            <form>
                <div class="form-group mt-4">
                    <div class="form-group">
                        <textarea
                            class="form-control"
                            rows="3"
                            placeholder="Hive OS API Token"
                            v-model="token"
                        ></textarea>
                    </div>
                </div>
                <div class="d-flex justify-content-end mb-5">
                    <button
                        type="button"
                        class="btn btn-light mt-4"
                        :disabled="!token"
                        @click="onClickLogin()"
                    >
                        Login
                    </button>
                </div>
                <p style="color: #c1c1c1; font-size: 14px; text-align: justify">
                    That's an unofficial beta app to auto controll overclocks by
                    temperature on Hive OS. You can generate and revoke your
                    access token anytime on Hive OS > Account > Sessions >
                    Personal Tokens or try
                    <a
                        href="https://id.hiveon.com/auth/realms/id/account/sessions"
                        target="_blank"
                        class="link-light"
                        >clicking here</a
                    >. You can also
                    <a href="mailto:support@autohiveoc.com" class="link-light"
                        >contact-us</a
                    >.
                </p>
            </form>
        </div>
        <Toaster ref="toaster"></Toaster>
    </div>
</template>

<style scoped>
.container {
    max-width: 480px;
    color: white;
    background-color: #363d45;
    padding: 30px;
    border: 1px solid gray;
    border-radius: 4px;
}
p {
    margin: 0;
    padding: 0;
}
</style>
