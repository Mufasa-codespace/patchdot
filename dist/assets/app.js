'use strict';
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const menu = $('.menu-toggle'), nav = $('#main-nav');
  const closeMenu = (returnFocus = false) => {
    if (!menu || !nav) return;
    nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false');
    if (returnFocus) menu.focus();
  };
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  document.addEventListener('click', e => {
    if (menu?.getAttribute('aria-expanded') === 'true' && !e.target.closest('.site-header')) closeMenu();
  });
  $$('a', nav || document.createElement('div')).forEach(a => a.addEventListener('click', () => closeMenu()));
  window.matchMedia('(min-width: 801px)').addEventListener('change', e => { if (e.matches) closeMenu(); });

  const tabs = $$('[data-material]');
  const selectMaterial = tab => {
    tabs.forEach(t => { const active = t === tab; t.setAttribute('aria-selected', String(active)); t.tabIndex = active ? 0 : -1; $('#' + t.getAttribute('aria-controls')).hidden = !active; });
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => selectMaterial(tab));
    tab.addEventListener('keydown', e => {
      let index;
      if (e.key === 'ArrowRight') index = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft') index = (i + tabs.length - 1) % tabs.length;
      if (e.key === 'Home') index = 0;
      if (e.key === 'End') index = tabs.length - 1;
      if (index !== undefined) { e.preventDefault(); selectMaterial(tabs[index]); tabs[index].focus(); }
    });
  });
  $$('[data-garment-src]').forEach(button => button.addEventListener('click', () => {
    $$('[data-garment-src]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    const photo = $('#garment-image'); photo.src = button.dataset.garmentSrc; photo.alt = button.dataset.garmentAlt;
    $('#garment-status').textContent = 'Showing ' + button.dataset.garmentName + ' sweatshirt concept';
  }));

  const uses = {
    'Apparel brands': { title: 'Give the garment its signature.', copy: 'Start with the garment, placement and artwork. A finer label and a statement patch can call for very different finishes.', tags: ['Woven', 'Embroidered', 'Leather'], check: 'Bring: fabric type, placement and your intended care requirements.', type: 'woven' },
    'Teams and clubs': { title: 'Something to belong to.', copy: 'Think about the shared identity and where it will be worn. Strong lettering or a bold emblem gives the material room to work.', tags: ['Embroidered', 'Chenille'], check: 'Bring: team artwork, garment placement and any details that must stay readable.', type: 'embroidered' },
    'Workwear': { title: 'Put the identity to work.', copy: 'Start with the working environment and the garment. Attachment, readability and care requirements need to be considered together.', tags: ['Embroidered', 'PVC'], check: 'Bring: the item, attachment preference and the conditions it will be used in.', type: 'embroidered' },
    'Merch and accessories': { title: 'A small piece of the brand.', copy: 'Caps, bags or a standalone collectible. Match the material to the object and the impression you want it to leave.', tags: ['PVC', 'Woven', 'Leather'], check: 'Bring: the item, available space and the look or surface you have in mind.', type: 'pvc' }
  };
  $$('[data-use]').forEach(button => button.addEventListener('click', () => {
    const label = button.dataset.use, item = uses[label];
    $$('[data-use]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    $('#use-label').textContent = label; $('#use-title').textContent = item.title; $('#use-copy').textContent = item.copy; $('#use-check').textContent = item.check;
    $('#use-tags').replaceChildren(...item.tags.map(label => { const span = document.createElement('span'); span.textContent = label; return span; }));
    const url = new URL('/request-a-quote/', location.origin); url.searchParams.set('use', label); url.searchParams.set('type', item.type); $('#use-cta').href = url.pathname + url.search;
  }));
  $$('[data-faq-filter]').forEach(button => button.addEventListener('click', () => {
    const category = button.dataset.faqFilter;
    $$('[data-faq-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    let count = 0;
    $$('[data-faq-category]').forEach(item => { const show = category === 'All' || item.dataset.faqCategory === category; item.hidden = !show; if (show) count++; });
    $('#faq-count').textContent = category === 'All' ? `Showing all ${count} questions` : `Showing ${count} ${category.toLowerCase()} questions`;
  }));

  const quote = $('#quote-form');
  if (quote) {
    const names = { embroidered: 'Embroidered', woven: 'Woven', pvc: 'PVC', chenille: 'Chenille', leather: 'Leather' };
    let step = 0, briefText = '';
    const steps = $$('.quote-step', quote), err = $('#form-error');
    const value = name => quote.elements.namedItem(name)?.value.trim() || '';
    const field = name => quote.elements.namedItem(name);
    const params = new URLSearchParams(location.search);
    if (Object.hasOwn(names, params.get('type'))) field('patch').value = params.get('type');
    if ([...field('use').options].some(o => o.value === params.get('use'))) field('use').value = params.get('use');
    const invalidate = () => { $('#brief-result').hidden = true; briefText = ''; };
    quote.addEventListener('input', e => { invalidate(); if (e.target instanceof HTMLElement) e.target.removeAttribute('aria-invalid'); });
    quote.addEventListener('change', invalidate);
    function validate() {
      err.hidden = true;
      $$('[aria-invalid]', quote).forEach(el => el.removeAttribute('aria-invalid'));
      let invalid = null, message = '';
      if (step === 0 && !value('patch')) { invalid = $('input[name="patch"]', quote); message = 'Choose a starting material to continue. You can change it later.'; }
      if (step === 1) {
        const checks = [ ['quantity', 'Enter a whole quantity of at least 1, or leave it blank.'], ['width', 'Enter a width of at least 0.1, or leave it blank.'], ['height', 'Enter a height of at least 0.1, or leave it blank.'] ];
        for (const [name, msg] of checks) { const el = field(name); if (!el.validity.valid) { invalid = el; message = msg; break; } }
      }
      if (step === 2 && !value('project')) { invalid = field('project'); message = 'Add a project name so your brief has a title.'; }
      if (invalid) { err.textContent = message; err.hidden = false; invalid.setAttribute('aria-invalid', 'true'); invalid.focus(); return false; }
      return true;
    }
    const element = (tag, text, cls = '') => { const el = document.createElement(tag); el.textContent = text; if (cls) el.className = cls; return el; };
    function detailsRows(rows) {
      const dl = element('dl', '', 'spec-list');
      rows.forEach(([label, text]) => { const div = document.createElement('div'); div.append(element('dt', label), element('dd', text || 'To be decided')); dl.append(div); });
      return dl;
    }
    function summarySection(title, editStep, rows) {
      const card = element('section', '', 'summary-card'), heading = element('div', '', 'summary-title');
      const edit = element('button', 'Edit'); edit.type = 'button'; edit.setAttribute('aria-label', 'Edit ' + title.toLowerCase()); edit.addEventListener('click', () => { invalidate(); go(editStep); });
      heading.append(element('h3', title), edit); card.append(heading, detailsRows(rows)); return card;
    }
    function data() {
      return { patch: names[value('patch')] || 'To be decided', use: value('use'), quantity: value('quantity'), dimensions: value('width') || value('height') ? `${value('width') || '?'} × ${value('height') || '?'} ${value('units')}` : '', backing: value('backing'), project: value('project'), country: value('country'), needed: value('needed'), notes: value('notes') };
    }
    function renderSummary() {
      const d = data(), root = $('#quote-summary'); root.replaceChildren();
      const intro = element('div', '', 'summary-material'), img = document.createElement('img');
      img.src = `/assets/${value('patch')}-concept.svg`; img.alt = `${d.patch} patch concept`; img.width = 120; img.height = 102;
      const copy = document.createElement('div'); copy.append(element('h3', d.project), element('p', d.patch + ' patch brief')); intro.append(img, copy);
      root.append(intro, summarySection('The material', 0, [['Material', d.patch], ['Application', d.use]]), summarySection('The specification', 1, [['Quantity', d.quantity], ['Dimensions', d.dimensions], ['Attachment', d.backing]]), summarySection('The project', 2, [['Project', d.project], ['Destination', d.country], ['Requested date', d.needed], ['Artwork & notes', d.notes]]));
      const notice = element('p', 'All choices are preferences for review. Pricing, minimums, construction, approvals and timing are not confirmed by this brief.', 'small'); root.append(notice);
    }
    function go(next) {
      step = next; err.hidden = true;
      steps.forEach((s, i) => { s.hidden = i !== step; });
      $$('[data-progress]').forEach((p, i) => { if (i === step) p.setAttribute('aria-current', 'step'); else p.removeAttribute('aria-current'); p.classList.toggle('done', i < step); });
      if (step === 3) renderSummary();
      const heading = $('#step-heading-' + step); heading.focus({ preventScroll: true });
      const bounds = heading.getBoundingClientRect();
      if (bounds.top < 100 || bounds.top > innerHeight - 100) heading.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    }
    $$('[data-next]', quote).forEach(b => b.addEventListener('click', () => { if (validate()) go(Math.min(3, step + 1)); }));
    $$('[data-back]', quote).forEach(b => b.addEventListener('click', () => go(Math.max(0, step - 1))));
    quote.addEventListener('submit', e => {
      e.preventDefault();
      if (step < 3) { if (validate()) go(step + 1); return; }
      const d = data();
      briefText = `PATCHSMITH — LOCAL PROJECT BRIEF\n\nProject: ${d.project}\nMaterial: ${d.patch}\nApplication: ${d.use || 'To be decided'}\nQuantity: ${d.quantity || 'To be decided'}\nDimensions: ${d.dimensions || 'To be decided'}\nAttachment preference: ${d.backing || 'To be decided'}\nDelivery country: ${d.country || 'To be decided'}\nRequested date: ${d.needed || 'To be decided'}\n\nArtwork and project notes:\n${d.notes || 'To be added'}\n\nThis brief was created locally in the PATCHSMITH design preview. Nothing has been sent, uploaded or ordered. It is not a quote or order confirmation. Material suitability, minimums, prices, specifications, proof/sample arrangements, production and shipping terms must be agreed separately.\n`;
      $('#brief-result').hidden = false;
      $('#brief-result').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
    });
    $('#download-brief').addEventListener('click', () => {
      if (!briefText) return;
      const blob = new Blob([briefText], { type: 'text/plain;charset=utf-8' }), url = URL.createObjectURL(blob), link = document.createElement('a');
      link.href = url; link.download = 'PATCHSMITH-project-brief.txt'; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  }
  const contact = $('#contact-form');
  if (contact) {
    contact.addEventListener('input', () => { $('#contact-preview').hidden = true; $('#contact-error').hidden = true; $('#contact-message').removeAttribute('aria-invalid'); });
    contact.addEventListener('change', () => { $('#contact-preview').hidden = true; });
    contact.addEventListener('submit', e => {
      e.preventDefault(); const message = $('#contact-message').value.trim();
      if (!message) { $('#contact-error').textContent = 'Write your question before previewing it.'; $('#contact-error').hidden = false; $('#contact-message').setAttribute('aria-invalid', 'true'); $('#contact-message').focus(); return; }
      $('#contact-error').hidden = true; $('#contact-preview-text').textContent = $('#contact-topic').value + '\n\n' + message; $('#contact-preview').hidden = false;
    });
  }
})();
