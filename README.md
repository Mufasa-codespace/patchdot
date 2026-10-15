# patchdot — PATCHSMITH review prototype

A responsive, 12-page static material studio with a 404 page. Copied from approved design source commit `3aab4e95dc9c88b4640b3b77b2445b011a0f75da`. This repository and its Vercel project are separate from the existing Cursor project.

## Run and verify

Requires Python 3. No dependency installation or web framework is required.

    python build.py
    python test_site.py
    node --check src/app.js
    python -m http.server 4173 --directory dist

Open http://localhost:4173. Use an HTTP server rather than opening the HTML directly: links and assets use root-relative paths. Optional npm scripts wrap the build, test and local server commands.

`src/` contains reusable CSS, JavaScript, original local brand assets, fonts and product copy. `build.py` generates all pages and original material illustrations into `dist/`. It deliberately replaces the generated `dist/` directory; edit sources instead of build output.

## The experience

- Oversized editorial typography, cream/charcoal base and the selected Sunset accent palette
- The exact A-interlock vector silhouette in the navigation; the selected stitched Sunset identity shown at a larger scale
- Four selectable `represent / پاکستان` sweatshirt concepts, with enlarged Urdu chest embroidery and Sunset PS hem marks, beside Bilal Maqsood's understated Pakistan-led story
- Five-material explorer with keyboard-operated tabs, a comparison table and individual material pages
- Four application choices with useful starting-point recommendations that carry into the brief
- Expandable idea → specification → approval → production flow
- Scroll-linked Sunset thread-to-stitch dividers leading into the story and craft process, with static reduced-motion/no-JavaScript fallback and a standalone Webflow custom-code export
- Four-step local brief builder with preselected material/application, validation, preserved back-step values, editable summary and a downloadable text brief
- Topic-filtered FAQ and an honest local-only contact-message preview
- Responsive navigation, visible keyboard focus, reduced-motion support, semantic headings and labels
- Local fonts and optimized WebP images; no external embeds, video or dependency bundles

## Content and permissions

Pages: Home; Products; Embroidered; Woven; PVC; Chenille; Leather; How It Works; About; FAQ; Contact; Request a Quote; plus 404.

The user-approved identity is Refined A Interlock, in the Sunset purple/magenta/coral/orange treatment. The flat vector is an exact-path small-format variant. The stitched identity is a concept image, not a production embroidery file. The sweatshirt is explicitly labeled a concept design, not a manufactured sample or customer project.

The site states that PATCHSMITH patches are made in Pakistan and shipped worldwide, including to US business customers. Bilal Maqsood's vision is presented as an ambition for Pakistani craftsmanship. It does not inherit another brand's dates, history, reviews, production claims, prices, order minimums, sample promises or delivery timings. Material and attachment descriptions are starting points requiring project-specific review.

The references inspired editorial hierarchy, changes of visual chapter and clear interaction states. Their assets, fonts, code and claims were not copied.

## Prototype boundaries

This separate preview is intended for owner and partner review. Every page carries `noindex,nofollow`; robots.txt disallows crawling. These do not replace access control.

Forms do not send, upload artwork, email, take payments, create orders, write cookies, run analytics or persist entries in browser storage. The browser may retain values through autofill/history. The CSP blocks connection requests and form actions. Brief downloads are created locally from an in-memory Blob. Contact details and commercial terms are deliberately not fabricated.

Before public launch: confirm operational copy and real contact details; approve production imagery and specifications; implement and test authorized backend form collection, privacy, spam prevention and error recovery; test actual device/browser rendering and accessibility; approve indexing and domain configuration.

## Separate Vercel deployment

Import `Mufasa-codespace/patchdot` into its own Vercel project. Use the repository root. `vercel.json` serves the checked-in `dist` folder without installing dependencies or running a remote build. Regenerate and test `dist` before committing changes. All responses include `X-Robots-Tag: noindex, nofollow`.

This preview is viewable by link; noindex and robots.txt do not restrict access. No production domain is configured by this repository. The existing Cursor repository and Vercel project are independent and must not be reused.

## Asset licenses

PATCHSMITH identity and illustrations are original user-approved design work. Generated stitched identity and sweatshirt are concept artwork. Space Grotesk and Inter are bundled locally with SIL Open Font License notices in `src/assets/` and `dist/assets/`.

## Verification

Read `review/qa-report.json` and `review/static-checks.json` for exactly which checks ran and any remaining limits. Source and DOM-simulation checks are not equivalent to a live browser or assistive-technology test. Screenshots are included only if a genuine browser render was available.
