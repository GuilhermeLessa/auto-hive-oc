import Temperature from "../../src/domain/entity/core/Temperature";

test("Test cold temperature", async () => {
    const temp = new Temperature(45, 50);
    expect(temp.getCurrent()).toBe(45);
    expect(temp.difference()).toBe(5);
    expect(temp.isCold()).toBeTruthy();
    expect(temp.isEqual()).toBeFalsy();
    expect(temp.isHot()).toBeFalsy();
    expect(temp.isTooHot()).toBeFalsy();
});

test("Test equal temperature", async () => {
    const temp = new Temperature(45, 45);
    expect(temp.getCurrent()).toBe(45);
    expect(temp.difference()).toBe(0);
    expect(temp.isCold()).toBeFalsy();
    expect(temp.isEqual()).toBeTruthy();
    expect(temp.isHot()).toBeFalsy();
    expect(temp.isTooHot()).toBeFalsy();
});

test("Test hot temperature", async () => {
    const temp = new Temperature(45, 44);
    expect(temp.getCurrent()).toBe(45);
    expect(temp.difference()).toBe(1);
    expect(temp.isCold()).toBeFalsy();
    expect(temp.isEqual()).toBeFalsy();
    expect(temp.isHot()).toBeTruthy();
    expect(temp.isTooHot()).toBeFalsy();
});

test("Test too hot temperature", async () => {
    const temp = new Temperature(45, 41);
    expect(temp.getCurrent()).toBe(45);
    expect(temp.difference()).toBe(4);
    expect(temp.isCold()).toBeFalsy();
    expect(temp.isEqual()).toBeFalsy();
    expect(temp.isHot()).toBeTruthy();
    expect(temp.isTooHot()).toBeTruthy();
});