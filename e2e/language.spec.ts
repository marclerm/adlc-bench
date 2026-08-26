import { test, expect } from "./fixtures";

const APPS = ["/", "/crm/", "/space/", "/rolodex/", "/groove/"];

test("Spanish follows one switch across every app and reload", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("combobox", { name: "Language" }).selectOption("es");
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page.getByRole("link", { name: "Inicio" })).toBeVisible();

  for (const path of APPS) {
    await page.goto(path);
    await expect(page.locator("html"), `${path} locale`).toHaveAttribute(
      "lang",
      "es",
    );
    await expect(page.getByRole("combobox", { name: "Idioma" })).toHaveValue(
      "es",
    );
  }

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
});

test("switching twice restores English without changing data", async ({
  page,
}) => {
  await page.goto("/crm/organizations");
  const organization = page.getByText("Bluepeak Software", { exact: true });
  await expect(organization).toBeVisible();

  await page.getByRole("combobox", { name: "Language" }).selectOption("es");
  await expect(
    page.getByRole("heading", { name: "Organizaciones" }),
  ).toBeVisible();
  await expect(organization).toBeVisible();

  await page.getByRole("combobox", { name: "Idioma" }).selectOption("en");
  await expect(
    page.getByRole("heading", { name: "Organizations" }),
  ).toBeVisible();
  await expect(organization).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("Spanish translates product chrome but keeps Groove controls", async ({
  page,
}) => {
  await page.goto("/groove/");
  await page.getByRole("combobox", { name: "Language" }).selectOption("es");
  await expect(page.getByRole("link", { name: "Inicio" })).toBeVisible();
  await expect(page.getByRole("region", { name: "RHYTHM" })).toBeVisible();
  await expect(page.getByText("MASTER FILTER", { exact: true })).toBeVisible();
});

test("Spanish screens are complete and fit the viewport", async ({
  page,
}, testInfo) => {
  const screens = [
    { path: "/", marker: "Todo lo que sabes, en un solo lugar" },
    { path: "/crm/", marker: "El estado de tus ventas de un vistazo" },
    { path: "/space/", marker: "Espacio personal" },
    { path: "/rolodex/", marker: "Cómo vas" },
    { path: "/groove/", marker: "GROOVEBOX" },
  ];

  await page.goto("/");
  await page.getByRole("combobox", { name: "Language" }).selectOption("es");

  for (const screen of screens) {
    await page.goto(screen.path);
    await expect(
      page.getByText(screen.marker, { exact: true }).first(),
    ).toBeVisible();
    const nav = page.locator(".bench-nav");
    await expect(nav).toBeVisible();
    expect(
      await nav.evaluate(
        (element) => element.scrollWidth <= element.clientWidth,
      ),
      `${screen.path} navigation overflowed`,
    ).toBe(true);
    await testInfo.attach(
      `spanish-${screen.path.replaceAll("/", "") || "home"}`,
      {
        body: await page.screenshot({ fullPage: true }),
        contentType: "image/png",
      },
    );
  }
});
