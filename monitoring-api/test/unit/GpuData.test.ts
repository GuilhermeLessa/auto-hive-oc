import GpuData, { CreateGpuData, GpuDataErrors } from "../../src/domain/entity/data/GpuData";

test("Test gpu validation success", async () => {
    const createData: CreateGpuData = {
        accountId: 1,
        farmId: 1,
        workerId: 1,
        bus: 0,
        brand: "nvidia",
        isMonitoringCore: true,
        maximumCoreTemperature: 60,
        initialCoreClock: 1100,
        maximumCoreClock: 1800,
        memorieTemperature: 80,
        isMonitoringMemorie: true,
        maximumMemorieTemperature: 90,
        initialMemorieClock: 1000,
        maximumMemorieClock: 2000,
        createdAt: new Date()
    };
    const gpuData: GpuData | GpuDataErrors = GpuData.create(createData);
    expect(gpuData instanceof GpuData).toBeTruthy();
});

test("Test gpu validation error when undefined data", async () => {
    const createData: any = {
        accountId: 0,
        farmId: 0,
        workerId: 0,
        bus: 0,
        //brand: "nvidia",
        isMonitoringCore: true,
        //maximumCoreTemperature: 60,
        //initialCoreClock: 1100,
        //maximumCoreClock: 1800,
        //memorieTemperature: 80,
        isMonitoringMemorie: true,
        //maximumMemorieTemperature: 90,
        //initialMemorieClock: 1100,
        //maximumMemorieClock: 1000
    };
    const gpuData: GpuData | GpuDataErrors = GpuData.create(createData);
    expect(GpuData.containErrors(gpuData)).toBeTruthy();
    const errors = gpuData as GpuDataErrors;
    expect(errors.find(e => e.message == "Invalid Hive Account ID")).toBeDefined();
    expect(errors.find(e => e.message == "Invalid Farm ID")).toBeDefined();
    expect(errors.find(e => e.message == "Invalid Worker ID")).toBeDefined();
    expect(errors.find(e => e.message == "Invalid GPU Brand")).toBeDefined();
    expect(errors.find(e => e.message == "Invalid Core Temperature Limit")).toBeDefined();
    expect(errors.find(e => e.message == "Invalid Core Starts")).toBeDefined();
    expect(errors.find(e => e.message == "Invalid Core Limit")).toBeDefined();
    expect(errors.find(e => e.message == "Invalid Memory Temperature Limit")).toBeDefined();
    expect(errors.find(e => e.message == "Invalid Memory Starts")).toBeDefined();
    expect(errors.find(e => e.message == "Invalid Memory Limit")).toBeDefined();
    expect(errors.find(e => e.message == "Invalid Memory monitoring due no temperature provided")).toBeDefined();
});

test("Test gpu validation error when invalid data", async () => {
    const createData: any = {
        accountId: 0,
        farmId: 0,
        workerId: 0,
        bus: 0,
        brand: "amd",
        isMonitoringCore: true,
        maximumCoreTemperature: 60,
        initialCoreClock: 499,
        maximumCoreClock: 498,
        memorieTemperature: 80,
        isMonitoringMemorie: true,
        maximumMemorieTemperature: 90,
        initialMemorieClock: 1100,
        maximumMemorieClock: 1000
    };
    const gpuData: GpuData | GpuDataErrors = GpuData.create(createData);
    expect(GpuData.containErrors(gpuData)).toBeTruthy();
    const errors = gpuData as GpuDataErrors;
    expect(errors.find(e => e.message == "Invalid Hive Account ID")).toBeDefined();
    expect(errors.find(e => e.message == "Invalid Farm ID")).toBeDefined();
    expect(errors.find(e => e.message == "Invalid Worker ID")).toBeDefined();
    expect(errors.find(e => e.message == "Invalid GPU Brand")).toBeDefined();
    expect(errors.find(e => e.message == "Invalid Core Starts lower than 500")).toBeDefined();
    expect(errors.find(e => e.message == "Invalid Core Starts greater than Core Limit")).toBeDefined();
    expect(errors.find(e => e.message == "Invalid Memory Starts greater than Memory Limit")).toBeDefined();
});