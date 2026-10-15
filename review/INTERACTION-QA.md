# PATCHSMITH redesign: independent interaction QA

Checked 15 October 2026. This report covers the generated static prototype, not production intake, orders or a native Webflow implementation.

## Result

- 31 of 31 executable modeled-DOM tests pass against the generated pages and actual application JavaScript.
- The static project checker passes all 13 HTML documents: 12 requested pages plus the 404 page.
- JavaScript syntax checks pass.
- Additional HTML checks found no duplicate IDs, missing ARIA reference targets, missing control labels, images without an alt attribute, or buttons without an explicit type.
- A source-level narrow-layout risk for very long project names in the brief summary was identified and fixed. Source verification confirms the summary text flex child can shrink and wrap, while its image cannot shrink. Rendered behavior is still unverified.
- Actual desktop/mobile browser rendering, native browser validation, focus visibility, accessibility announcements and console/network behavior remain unverified. This is not a live-browser accessibility or launch signoff.

## Executable coverage

The application JavaScript runs without exceptions for all 13 pages in a dependency-free modeled DOM. The harness exercises:

1. Mobile navigation open/close state, outside click, Escape focus restoration, navigation click and desktop-breakpoint close.
2. Both material tab groups: selection, one active panel, tab order, ArrowLeft, ArrowRight, Home and End.
3. All application selectors: recommendation copy, selected-state accessibility attributes, material tags and quote URL preselection.
4. FAQ category filters, visible question counts and selected state.
5. Quote missing-material error, focus target and recovery.
6. All five material paths, retaining entered quantity, dimensions, units, attachment preference, project and notes through summary and editing.
7. Valid preselection and rejection of unknown query parameters.
8. Invalid numeric constraint states, whitespace-only project errors and recovery. Browser validity is modeled in this test; native browser behavior still requires verification.
9. Submit/Enter-path handler logic: only the current valid step advances.
10. Creating a local brief, plain-text Blob content, download filename, required no-order/no-transmission wording, and invalidation after editing.
11. Text-safe summaries and contact previews. HTML-like user text does not become DOM elements.
12. Contact empty-message error, local preview and preview clearing after edits.
13. Reduced-motion preference selecting automatic rather than smooth scripted scrolling.
14. Actual sweatshirt selectors on the home and about pages: selected state, image source and alt update, status text, explicit button type and file existence. Final run covers all four actual variants on both pages: Oat × Forest, Charcoal × Ivory, Forest × Cream, and Navy × Silver.

## Privacy and transport source review

The JavaScript has no fetch, XMLHttpRequest, beacon, analytics, cookie, localStorage or sessionStorage path. Quote and contact submit handlers call preventDefault. Generated pages set CSP connect-src 'none' and form-action 'none'. Artwork upload controls are absent. The only brief export path creates an in-memory text Blob and a local download link.

These are source and executable-logic findings. They do not substitute for a captured browser network trace. No customer information was used during QA; test values are synthetic.

## Accessibility and responsive source review

Material controls have tab/tablist/tabpanel roles, linked labels, roving tabindex and keyboard selection handlers. Hidden panels use the hidden attribute, and CSS enforces display:none for hidden content. Form labels, fieldset legends, alert/status regions and visible-focus CSS are present. CSS includes responsive layouts at 1100, 800 and 540 px, 16 px mobile text inputs, contained horizontal comparison-table scrolling, and a reduced-motion media query.

The summary specification values and contact preview already use overflow-wrap:anywhere. The summary header now has the same long-text wrapping treatment and a nonshrinking image. Final source and executable-logic verification confirms all four gallery variants are integrated.

## Browser verification limitation

The supported cloud browser is available, but the existing private preview returned a gateway connection-refused response on two checks. A normally bound local preview server also returned connection refused from that browser. Installed local Playwright/Chromium could not start with the browser sandbox enabled because the baseline execution environment denied socket creation. One standard elevated sandbox-preserving launch failed in the execution wrapper before Chromium started. No sandbox was disabled, authentication workaround invented, access setting changed, software installed, or user computer accessed.

The supported cloud-browser API does not expose custom request headers, so the documented Sites dispatch authorization header could not be applied through that browser. No credential was printed, persisted or put in a URL.

## Reproduce

From the project root:

    python3 test_site.py
    node --check dist/assets/app.js
    node review/interaction-qa.js > review/interaction-qa-results.json

The harness requires existing Node.js and Python 3 only. Its DOM capture helper uses the Python standard library. It does not launch a browser, install dependencies, submit forms or transmit test content.

Files:
- interaction-qa.js: application-state tests and explicitly modeled DOM
- capture_qa_dom.py: generated HTML serializer
- interaction-qa-results.json: latest test results

## Remaining real-browser acceptance checks

- Render 1440 px desktop and 390/320 px mobile home, material and quote pages; inspect text/images, horizontal overflow and sticky-header collisions.
- Run every quote step, Back/Edit, error recovery and local download in the browser; inspect long/unbroken text and contact preview.
- Test keyboard-only navigation and focus visibility through menu, material tabs, swatches, FAQ and form controls.
- Test prefers-reduced-motion and ensure no inappropriate animation remains.
- Inspect console errors and a network trace; confirm no form-data transmission, analytics or persistent browser storage.
- Check the final four sweatshirt concept variants visually, including contrast and narrow-screen wrapping. Selected state and image/alt/status updates have passed executable-logic tests.

## Scroll thread-to-stitch addition

The standalone component passes 16/16 source and modeled lifecycle checks in `thread-motion-qa.js`. Coverage includes initial and changed reduced-motion preferences, requestAnimationFrame coalescing, observer filtering, page restoration, DOM-ready initialization, mixed existing/new elements, static fallback, unique SVG IDs and connected mobile/desktop paths. All 31 application interaction tests still pass. Run `node review/thread-motion-qa.js` to reproduce. Actual SVG clip-path rendering, section spacing and visual scroll smoothness remain unverified in a live browser and in native Webflow.
