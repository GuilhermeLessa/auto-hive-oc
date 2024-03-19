import "bootstrap/dist/css/bootstrap.min.css";

import { Toast, Modal } from "bootstrap";
const bootstrap = { Toast, Modal };

import "bootstrap-icons/font/bootstrap-icons.css";

import "./assets/styles/main.css";

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import type HttpClient from "./application/http/HttpClient";
import AxiosHttp from "./infra/http/AxiosHttp";

import type DashboardApiInterface from "./application/dashboard/DashboardApiInterface";
import DashboardApi from "./infra/dashboard/DashboardApi";

import type AccountLocalStorageInterface from "./application/localstorage/AccountLocalStorageInterface";
import AccountLocalStorage from "./infra/localstorage/AccountLocalStorage";

import Login from "./application/usecase/Login";
import CheckLogin from "./application/usecase/CheckLogin";
import Logout from "./application/usecase/Logout";
import StartMonitoring from "./application/usecase/StartMonitoring";
import StopMonitoring from "./application/usecase/StopMonitoring";
import ValidateSettings from "./application/usecase/ValidateSettings";
import SaveSettings from "./application/usecase/SaveSettings";

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.provide("bootstrap", bootstrap);

const dashboardApi: DashboardApiInterface = new DashboardApi(
    new AxiosHttp(import.meta.env.VITE_DASHBOARD_API_URL) as HttpClient
);
app.provide('dashboardApi', dashboardApi);

const accountLocalStorage: AccountLocalStorageInterface = new AccountLocalStorage(localStorage);
app.provide("accountLocalStorage", accountLocalStorage);

const login = new Login(dashboardApi, accountLocalStorage);
app.provide("login", login);

const checkLogin = new CheckLogin(accountLocalStorage);
app.provide("checkLogin", checkLogin);

const logout = new Logout(accountLocalStorage);
app.provide("logout", logout);

const startMonitoring = new StartMonitoring(dashboardApi);
app.provide("startMonitoring", startMonitoring);

const stopMonitoring = new StopMonitoring(dashboardApi);
app.provide("stopMonitoring", stopMonitoring);

const validateSettings = new ValidateSettings();
app.provide("validateSettings", validateSettings);

const saveSettings = new SaveSettings(dashboardApi);
app.provide("saveSettings", saveSettings);

app.mount('#app');
