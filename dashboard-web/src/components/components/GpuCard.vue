<script>
export default {
    props: {
        gpu: {
            required: true,
        },
        editing: {
            default: false,
            required: true,
        },
    },
    methods: {
        onlyNumbers(input) {
            const value = input.replace(/[^0-9]+/g, "");
            if (value) {
                return parseInt(value);
            }
            return "";
        },
    },
};
</script>

<template>
    <div class="card text-bg-dark">
        <div class="card-header">
            <h4 style="float: left; margin-bottom: 0; margin-top: 8px">
                <i
                    v-if="gpu.brand == 'nvidia'"
                    class="bi bi-nvidia"
                    style="color: #76b900"
                ></i>
                <i
                    v-else-if="gpu.brand == 'amd'"
                    class="bi bi-amd"
                    style="color: #d5232f"
                ></i>
                <i v-else class="bi bi-cpu-fill"></i>
                &nbsp; {{ gpu.shortName }}
            </h4>
            <small class="text-muted text-end" style="float: right">
                GPU BUS<br />
                {{ gpu.bus }}
            </small>
        </div>
        <div v-if="gpu.brand == 'nvidia'" class="card-body">
            <div class="row align-items-center">
                <div class="col-6">
                    <h4 class="card-title mb-0">Core</h4>
                </div>
                <div class="col-6">
                    <div
                        class="d-flex justify-content-end"
                        style="align-items: center !important"
                    >
                        <button
                            v-if="gpu.isMonitoringCore"
                            :disabled="!editing"
                            @click="gpu.isMonitoringCore = false"
                            type="button"
                            class="btn btn-light btn-sm"
                        >
                            Auto OC ON &nbsp;<i class="bi bi-toggle-on"></i>
                        </button>
                        <button
                            v-else
                            :disabled="!editing"
                            @click="gpu.isMonitoringCore = true"
                            type="button"
                            class="btn btn-outline-light btn-sm"
                        >
                            Auto OC OFF &nbsp;<i class="bi bi-toggle-off"></i>
                        </button>
                    </div>
                </div>
            </div>
            <table class="table table-sm table-borderless table-dark mb-0">
                <thead>
                    <tr>
                        <th>TEMP</th>
                        <th class="text-muted fw-light">LIMIT</th>
                        <th class="text-end">CORE</th>
                        <th class="text-muted fw-light text-end">STARTS</th>
                        <th class="text-muted fw-light text-end">LIMIT</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{ gpu.coreTemperature }}&deg;</td>
                        <td class="text-muted fw-light">
                            <div style="width: 30px; height: 25px">
                                <input
                                    v-if="editing"
                                    maxlength="2"
                                    type="text"
                                    class="form-control setting-input"
                                    style="
                                        padding: 0;
                                        margin: 0;
                                        border-radius: 2px;
                                    "
                                    :value="gpu.maximumCoreTemperature"
                                    @input="
                                        gpu.maximumCoreTemperature =
                                            $event.target.value = onlyNumbers(
                                                $event.target.value
                                            )
                                    "
                                />
                                <template v-else>
                                    {{ gpu.maximumCoreTemperature }}&deg;
                                </template>
                            </div>
                        </td>
                        <td class="text-end">
                            {{ gpu.coreClock }}
                        </td>
                        <td class="text-muted fw-light text-end">
                            <div
                                style="width: 45px; height: 25px; float: right"
                            >
                                <input
                                    v-if="editing"
                                    maxlength="4"
                                    type="text"
                                    class="form-control setting-input"
                                    style="
                                        padding: 0;
                                        margin: 0;
                                        border-radius: 2px;
                                    "
                                    :value="gpu.initialCoreClock"
                                    @input="
                                        gpu.initialCoreClock =
                                            $event.target.value = onlyNumbers(
                                                $event.target.value
                                            )
                                    "
                                />
                                <template v-else>
                                    {{ gpu.initialCoreClock }}
                                </template>
                            </div>
                        </td>
                        <td class="text-muted fw-light text-end">
                            <div
                                style="width: 45px; height: 25px; float: right"
                            >
                                <input
                                    v-if="editing"
                                    maxlength="4"
                                    type="text"
                                    class="form-control setting-input"
                                    style="
                                        padding: 0;
                                        margin: 0;
                                        border-radius: 2px;
                                    "
                                    :value="gpu.maximumCoreClock"
                                    @input="
                                        gpu.maximumCoreClock =
                                            $event.target.value = onlyNumbers(
                                                $event.target.value
                                            )
                                    "
                                />
                                <template v-else>
                                    {{ gpu.maximumCoreClock }}
                                </template>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <hr />
            <template v-if="gpu.memorieTemperature">
                <div class="row align-items-center">
                    <div class="col-6">
                        <h4 class="card-title mb-0">Memory</h4>
                    </div>
                    <div class="col-6">
                        <div
                            class="d-flex justify-content-end"
                            style="align-items: center !important"
                        >
                            <button
                                v-if="gpu.isMonitoringMemorie"
                                :disabled="!editing"
                                @click="gpu.isMonitoringMemorie = false"
                                type="button"
                                class="btn btn-light btn-sm"
                            >
                                Auto OC ON &nbsp;<i class="bi bi-toggle-on"></i>
                            </button>
                            <button
                                v-else
                                :disabled="!editing"
                                @click="gpu.isMonitoringMemorie = true"
                                type="button"
                                class="btn btn-outline-light btn-sm"
                            >
                                Auto OC OFF &nbsp;<i
                                    class="bi bi-toggle-off"
                                ></i>
                            </button>
                        </div>
                    </div>
                </div>
                <table class="table table-sm table-borderless table-dark mb-0">
                    <thead>
                        <tr>
                            <th>TEMP</th>
                            <th class="text-muted fw-light">LIMIT</th>
                            <th class="text-end">MEM</th>
                            <th class="text-muted fw-light text-end">STARTS</th>
                            <th class="text-muted fw-light text-end">LIMIT</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ gpu.memorieTemperature }}&deg;</td>
                            <td class="text-muted fw-light">
                                <div style="width: 30px; height: 25px">
                                    <input
                                        v-if="editing"
                                        maxlength="2"
                                        type="text"
                                        class="form-control setting-input"
                                        style="
                                            padding: 0;
                                            margin: 0;
                                            border-radius: 2px;
                                        "
                                        :value="gpu.maximumMemorieTemperature"
                                        @input="
                                            gpu.maximumMemorieTemperature =
                                                $event.target.value =
                                                    onlyNumbers(
                                                        $event.target.value
                                                    )
                                        "
                                    />
                                    <template v-else>
                                        {{ gpu.maximumMemorieTemperature }}&deg;
                                    </template>
                                </div>
                            </td>
                            <td class="text-end">
                                {{ gpu.memorieClock }}
                            </td>
                            <td class="text-muted fw-light text-end">
                                <div
                                    style="
                                        width: 45px;
                                        height: 25px;
                                        float: right;
                                    "
                                >
                                    <input
                                        v-if="editing"
                                        maxlength="4"
                                        type="text"
                                        class="form-control setting-input"
                                        style="
                                            padding: 0;
                                            margin: 0;
                                            border-radius: 2px;
                                        "
                                        :value="gpu.initialMemorieClock"
                                        @input="
                                            gpu.initialMemorieClock =
                                                $event.target.value =
                                                    onlyNumbers(
                                                        $event.target.value
                                                    )
                                        "
                                    />
                                    <template v-else>
                                        {{ gpu.initialMemorieClock }}
                                    </template>
                                </div>
                            </td>
                            <td class="text-muted fw-light text-end">
                                <div
                                    style="
                                        width: 45px;
                                        height: 25px;
                                        float: right;
                                    "
                                >
                                    <input
                                        v-if="editing"
                                        maxlength="4"
                                        type="text"
                                        class="form-control setting-input"
                                        style="
                                            padding: 0;
                                            margin: 0;
                                            border-radius: 2px;
                                        "
                                        :value="gpu.maximumMemorieClock"
                                        @input="
                                            gpu.maximumMemorieClock =
                                                $event.target.value =
                                                    onlyNumbers(
                                                        $event.target.value
                                                    )
                                        "
                                    />
                                    <template v-else>
                                        {{ gpu.maximumMemorieClock }}
                                    </template>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </template>
            <div v-else>
                <h4 class="card-title">Memory</h4>
                <p
                    class="lh-sm fw-light text-muted mb-0"
                    style="text-align: justify; font-size: 12px"
                >
                    <i class="bi bi-info-circle-fill"></i>&nbsp; No memory
                    temperature provided in this graphic card model, you can
                    still set the memory clock on HiveOS. The core clock can be
                    controled above though.
                </p>
            </div>
        </div>
        <div v-else-if="gpu.brand == 'amd'" class="card-body">
            <h4 class="card-title text-center">
                <i class="bi bi-emoji-frown-fill"></i>&nbsp;Sorry
            </h4>
            <p
                class="lh-sm fw-light text-muted"
                style="text-align: justify; font-size: 12px"
            >
                Auto OC beta does not support AMD graphic cards by now. We hope
                to admit AMD as soon as possible. You can still controll this
                graphic card on HiveOS.
            </p>
            <p
                class="lh-sm fw-light text-muted mb-0"
                style="text-align: justify; font-size: 12px"
            >
                Help us introducing Auto OC to your miners friends. &nbsp;<i
                    class="bi bi-heart"
                ></i>
            </p>
        </div>
        <div v-else class="card-body">
            <h4 class="card-title text-center">
                <i class="bi bi-emoji-frown-fill"></i>&nbsp;Sorry
            </h4>
            <p
                class="lh-sm fw-light text-muted"
                style="text-align: justify; font-size: 12px"
            >
                Auto OC beta does not support this graphic card model by now. We
                hope to admit it as soon as possible. You can still controll
                this graphic card on HiveOS.
            </p>
            <p
                class="lh-sm fw-light text-muted mb-0"
                style="text-align: justify; font-size: 12px"
            >
                Help us introducing Auto OC to your miners friends. &nbsp;<i
                    class="bi bi-heart"
                ></i>
            </p>
        </div>
    </div>
</template>

<style scoped>
.setting-input {
    background-color: gray;
    border-color: gray;
    color: white;
}
</style>