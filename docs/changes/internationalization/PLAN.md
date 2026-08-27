# Plan: English and Spanish UI

## Scope and decisions

- Add English and Spanish to the launcher and all four products. The selector sits in the shared
  Bench navigation beside the theme toggle, so it is available on every document.
- Store the selected locale in `localStorage`, initialize it before React renders, and set the
  document's `lang` attribute. The selection therefore survives reloads and navigation between the
  five independently rendered documents without a wrong-language first paint.
- Keep translation catalogs separate from components. Use stable, typed message keys and one
  shared translation hook rather than embedding English/Spanish pairs throughout the UI. This is a
  two-locale feature, so do not add an internationalization dependency or a general-purpose message
  loading system.
- Treat API and database values as canonical identifiers. Translate their display labels at the
  UI boundary only: CRM stages/statuses/activity types, Space block/property/view/filter labels,
  and Rolodex circles/statuses/interaction/date/connection/gift labels. Form submissions, filters,
  drag operations, and API bodies continue to use the current values.
- User-authored and seeded content is data, not interface copy. Names, notes, page titles, property
  names, select options, patch names, and similar persisted content remain unchanged.
- Keep product and technology names unchanged where they function as names: Bench, CRM, Space,
  Rolodex, Groove, SQLite, Web Audio, API, Vite, and npm commands.
- Apply the spec's Groove exception to instrument terminology normally presented in English:
  patch names, unit/model names, lane names, parameter labels, note names, BPM, sequencer step labels,
  and master/synth control labels remain unchanged. Translate the shared navigation and any ordinary
  explanatory or action text that is not instrument terminology.
- Format UI dates, relative dates, month names, and accessible date descriptions for the selected
  locale. Keep USD as the CRM's currency and keep stored ISO dates unchanged.

## Phase 1: Shared locale foundation

1. Add the locale type, storage key, startup initialization, and React provider/hook under
   `web/src/shared/`, beside the existing theme ownership.
2. Add separate English and Spanish catalogs with compile-time checks that both contain the same
   keys. Support the small amount of interpolation and plural selection the current UI needs.
3. Wrap every entry point with the shared provider before app code renders.
4. Add an accessible English/Spanish selector next to the theme toggle. Translate the Bench nav,
   selector name, and theme-toggle accessible text immediately when the locale changes.
5. Unit-test startup defaults, stored selection, document language, catalog parity, interpolation,
   plural branches, immediate switching, and persistence.

Phase success criteria:

- The launcher and each app read one shared locale choice.
- Changing language updates the current document without reload and the choice follows navigation
  and reloads.
- Missing English or Spanish messages fail typechecking/tests rather than appearing as raw keys.
- The selector and theme control have correct accessible names in both languages.

## Phase 2: Launcher, CRM, and Space

1. Move all launcher interface copy into the catalogs, including card descriptions, feature facts,
   action text, and footer explanations while preserving product/technology names.
2. Translate CRM navigation, page headings and descriptions, tables, charts, filters, dialogs,
   forms, empty/loading/error states, buttons, tooltips, and accessible names. Add presentation
   mappings for stages, statuses, and activity types without changing their stored values.
3. Make CRM date/month/compact-money presentation locale-aware while retaining USD and existing
   calculation behavior.
4. Translate Space navigation, editor menus, block-type labels and search terms, database views,
   property types, filter/sort controls, dialogs, empty/loading/error states, buttons, tooltips,
   drag instructions, and accessible names. Do not translate page titles, block contents, property
   names, or option values returned by the API.
5. Update focused component/unit tests for translated mappings, locale formatting, search aliases,
   and canonical values submitted after interacting with Spanish labels.

Phase success criteria:

- Every launcher, CRM, and Space screen and interactive state displays Spanish interface copy when
  selected, with no persisted or submitted value translated.
- Switching back to English restores the current copy immediately without changing data or route.
- Existing calculations, filters, sorts, forms, and drag behavior remain unchanged in both locales.

## Phase 3: Rolodex and Groove boundary

1. Translate Rolodex navigation, dashboard, people/circle/calendar/timeline screens, forms, import
   workflow, person details, relative dates, labels, dialogs, empty/loading/error states, toasts,
   tooltips, and accessible names.
2. Replace English-only display constants in Rolodex with locale-aware mappings while retaining
   canonical circle, status, interaction, important-date, connection, and gift values in state and
   API requests.
3. Localize Rolodex calendar and date formatting, including singular/plural relative-day phrases,
   without changing date arithmetic or stored values.
4. Audit Groove string by string against the stated exception. Keep patches and conventional
   instrument/control terminology in English; translate only shared Bench chrome and ordinary UI
   prose/actions found outside that exception. Record the boundary in the Groove implementation
   documentation so later work does not translate identifiers inconsistently.
5. Add focused tests for translated Rolodex labels/formatting and for canonical request payloads,
   plus a Groove test that protects the intentional untranslated control surface.

Phase success criteria:

- Every Rolodex workflow is operable and understandable in both languages, while API payloads and
  existing people data are byte-for-byte independent of the selected locale.
- Groove obeys the exception consistently rather than mixing translations across related controls.
- Switching languages does not reset in-memory Groove patch edits or transport state.

## Phase 4: End-to-end language matrix and visual validation

1. Make locale initialization deterministic in the Playwright fixtures. Adapt accessible selectors
   so behavior specs can run against the locale selected by the test instead of depending on a
   single hard-coded language.
2. Run the platform's behavior coverage in an English/Spanish project matrix, including launcher,
   shared navigation, CRM, Space, Rolodex, and Groove flows. Keep API-only assertions locale-neutral.
3. Add dedicated language-state tests that:
   - select Spanish once and verify the current app, navigation to every other app, and reload;
   - switch English to Spanish and back to English, verifying immediate restoration and no data loss;
   - start on a deep link and verify persistence in both directions;
   - verify `html[lang]`, selector state, translated accessible names, and unchanged canonical API
     data.
4. Extend the screenshot walkthrough to capture every existing screen/state in both languages and
   both themes at 1440x900. Name outputs by screen, locale, and theme and wait on stable page content
   rather than fixed timing where possible.
5. Validate each capture in Chromium: expected locale markers are visible, user data is unchanged,
   no English interface text remains on Spanish captures outside the documented exception, no text
   is clipped or overlaps neighboring controls, and no console/page errors occur. Use element bounds
   for selector/nav alignment and any crowded labels instead of visual estimates.
6. Record anything inherently visual or intentionally exempt from automation in
   `e2e/EXPLORATORY.md`.

Phase success criteria:

- The complete e2e behavior suite passes in English and Spanish.
- Switch-once and switch-twice tests pass across document navigation, reload, and deep links.
- The screenshot set covers the launcher and every product screen/state in both languages and is
  reviewed without truncation, overlap, mixed-language interface copy, or console errors.
- English-only Groove terminology and user data are visibly unchanged and explicitly validated.

## Phase 5: Documentation and final proof

1. Update `docs/PROJECT.md` with the shared locale ownership and storage/init behavior.
2. Update each affected app's `IMPLEMENTATION.md` with its presentation mappings, formatting rules,
   user-data boundary, and any app-specific translation traps.
3. Run `npm run format`, `npm run check`, and `npm run e2e` (the configured locale matrix), then
   perform the final Agent Browser walkthrough and screenshot review.
4. Commit only after all checks and browser validation pass. Do not push.

Phase success criteria:

- Documentation describes the implemented ownership and invariants accurately.
- Formatting, the full pre-commit check, both-language e2e coverage, and browser validation are all
  green.
- The branch is committed and the working tree contains no scratch artifacts.

## Overall success criteria

- A selector beside the theme toggle switches all five documents between English and Spanish,
  immediately and persistently.
- All interface copy, dynamic UI labels, accessibility text, and locale-sensitive display formatting
  are translated, subject only to the explicit Groove terminology exception and unchanged proper
  names/technical tokens.
- Translation text is separate from component code, both catalogs remain structurally complete,
  and untranslated keys cannot silently reach the UI.
- No database row, API identifier, user-authored value, seeded content value, or Groove patch/control
  identifier changes because of locale.
- The whole platform's e2e flows pass in both languages, including one-switch and two-switch cases.
- Screenshots demonstrate and validate the complete UI in both languages with no layout regressions
  or console errors.

## Confirmation

This plan interprets “entire application” as all interface and accessibility text, including
locale-sensitive date/number presentation, while excluding user data, proper product/technology
names, and the Groove terminology listed above. Implementation will not begin until this plan and
that interpretation are confirmed.
