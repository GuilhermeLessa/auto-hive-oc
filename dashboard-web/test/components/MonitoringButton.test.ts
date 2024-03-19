import { mount } from '@vue/test-utils';
import { test, vitest, beforeAll, expect } from 'vitest';
import { createTestingPinia } from "@pinia/testing";
import { useWorkerStore } from "../../src/stores/workerStore";
import { setActivePinia, createPinia } from 'pinia'
import { Toast, Modal } from "bootstrap";
import { left, right } from '../../src/domain/shared/Either';
import MonitoringButton from "../../src/components/components/MonitoringButton.vue";
import StartMonitoring from '../../src/application/usecase/StartMonitoring';
import StopMonitoring from '../../src/application/usecase/StopMonitoring';
import ApplicationError from '../../src/application/error/ApplicationError';

const bootstrap = { Toast, Modal };
const url = import.meta.env.VITE_DASHBOARD_API_URL;
const token = import.meta.env.VITE_TEST_TOKEN;
const accountId = import.meta.env.VITE_TEST_ACCOUNT_ID;

beforeAll(() => {
    setActivePinia(createPinia());
    expect(bootstrap).toBeDefined();
    expect(url).toBeDefined();
    expect(token).toBeDefined();
    expect(accountId).toBeDefined();
});

test('Test start/stop monitoring getting success when clicking on button', async () => {

    const stores = createTestingPinia({
        createSpy: vitest.fn,
        stubActions: false,
    });

    const dashboardApi: any = {
        postWorker: () => Promise.resolve(right("done"))
    };
    const startMonitoring = new StartMonitoring(dashboardApi);
    const stopMonitoring = new StopMonitoring(dashboardApi);

    const wrapper = mount(MonitoringButton, {
        props: { farmId: 1, workerId: 1 },
        global: {
            plugins: [
                stores,
            ],
            provide: {
                bootstrap,
                startMonitoring,
                stopMonitoring
            }
        },
    });

    const workerStore = useWorkerStore();
    expect(workerStore.isMonitoring()).toBeFalsy();

    await wrapper.get("#start-button").trigger("click");
    expect(workerStore.isMonitoring()).toBeTruthy();

    await wrapper.get("#stop-button").trigger("click");
    await wrapper.get("#stop-confirmation").get("#cancel-button").trigger("click");
    expect(workerStore.isMonitoring()).toBeTruthy();

    await wrapper.get("#stop-button").trigger("click");
    await wrapper.get("#stop-confirmation").get("#stop-button").trigger("click");
    expect(workerStore.isMonitoring()).toBeFalsy();

    expect(workerStore.isLoading()).toBeFalsy();
});

test('Test start/stop monitoring getting error when clicking on button', async () => {

    const stores = createTestingPinia({
        createSpy: vitest.fn,
        stubActions: false,
    });

    const dashboardApi: any = {
        postWorker: () => Promise.resolve(left(new ApplicationError("Error message...")))
    };
    const startMonitoring = new StartMonitoring(dashboardApi);
    const stopMonitoring = new StopMonitoring(dashboardApi);

    const wrapper = mount(MonitoringButton, {
        props: { farmId: 1, workerId: 1 },
        global: {
            plugins: [
                stores,
            ],
            provide: {
                bootstrap,
                startMonitoring,
                stopMonitoring
            }
        },
    });

    const workerStore = useWorkerStore();
    expect(workerStore.isMonitoring()).toBeFalsy();

    await wrapper.get("#start-button").trigger("click");
    expect(workerStore.isMonitoring()).toBeFalsy();
    expect(wrapper.get(".toast-error .toast-body").text()).toBe("Error message...");

    expect(workerStore.isLoading()).toBeFalsy();
});