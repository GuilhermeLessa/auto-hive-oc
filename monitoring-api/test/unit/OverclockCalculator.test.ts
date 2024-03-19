import OverclockCalculator from "../../src/domain/entity/core/OverclockCalculator";
import Temperature from "../../src/domain/entity/core/Temperature";

test("Test overclock when -10 temperature difference", async () => {
    const temp = new Temperature(50, 60);
    const overclock = OverclockCalculator.calculate(1000, temp);
    expect(overclock).toBe(1100);
});

test("Test overclock when -9 temperature difference", async () => {
    const temp = new Temperature(50, 59);
    const overclock = OverclockCalculator.calculate(1000, temp);
    expect(overclock).toBe(1100);
});

test("Test overclock when -8 temperature difference", async () => {
    const temp = new Temperature(50, 58);
    const overclock = OverclockCalculator.calculate(1000, temp);
    expect(overclock).toBe(1100);
});

test("Test overclock when -7 temperature difference", async () => {
    const temp = new Temperature(50, 57);
    const overclock = OverclockCalculator.calculate(1000, temp);
    expect(overclock).toBe(1080);
});

test("Test overclock when -6 temperature difference", async () => {
    const temp = new Temperature(50, 56);
    const overclock = OverclockCalculator.calculate(1000, temp);
    expect(overclock).toBe(1080);
});

test("Test overclock when -5 temperature difference", async () => {
    const temp = new Temperature(50, 55);
    const overclock = OverclockCalculator.calculate(1000, temp);
    expect(overclock).toBe(1050);
});

test("Test overclock when -4 temperature difference", async () => {
    const temp = new Temperature(50, 54);
    const overclock = OverclockCalculator.calculate(1000, temp);
    expect(overclock).toBe(1050);
});

test("Test overclock when -3 temperature difference", async () => {
    const temp = new Temperature(50, 53);
    const overclock = OverclockCalculator.calculate(1000, temp);
    expect(overclock).toBe(1020);
});

test("Test overclock when -2 temperature difference", async () => {
    const temp = new Temperature(50, 52);
    const overclock = OverclockCalculator.calculate(1000, temp);
    expect(overclock).toBe(1020);
});

test("Test overclock when -1 temperature difference", async () => {
    const temp = new Temperature(50, 51);
    const overclock = OverclockCalculator.calculate(1000, temp);
    expect(overclock).toBe(1010);
});

test("Test overclock when NO temperature difference", async () => {
    const temp = new Temperature(50, 50);
    const overclock = OverclockCalculator.calculate(1000, temp);
    expect(overclock).toBe(1000);
});

test("Test overclock when +1 temperature difference", async () => {
    const temp = new Temperature(51, 50);
    const overclock = OverclockCalculator.calculate(1000, temp);
    expect(overclock).toBe(990);
});

test("Test overclock when +2 temperature difference", async () => {
    const temp = new Temperature(52, 50);
    const overclock = OverclockCalculator.calculate(1000, temp);
    expect(overclock).toBe(980);
});

test("Test overclock when +3 temperature difference", async () => {
    const temp = new Temperature(53, 50);
    const overclock = OverclockCalculator.calculate(1000, temp);
    expect(overclock).toBe(980);
});

test("Test overclock when +4 temperature difference", async () => {
    const temp = new Temperature(54, 50);
    const overclock = OverclockCalculator.calculate(1000, temp);
    expect(overclock).toBe(950);
});

test("Test overclock when +5 temperature difference", async () => {
    const temp = new Temperature(55, 50);
    const overclock = OverclockCalculator.calculate(1000, temp);
    expect(overclock).toBe(950);
});

test("Test overclock when +6 temperature difference", async () => {
    const temp = new Temperature(56, 50);
    const overclock = OverclockCalculator.calculate(1000, temp);
    expect(overclock).toBe(920);
});

test("Test overclock when +7 temperature difference", async () => {
    const temp = new Temperature(57, 50);
    const overclock = OverclockCalculator.calculate(1000, temp);
    expect(overclock).toBe(920);
});

test("Test overclock when +8 temperature difference", async () => {
    const temp = new Temperature(58, 50);
    const overclock = OverclockCalculator.calculate(1000, temp);
    expect(overclock).toBe(900);
});

test("Test overclock when +9 temperature difference", async () => {
    const temp = new Temperature(59, 50);
    const overclock = OverclockCalculator.calculate(1000, temp);
    expect(overclock).toBe(900);
});

test("Test overclock when +10 temperature difference", async () => {
    const temp = new Temperature(60, 50);
    const overclock = OverclockCalculator.calculate(1000, temp);
    expect(overclock).toBe(900);
});