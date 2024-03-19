import { ref } from 'vue'
import { defineStore } from 'pinia'

interface gpuData {
  bus: number,
  brand: string,
  isMonitoringCore: boolean,
  maximumCoreTemperature: number,
  initialCoreClock: number,
  maximumCoreClock: number,
  memorieTemperature: number,
  isMonitoringMemorie: boolean
  maximumMemorieTemperature: number,
  initialMemorieClock: number,
  maximumMemorieClock: number
}

export const useWorkerStore = defineStore('worker', () => {
  const _id = ref(null);
  const _name = ref("");
  const _online = ref(false);
  const _monitoring = ref(false);
  const _gpus = ref([] as Array<gpuData>);
  const _editing = ref(false);
  const _loading = ref(false);

  function set(id: number, name: string, monitoring: boolean, online: boolean, gpus: Array<gpuData>): void {
    _id.value = id;
    _name.value = name;
    _online.value = online;
    _monitoring.value = monitoring;
    _gpus.value = gpus;
  }

  function getId(): number | null {
    return _id.value;
  }

  function isOnline(): boolean {
    return _online.value == true;
  }

  function setMonitoring(value: boolean): void {
    _monitoring.value = value;
  }

  function isMonitoring(): boolean {
    return _monitoring.value == true;
  }

  function setGpus(value: Array<gpuData>): void {
    _gpus.value = value;
  }

  function getGpus(): Array<gpuData> {
    return _gpus.value;
  }

  function setLoading(value: boolean) {
    _loading.value = value;
  }

  function isLoading(): boolean {
    return _loading.value == true;
  }

  function setEditing(value: boolean) {
    _editing.value = value;
  }

  function isEditing(): boolean {
    return _editing.value == true;
  }

  return {
    set,
    getId,
    isOnline,
    setMonitoring,
    isMonitoring,
    setGpus,
    getGpus,
    setLoading,
    isLoading,
    setEditing,
    isEditing,
    _monitoring
  };

})
