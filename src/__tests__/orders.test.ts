import { describe, expect, it } from "vitest";
import { canTransition, isOrderStatus, nextStatuses } from "@/lib/orders";

describe("nextStatuses", () => {
    it("pending bisa ke preparing atau cancelled", () => {
        expect(nextStatuses("pending")).toEqual(["preparing", "cancelled"]);
    });
    it("status final tidak punya status berikutnya", () => {
        expect(nextStatuses("cancelled")).toEqual([]);
    });
});

describe("canTransition", () => {
    it("mengizinkan pending → preparing", () => {
        expect(canTransition("pending", "preparing")).toBe(true);
    });
    it("menolak ready → pending", () => {
        expect(canTransition("ready", "pending")).toBe(false);
    });
    it("menolak ready → cancelled", () => {
        expect(canTransition("ready", "cancelled")).toBe(false);
    });
});

describe("isOrderStatus", () => {
    it("menerima status valid", () => {
        expect(isOrderStatus("pending")).toBe(true);
    });
    it("menolak status tidak dikenal", () => {
        expect(isOrderStatus("shipped")).toBe(false);
    });
});