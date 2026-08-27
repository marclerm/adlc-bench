/**
 * The primary navigation, identical in all four documents. Each app is its own page, so these
 * are plain anchors rather than router links.
 */
import { useState } from "react";
import {
  BenchMark,
  IconCrm,
  IconGroove,
  IconHome,
  IconMoon,
  IconRolodex,
  IconSpace,
  IconSun,
} from "./AppIcons";
import { currentTheme, toggleTheme, type Theme } from "./theme";
import { currentLocale, setLocale, t, type Locale } from "./locale";
import "./nav.css";

type AppKey = "home" | "crm" | "space" | "rolodex" | "groove";

/** Colour marks the active app and nothing else: one amber chip, wherever you are. An app is
    told apart by its glyph, which is what still works once there are more of them than there
    are brand colours. */
const APPS: {
  key: AppKey;
  href: string;
  label: string;
  Icon: (p: { size?: number }) => React.ReactElement;
}[] = [
  { key: "home", href: "/", label: "Home", Icon: IconHome },
  { key: "crm", href: "/crm/", label: "CRM", Icon: IconCrm },
  { key: "space", href: "/space/", label: "Space", Icon: IconSpace },
  { key: "rolodex", href: "/rolodex/", label: "Rolodex", Icon: IconRolodex },
  { key: "groove", href: "/groove/", label: "Groove", Icon: IconGroove },
];

export default function BenchNav({ active }: { active: AppKey }) {
  const [theme, setTheme] = useState<Theme>(currentTheme);
  const [locale, setLocaleState] = useState<Locale>(currentLocale);
  const changeLocale = (next: Locale) => {
    setLocale(next);
    setLocaleState(next);
  };
  return (
    <header className="bench-nav">
      <span className="bench-nav-brand">
        <BenchMark size={21} />
        Bench
      </span>
      <nav className="bench-nav-links" aria-label={t("Primary")}>
        {APPS.map(({ key, href, label, Icon }) => (
          <a
            key={key}
            className="bench-nav-link"
            href={href}
            aria-current={key === active ? "page" : undefined}
          >
            <Icon size={16} />
            {label === "Home" ? t("Home") : label}
          </a>
        ))}
      </nav>
      <button
        type="button"
        className="bench-nav-theme"
        onClick={() => setTheme(toggleTheme())}
        aria-label={
          theme === "dark" ? t("Switch to light") : t("Switch to dark")
        }
        title={theme === "dark" ? t("Switch to light") : t("Switch to dark")}
      >
        {theme === "dark" ? <IconSun size={16} /> : <IconMoon size={16} />}
      </button>
      <label className="bench-nav-language">
        <span>{t("Language")}</span>
        <select
          value={locale}
          onChange={(event) => changeLocale(event.target.value as Locale)}
        >
          <option value="en">{t("English")}</option>
          <option value="es">{t("Spanish")}</option>
        </select>
      </label>
    </header>
  );
}
