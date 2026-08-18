## 1. Project scaffold
- [ ] 1.1 Initialize the Next.js App Router project in TypeScript strict mode
- [ ] 1.2 Configure ESLint and Prettier; wire lint and typecheck into the build so either fails it
- [ ] 1.3 Add Zod and the typed API-client boundary helpers
- [ ] 1.4 Set the JS budget check for the initial route (≤ 200KB gzipped) in CI

## 2. Design system
- [ ] 2.1 Add MUI and create the single `theme.ts`: palette, typography, spacing
- [ ] 2.2 Set the 44px minimum touch target as a component default for buttons and icon buttons
- [ ] 2.3 Apply Pertamina brand colours through the palette and verify 4.5:1 contrast for every text colour
- [ ] 2.4 Apply the theme provider at the root layout so every route inherits it

## 3. Internationalization
- [ ] 3.1 Create the Bahasa Indonesia message catalogue and the typed lookup helper
- [ ] 3.2 Set `lang="id"` on the root layout
- [ ] 3.3 Make a missing catalogue key fail loudly in development and report in production
- [ ] 3.4 Add DD/MM/YYYY date and IDR currency formatting helpers

## 4. Route skeleton
- [ ] 4.1 Add registration routes: `/daftar`, `/daftar/persetujuan`, `/daftar/identitas`, `/daftar/kendaraan`, `/daftar/dokumen`, `/daftar/ringkasan`, `/daftar/selesai`
- [ ] 4.2 Add vehicle routes: `/kendaraan`, `/kendaraan/[id]`, `/kendaraan/[id]/qr`
- [ ] 4.3 Add the root layout, error boundary, and not-found page, all using catalogue copy

## 5. Telemetry boundary (PII scrubbing)
- [ ] 5.1 Create the telemetry module as the only exported path to the analytics and error-reporting providers
- [ ] 5.2 Implement recursive scrubbing: field-name deny-list (NIK, plate, address, date of birth, phone, email)
- [ ] 5.3 Implement value-shape scrubbing: 16-digit sequences, data URLs, blob URLs
- [ ] 5.4 Route the error boundary and global error handler through the scrubber

## 6. Tests
- [ ] 6.1 Set up Vitest + React Testing Library and add a smoke test for the shell
- [ ] 6.2 Set up Playwright and add a journey test that every skeleton route resolves
- [ ] 6.3 Test: an analytics event carrying a NIK is transmitted without it
- [ ] 6.4 Test: an error report carrying a document image is transmitted without image data or object URL
- [ ] 6.5 Test: an event carrying a full plate number is transmitted without it
- [ ] 6.6 Test: the theme's text colours meet 4.5:1 contrast
- [ ] 6.7 Accessibility check: keyboard navigation, visible focus, labels, and contrast on the shell and skeleton routes

## 7. Compliance & Review
- [ ] 7.1 Verify controls tagged in the spec: PDP-NO-PII-IN-LOGS, ISO-A8.15-LOGGING, ISO-A8.28-SECURE-CODING
- [ ] 7.2 Confirm no user-facing string literal is rendered from a component
- [ ] 7.3 Run `node openspec/forge/forge.mjs scan --workorder wo-01-app-foundation` and clear the SonarQube quality gate
- [ ] 7.4 Open the PR via `node openspec/forge/forge.mjs pr --workorder wo-01-app-foundation`
