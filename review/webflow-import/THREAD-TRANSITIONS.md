# PATCHSMITH thread-to-stitch scroll component

This is a standalone decorative component prepared for the native Webflow reconstruction. It is already included in the Home and About body fragments. Do not add a duplicate component at those positions when importing them.

## Native Webflow setup

1. Add the markup from `thread-transition-component.html` in a Webflow Embed between two sections. Use a distinct gradient-ID prefix for each additional copy on the same page (replace `webflow-example` everywhere in that copy).
2. Put the contents of `thread-motion.css` inside a style element in the page/site head custom code, or host the stylesheet and link it using an authorized asset URL.
3. Put the contents of `thread-motion.js` inside a script element in the footer custom code, once per page/site. It has no libraries, API keys, network requests or Webflow interactions dependency.
4. Keep the wrapper's `data-thread-motion` attribute and decorative `aria-hidden="true"`. Use `thread-transition--tight` only for an existing generous gap above a story section.
5. Preview the published staging page at desktop and mobile sizes. Webflow Designer itself may not execute custom footer code. Verify scroll progress, browser back/forward navigation and the OS reduced-motion preference on the native site before launch.

## Behavior

A Sunset line draws as its section crosses the viewport, then resolves into short stitches. The position follows normal page scroll; it does not take over scrolling, move page content, auto-loop, or hide any meaning-bearing text. Separate desktop/mobile geometry keeps the curve readable at narrow widths.

No JavaScript and reduced-motion states show the complete thread and stitches as a static divider. Passive events, one requestAnimationFrame per scroll update, and IntersectionObserver limit work to nearby transitions. All layout reads are batched before style writes. The script initializes once and handles reduced-motion preference changes and browser page restoration.

The prototype's real browser rendering remains subject to the documented verification limitations. Source/logic checks are not a native Webflow or real-device visual signoff.
