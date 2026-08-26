import { beforeEach, describe, expect, it } from "vitest";
import { currentLocale, initLocale, localeCode, setLocale, t } from "./locale";

describe("locale", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = "en";
  });

  it("defaults to English and restores a stored Spanish choice", () => {
    initLocale();
    expect(currentLocale()).toBe("en");
    expect(localeCode()).toBe("en-US");

    setLocale("es");
    expect(currentLocale()).toBe("es");
    expect(localeCode()).toBe("es-US");
    expect(localStorage.getItem("bench.locale")).toBe("es");
    expect(t("Home")).toBe("Inicio");

    document.documentElement.lang = "en";
    initLocale();
    expect(currentLocale()).toBe("es");
  });

  it("translates later UI updates without restoring stale content", async () => {
    initLocale();
    setLocale("es");
    const label = document.createElement("span");
    label.textContent = "Open";
    document.body.append(label);
    await Promise.resolve();
    expect(label).toHaveTextContent("Abrir");

    label.textContent = "Save";
    await Promise.resolve();
    expect(label).toHaveTextContent("Guardar");

    setLocale("en");
    expect(label).toHaveTextContent("Save");
  });
});
