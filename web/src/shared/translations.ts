export const es = {
  Primary: "Principal",
  Home: "Inicio",
  "Switch to light": "Cambiar a claro",
  "Switch to dark": "Cambiar a oscuro",
  Language: "Idioma",
  English: "English",
  Spanish: "Español",
} as const;

export type EnglishMessage = keyof typeof es;
