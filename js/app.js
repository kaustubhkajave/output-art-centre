/* OUTPUT · Centre for Contemporary Art
   What's on (filters + detail), pinned building scroll, visit planner, timed tickets. */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const pad = n => String(n).padStart(2, '0');
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const euro = n => n === 0 ? 'Free' : '€' + n;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Hours + status ---------------- */
  // [open, close] in minutes; null = closed
  const HOURS = [[600, 1080], null, [600, 1080], [600, 1080], [600, 1260], [600, 1080], [600, 1080]];
  const hm = m => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
  function status() {
    const now = new Date(), mins = now.getHours() * 60 + now.getMinutes(), h = HOURS[now.getDay()];
    const el = $('#status-text'), dot = $('.status .dot');
    if (h && mins >= h[0] && mins < h[1]) {
      const free = now.getDay() === 4 && mins >= 1020;
      el.textContent = free ? `Open now · free until ${hm(h[1])}` : `Open now · until ${hm(h[1])}`;
      dot.classList.remove('closed');
    } else {
      let d = new Date(now), i = 0;
      if (h && mins < h[0]) { el.textContent = `Opens today at ${hm(h[0])}`; dot.classList.add('closed'); return; }
      do { d.setDate(d.getDate() + 1); i++; } while (!HOURS[d.getDay()] && i < 7);
      el.textContent = `Closed now · opens ${i === 1 ? 'tomorrow' : DAYS[d.getDay()]} ${hm(HOURS[d.getDay()][0])}`;
      dot.classList.add('closed');
    }
  }
  status();

  /* ---------------- Wordmark: fill the hero width exactly ---------------- */
  const word = $('.wordmark'), heroEl = $('.hero');
  function fitWord() {
    word.style.fontSize = '100px';
    const r = document.createRange(); r.selectNodeContents(word);
    const w = r.getBoundingClientRect().width;
    if (w) word.style.fontSize = (100 * heroEl.clientWidth * 0.985 / w) + 'px';
  }
  fitWord();
  document.fonts?.ready.then(fitWord);
  window.addEventListener('resize', fitWord);

  /* ---------------- Menu ---------------- */
  const menuBtn = $('#menu-btn'), nav = $('#site-nav');
  menuBtn.addEventListener('click', () => {
    const open = menuBtn.getAttribute('aria-expanded') !== 'true';
    menuBtn.setAttribute('aria-expanded', open); nav.classList.toggle('open', open);
    menuBtn.textContent = open ? 'Close' : 'Menu';
  });
  nav.addEventListener('click', e => { if (e.target.closest('a') && nav.classList.contains('open')) menuBtn.click(); });

  /* ---------------- Exhibitions ---------------- */
  const EX = [
    { id: 'signal', title: 'Signal / Noise', type: 'Sound installation', room: 'turbine', place: 'Turbine Hall · Level 0', when: 'now', dates: 'Until 12 Apr 2027', mins: 20, free: false, loud: true, flash: false, kids: true, img: 'sound',
      lead: 'Forty speakers, one hall. A score built from recordings of the turbines that used to run here.',
      body: 'Sit, lie down or walk through. The piece loops every 18 minutes and is different depending on where you stand.',
      sensory: 'Loud: peaks at 85 dB for about two minutes in every loop. Ear defenders at the entrance.' },
    { id: 'ink', title: 'Ink Weather', type: 'Group exhibition · Painting', room: 'boiler', place: 'Boiler House · Level 1', when: 'now', dates: 'Until 1 Mar 2027', mins: 25, free: false, loud: false, flash: false, kids: true, img: 'ink',
      lead: 'Fourteen painters working at the scale of weather: black ink on canvases up to nine metres wide.',
      body: 'Daylit rooms, benches in each, and a drawing table for children at the end.',
      sensory: 'Calm: daylight, quiet rooms, plenty of seating.' },
    { id: 'line', title: 'Line of Sight', type: 'Light installation', room: 'switch', place: 'Switch Room B · Level 0', when: 'now', dates: 'Until 31 Jan 2027', mins: 10, free: false, loud: false, flash: true, kids: false, img: 'laser',
      lead: 'A single laser drawing a room inside a room. Twelve people at a time.',
      body: 'Entry every 10 minutes, included in your ticket. Wait times are shown on the screen at the Turbine Hall.',
      sensory: 'Strobe and darkness. Not suitable for people with photosensitive epilepsy. Warning at the door.' },
    { id: 'hollow', title: 'Hollow Forms', type: 'Sculpture', room: 'mezz', place: 'Mezzanine · Level 2', when: 'now', dates: 'Until 18 May 2027', mins: 15, free: true, loud: false, flash: false, kids: true, img: 'head',
      lead: 'Cast heads and torsos that are open at the back. Walk round them and they disappear.',
      body: 'Free to enter, no ticket needed. Views down into the Turbine Hall.',
      sensory: 'Calm, but the mezzanine has a low glass balustrade.' },
    { id: 'faces', title: 'Archive of Faces', type: 'Photography · Collection', room: 'g2', place: 'Gallery 2 · Level 1', when: 'now', dates: 'Ongoing', mins: 20, free: true, loud: false, flash: false, kids: true, img: 'gallery',
      lead: 'Portraits of the people who built and ran the power station, 1931 to 1994.',
      body: 'Free. Families can borrow a "find the face" trail from the desk.',
      sensory: 'Calm, daylit, step-free.' },
    { id: 'lamps', title: 'Thousand Lamps', type: 'Immersive light', room: 'turbine', place: 'Turbine Hall · Level 0', when: 'soon', dates: 'Opens 6 Feb 2027', mins: 20, free: false, loud: false, flash: false, kids: true, img: 'lanterns',
      lead: 'A thousand glass lamps that respond to the number of people in the hall.',
      body: 'Booking opens 6 January. Members get first access.',
      sensory: 'Low light, slow changes, no strobe.' },
    { id: 'still', title: 'Still Field', type: 'Installation', room: 'boiler', place: 'Boiler House · Level 1', when: 'soon', dates: 'Opens 20 Mar 2027', mins: 15, free: false, loud: false, flash: false, kids: true, img: 'rods',
      lead: 'Four thousand steel rods hung from the ceiling, moving with the air.',
      body: 'Sound is made only by visitors walking through.',
      sensory: 'Quiet, dim. The floor is uneven in places.' },
  ];
  const list = $('#ex-list'), countEl = $('#ex-count'), cursor = $('#cursor-img'), cursorImg = cursor.querySelector('img');

  function tagsFor(x) {
    const t = [];
    if (x.free) t.push('<span class="tag">Free</span>');
    if (x.loud) t.push('<span class="tag warn">Loud</span>');
    if (x.flash) t.push('<span class="tag warn">Flashing light</span>');
    if (x.kids) t.push('<span class="tag">Good for kids</span>');
    t.push(`<span class="tag">${x.mins} min</span>`);
    return t.join('');
  }
  function renderEx() {
    const when = $('input[name="when"]:checked').value, free = $('#f-free').checked, calm = $('#f-calm').checked;
    const rows = EX.filter(x => (when === 'all' || x.when === when) && (!free || x.free) && (!calm || (!x.loud && !x.flash)));
    countEl.textContent = `${rows.length} ${rows.length === 1 ? 'exhibition' : 'exhibitions'}`;
    if (!rows.length) {
      list.innerHTML = `<li class="empty">Nothing matches those filters. <button type="button" id="clear-f">Clear filters</button></li>`;
      $('#clear-f').onclick = () => { $('#f-free').checked = false; $('#f-calm').checked = false; $('input[name="when"][value="all"]').checked = true; renderEx(); };
      return;
    }
    list.innerHTML = rows.map((x, i) => `
      <li class="ex" data-img="img/${x.img}.jpg">
        <button class="ex-row" type="button" aria-expanded="false" aria-controls="p-${x.id}">
          <span class="mono">${pad(i + 1)}</span>
          <span class="ex-title">${x.title}</span>
          <span class="ex-meta"><b>${x.type}</b>${x.place}<br>${x.dates}</span>
          <span class="tags">${tagsFor(x)}</span>
          <span class="plus" aria-hidden="true"></span>
        </button>
        <div class="ex-panel" id="p-${x.id}" hidden>
          <img src="img/${x.img}.jpg" alt="" loading="lazy" />
          <div>
            <p class="lead">${x.lead}</p>
            <p>${x.body}</p>
            <dl class="facts">
              <div><dt>Where</dt><dd>${x.place}</dd></div>
              <div><dt>Time needed</dt><dd>About ${x.mins} minutes</dd></div>
              <div><dt>Dates</dt><dd>${x.dates}</dd></div>
              <div><dt>Entry</dt><dd>${x.free ? 'Free, no ticket needed' : 'With a timed ticket'}</dd></div>
            </dl>
            <p class="sensory"><b>What to expect:</b> ${x.sensory}</p>
            ${x.when === 'now' && !x.free ? '<a class="btn btn-signal" href="#tickets">Book a timed ticket <span aria-hidden="true">→</span></a>' : x.when === 'soon' ? '<a class="btn btn-line-light" href="#tickets">Book for another exhibition</a>' : '<a class="btn btn-line-light" href="#plan">Add it to a visit plan</a>'}
          </div>
        </div>
      </li>`).join('');
  }
  $$('input[name="when"], #f-free, #f-calm').forEach(i => i.addEventListener('change', renderEx));
  list.addEventListener('click', e => {
    const b = e.target.closest('.ex-row'); if (!b) return;
    const open = b.getAttribute('aria-expanded') !== 'true';
    b.setAttribute('aria-expanded', open);
    $('#' + b.getAttribute('aria-controls')).hidden = !open;
    if (open) cursor.classList.remove('on');
  });
  renderEx();

  // cursor-following preview image (mouse only)
  if (matchMedia('(hover: hover) and (pointer: fine)').matches && !reduce) {
    let x = 0, y = 0, cx = 0, cy = 0, raf = 0;
    const loop = () => { cx += (x - cx) * .18; cy += (y - cy) * .18; cursor.style.left = cx + 'px'; cursor.style.top = cy + 'px'; raf = requestAnimationFrame(loop); };
    list.addEventListener('mousemove', e => {
      x = e.clientX + 170; y = e.clientY;
      const row = e.target.closest('.ex');
      const btn = row && row.querySelector('.ex-row');
      if (row && btn && btn.matches(':hover') && btn.getAttribute('aria-expanded') !== 'true') {
        if (cursorImg.getAttribute('src') !== row.dataset.img) cursorImg.src = row.dataset.img;
        if (!cursor.classList.contains('on')) { cx = x; cy = y; cursor.classList.add('on'); }
        if (!raf) raf = requestAnimationFrame(loop);
      } else cursor.classList.remove('on');
    });
    list.addEventListener('mouseleave', () => { cursor.classList.remove('on'); cancelAnimationFrame(raf); raf = 0; });
  }

  /* ---------------- Building: pinned horizontal scroll ---------------- */
  const bld = $('#building'), pin = $('.bld-pin', bld);
  const wide = matchMedia('(min-width: 861px)');
  let dist = 0;
  function setupPin() {
    const on = wide.matches && !reduce;
    bld.classList.toggle('pinned', on);
    pin.style.setProperty('--x', '0px');
    $$('.bld-pin > *').forEach(el => el.style.transform = '');
    if (!on) { bld.style.removeProperty('--bld-h'); return; }
    dist = Math.max(0, pin.scrollWidth - pin.clientWidth);
    bld.style.setProperty('--bld-h', `${pin.clientHeight + dist}px`);
    onPinScroll();
  }
  function onPinScroll() {
    if (!bld.classList.contains('pinned')) return;
    const head = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--head-h')) || 64;
    const p = Math.min(1, Math.max(0, (window.scrollY - (bld.offsetTop - head)) / (dist || 1)));
    $$('.bld-pin > *').forEach(el => el.style.transform = `translateX(${-p * dist}px)`);
  }
  window.addEventListener('scroll', onPinScroll, { passive: true });
  window.addEventListener('resize', setupPin);
  window.addEventListener('load', setupPin);
  setupPin();

  /* ---------------- Visit planner ---------------- */
  const ROOMS = {
    turbine: { name: 'Turbine Hall', x: 40, y: 110, w: 220, h: 250, lv: 0 },
    switch: { name: 'Switch Rooms', x: 260, y: 280, w: 160, h: 80, lv: 0 },
    cafe: { name: 'Café', x: 420, y: 280, w: 180, h: 80, lv: 0 },
    boiler: { name: 'Boiler House', x: 260, y: 200, w: 220, h: 80, lv: 1 },
    g2: { name: 'Gallery 2', x: 480, y: 200, w: 120, h: 80, lv: 1 },
    mezz: { name: 'Mezzanine', x: 260, y: 140, w: 340, h: 60, lv: 2 },
    roof: { name: 'Roof terrace', x: 420, y: 110, w: 180, h: 30, lv: 3 },
  };
  const ORDER = ['turbine', 'switch', 'boiler', 'g2', 'mezz', 'roof', 'cafe'];
  const WALK = 5;
  const svg = $('#plan-svg');

  function plan() {
    const f = $('#plan-form'), mins = +f.mins.value, stepfree = f.stepfree.checked, calm = f.calm.checked, kids = f.kids.checked;
    const now = EX.filter(x => x.when === 'now');
    const prio = kids ? ['faces', 'ink', 'signal', 'hollow', 'line'] : ['signal', 'ink', 'line', 'hollow', 'faces'];
    const skipped = [];
    let used = 0; const picked = [];
    for (const id of prio) {
      const x = now.find(e => e.id === id);
      if (calm && (x.loud || x.flash)) { skipped.push(`${x.title} (${x.loud ? 'loud' : 'flashing light'})`); continue; }
      if (used + x.mins + WALK <= mins) { picked.push({ room: x.room, title: x.title, sub: x.place, mins: x.mins }); used += x.mins + WALK; }
      else skipped.push(`${x.title} (not enough time)`);
    }
    if (!stepfree && used + 10 + WALK <= mins) { picked.push({ room: 'roof', title: 'Roof terrace', sub: 'Level 3 · stairs only · harbour view', mins: 10 }); used += 10 + WALK; }
    if ((mins >= 150 || kids) && used + 20 <= mins) { picked.push({ room: 'cafe', title: 'Café break', sub: 'Level 0 · by the main entrance', mins: 20, brk: true }); used += 20; }
    picked.sort((a, b) => ORDER.indexOf(a.room) - ORDER.indexOf(b.room));

    let t = 0;
    $('#route-list').innerHTML = picked.map((p, i) => {
      const s = t; t += p.mins + (i < picked.length - 1 ? WALK : 0);
      return `<li class="${p.brk ? 'break' : ''}"><span class="n" aria-hidden="true">${i + 1}</span><span><b>${p.title}</b><small>${p.sub}</small></span><span class="t">${s}–${s + p.mins} min</span></li>`;
    }).join('');
    const stops = picked.filter(p => !p.brk).length;
    $('#route-sum').textContent = `${stops} ${stops === 1 ? 'stop' : 'stops'} in ${t} of your ${mins} minutes.`;
    const notes = [];
    if (stepfree) notes.push('Step-free: use Lift A by the entrance; the roof terrace is left out because it is stairs only.');
    if (skipped.length) notes.push('Left out: ' + skipped.join(', ') + '.');
    let note = $('.route-note'); if (!note) { note = document.createElement('p'); note.className = 'route-note'; $('.route').append(note); }
    note.textContent = notes.join(' ');
    drawMap(picked, stepfree);
  }

  function drawMap(picked, stepfree) {
    const hit = new Map(picked.map((p, i) => [p.room, i + 1]));
    const ink = '#0d0d0d', sig = '#d4ff3a', soft = '#c9c8c1';
    let s = `<title id="plan-svg-t">Building cross-section with your route</title><desc>${picked.map((p, i) => `${i + 1}: ${ROOMS[p.room].name}`).join(', ')}</desc>`;
    s += `<rect x="540" y="28" width="30" height="82" fill="none" stroke="${ink}" stroke-width="1.5"/><text x="555" y="22" text-anchor="middle" font-family="IBM Plex Mono" font-size="10" fill="${ink}">CHIMNEY</text>`;
    s += `<line x1="16" y1="360" x2="624" y2="360" stroke="${ink}" stroke-width="2"/>`;
    for (const [id, r] of Object.entries(ROOMS)) {
      const on = hit.has(id);
      const dim = stepfree && id === 'roof';
      s += `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" fill="${on ? sig : '#f7f6f2'}" stroke="${ink}" stroke-width="1.5" ${dim ? `stroke-dasharray="4 4"` : ''}/>`;
      s += `<text x="${r.x + 8}" y="${r.y + 16}" font-family="IBM Plex Mono" font-size="10.5" fill="${on || !dim ? ink : '#62625c'}">${r.name.toUpperCase()}${dim ? ' · STAIRS' : ''}</text>`;
    }
    // levels
    [['L0', 330], ['L1', 250], ['L2', 180], ['L3', 128]].forEach(([l, y]) => s += `<text x="626" y="${y}" font-family="IBM Plex Mono" font-size="10" fill="#62625c" text-anchor="end" transform="translate(10 0)">${l}</text>`);
    // lift
    s += `<rect x="252" y="140" width="16" height="220" fill="${stepfree ? ink : 'none'}" stroke="${ink}" stroke-width="1" opacity="${stepfree ? 1 : .35}"/>`;
    if (stepfree) s += `<text x="260" y="378" text-anchor="middle" font-family="IBM Plex Mono" font-size="10" fill="${ink}">LIFT A</text>`;
    // route
    const pts = picked.map(p => { const r = ROOMS[p.room]; return [r.x + r.w / 2, r.y + r.h / 2 + (p.room === 'turbine' ? 60 : 6)]; });
    if (pts.length > 1) s += `<polyline points="${pts.map(p => p.join(',')).join(' ')}" fill="none" stroke="${ink}" stroke-width="2" stroke-dasharray="6 5"/>`;
    pts.forEach(([x, y], i) => s += `<rect x="${x - 13}" y="${y - 13}" width="26" height="26" fill="${ink}"/><text x="${x}" y="${y + 5}" text-anchor="middle" font-family="IBM Plex Mono" font-size="14" fill="${sig}">${i + 1}</text>`);
    s += `<text x="40" y="392" font-family="IBM Plex Mono" font-size="10" fill="#62625c">ENTRANCE ↑ TURBINE QUAY</text>`;
    svg.innerHTML = s;
  }
  $('#plan-form').addEventListener('change', plan);
  plan();

  /* ---------------- Tickets ---------------- */
  const TYPES = [
    { id: 'adult', name: 'Adult', note: '', price: 16 },
    { id: 'conc', name: 'Concession', note: 'Students, 65+, jobseekers', price: 10 },
    { id: 'u18', name: 'Under 18', note: 'Always free. Under-16s come with an adult', price: 0 },
    { id: 'member', name: 'Member', note: 'Free with your membership number', price: 0 },
  ];
  const CAP = 120, MAX = 10;
  const cart = { adult: 0, conc: 0, u18: 0, member: 0 };
  let selDay = null, selSlot = null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const dayList = Array.from({ length: 7 }, (_, i) => { const d = new Date(today); d.setDate(d.getDate() + i); return d; });
  const key = d => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  const niceDay = d => `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;

  function rand(str) { let h = 2166136261; for (const c of str) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return ((h >>> 0) % 1000) / 1000; }
  function slotsFor(d) {
    const h = HOURS[d.getDay()]; if (!h) return [];
    const out = [], now = new Date(), isToday = key(d) === key(now), nowM = now.getHours() * 60 + now.getMinutes();
    const lastEntry = h[1] - 60;
    const weekend = d.getDay() === 0 || d.getDay() === 6;
    for (let m = h[0]; m <= lastEntry; m += 30) {
      const peak = m >= 720 && m < 900 ? .32 : m < 690 ? -.18 : .05;
      const thuLate = d.getDay() === 4 && m >= 1020;
      let fill = .38 + (weekend ? .28 : 0) + peak + (thuLate ? .22 : 0) + (rand(key(d) + m) - .5) * .5;
      fill = Math.max(.08, Math.min(1, fill));
      const left = fill >= .97 ? 0 : Math.round(CAP * (1 - fill));
      out.push({ m, fill: left === 0 ? 1 : fill, left, past: isToday && m + 15 < nowM, free: thuLate });
    }
    return out;
  }
  function renderDays() {
    $('#days').innerHTML = dayList.map((d, i) => {
      const closed = !HOURS[d.getDay()];
      const allPast = !closed && slotsFor(d).every(s => s.past);
      const lab = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : DAYS[d.getDay()];
      const em = closed ? 'Closed' : allPast ? 'Ended' : d.getDay() === 4 ? 'Free late' : '';
      return `<label class="day"><input type="radio" name="day" value="${i}" ${closed || allPast ? 'disabled' : ''} aria-label="${niceDay(d)}${em ? ', ' + em : ''}" /><span><small>${lab}</small><b>${d.getDate()}</b><small>${MONTHS[d.getMonth()]}</small>${em ? `<em>${em}</em>` : ''}</span></label>`;
    }).join('');
  }
  function renderSlots() {
    const d = dayList[selDay];
    const slots = slotsFor(d);
    const past = slots.filter(s => s.past).length;
    $('#slot-hint').textContent = (past ? `Earlier times today have passed. ` : '') + 'You can stay until closing. Quiet slots are under 40% full.';
    $('#slots').innerHTML = slots.filter(s => !s.past).map(s => {
      const dis = s.past || s.left === 0;
      const quiet = !dis && s.fill < .4;
      const lab = s.past ? 'Past' : s.left === 0 ? 'Sold out' : s.free ? (quiet ? 'Free · quiet' : 'Free late') : quiet ? 'Quiet' : s.left <= 20 ? `${s.left} left` : s.fill >= .75 ? 'Busy' : 'Available';
      return `<label class="slot ${quiet ? 'quiet' : ''}"><input type="radio" name="slot" value="${s.m}" ${dis ? 'disabled' : ''} ${selSlot === s.m && !dis ? 'checked' : ''} aria-label="${hm(s.m)}, ${lab}" /><span><b>${hm(s.m)}</b><i style="--fill:${Math.round(s.fill * 100)}%"></i><small>${lab}</small></span></label>`;
    }).join('');
    if (!slots.some(s => s.m === selSlot && !s.past && s.left > 0)) selSlot = null;
  }
  function isFreeSlot() { return selDay != null && selSlot != null && dayList[selDay].getDay() === 4 && selSlot >= 1020; }
  function priceOf(t) { return isFreeSlot() && (t.id === 'adult' || t.id === 'conc') ? 0 : t.price; }
  function renderTypes() {
    const total = Object.values(cart).reduce((a, b) => a + b, 0);
    $('#types').innerHTML = TYPES.map(t => `
      <div class="type">
        <div><b>${t.name} · ${euro(priceOf(t))}${isFreeSlot() && t.price ? ' tonight' : ''}</b>${t.note ? `<small>${t.note}</small>` : ''}</div>
        <div class="step" role="group" aria-label="${t.name} tickets">
          <button type="button" data-t="${t.id}" data-d="-1" aria-label="Remove one ${t.name} ticket" ${cart[t.id] === 0 ? 'disabled' : ''}>−</button>
          <output aria-live="polite" aria-label="${t.name} tickets">${cart[t.id]}</output>
          <button type="button" data-t="${t.id}" data-d="1" aria-label="Add one ${t.name} ticket" ${total >= MAX ? 'disabled' : ''}>+</button>
        </div>
      </div>`).join('');
    $('#member-wrap').hidden = cart.member === 0;
  }
  function renderSum() {
    const lines = [];
    lines.push(['Day', selDay != null ? niceDay(dayList[selDay]) : null]);
    lines.push(['Entry', selSlot != null ? hm(selSlot) + (isFreeSlot() ? ' · free late' : '') : null]);
    let total = 0;
    TYPES.forEach(t => { if (cart[t.id]) { const p = priceOf(t) * cart[t.id]; total += p; lines.push([`${cart[t.id]} × ${t.name}`, euro(p)]); } });
    if (!TYPES.some(t => cart[t.id])) lines.push(['Tickets', null]);
    $('#sum-lines').innerHTML = lines.map(([k, v]) => `<dt>${k}</dt><dd class="${v ? '' : 'none'}">${v || 'Not chosen'}</dd>`).join('');
    $('#sum-total').textContent = total ? '€' + total : '€0';
  }
  function refresh() { renderTypes(); renderSum(); }

  renderDays();
  selDay = dayList.findIndex((d, i) => !$(`input[name="day"][value="${i}"]`).disabled);
  $(`input[name="day"][value="${selDay}"]`).checked = true;
  renderSlots(); refresh();

  $('#days').addEventListener('change', e => { selDay = +e.target.value; renderSlots(); refresh(); clearErr('slot'); });
  $('#slots').addEventListener('change', e => { selSlot = +e.target.value; refresh(); clearErr('slot'); });
  $('#types').addEventListener('click', e => {
    const b = e.target.closest('button[data-t]'); if (!b) return;
    const total = Object.values(cart).reduce((a, c) => a + c, 0), d = +b.dataset.d;
    if (d > 0 && total >= MAX) return;
    cart[b.dataset.t] = Math.max(0, cart[b.dataset.t] + d);
    const focusSel = `button[data-t="${b.dataset.t}"][data-d="${b.dataset.d}"]`;
    refresh(); clearErr('type');
    const again = $(focusSel); (again && !again.disabled ? again : $(`button[data-t="${b.dataset.t}"]:not(:disabled)`))?.focus();
  });
  $('#member-no').addEventListener('input', () => clearErr('member'));

  function setErr(which, msg) {
    const map = { slot: ['#slot-err', '#slots'], type: ['#type-err', '#types'], member: ['#member-err', '#member-no'] };
    const [e, f] = map[which];
    $(e).textContent = msg; $(e).hidden = false;
    $(f).setAttribute('aria-invalid', 'true');
  }
  function clearErr(which) {
    const map = { slot: ['#slot-err', '#slots'], type: ['#type-err', '#types'], member: ['#member-err', '#member-no'] };
    const [e, f] = map[which]; $(e).hidden = true; $(f).removeAttribute('aria-invalid');
  }

  $('#tix-form').addEventListener('submit', e => {
    e.preventDefault();
    const errs = [];
    ['slot', 'type', 'member'].forEach(clearErr);
    if (selSlot == null) { setErr('slot', 'Choose an entry time.'); errs.push(['Choose an entry time', '#slots input:not(:disabled)']); }
    const n = Object.values(cart).reduce((a, b) => a + b, 0);
    if (!n) { setErr('type', 'Add at least one ticket.'); errs.push(['Add at least one ticket', '#types button[data-d="1"]']); }
    else if (cart.u18 && !cart.adult && !cart.conc && !cart.member) { setErr('type', 'Under-16s need to come with an adult. Add an adult, concession or member ticket.'); errs.push(['Add an adult to go with the under-18 ticket', '#types button[data-t="adult"][data-d="1"]']); }
    const mem = $('#member-no').value.trim();
    if (cart.member && !/^OUT-?\d{6}$/i.test(mem)) {
      const msg = mem ? 'Membership numbers look like OUT-123456: OUT then six digits.' : 'Enter your membership number, or remove the member ticket.';
      setErr('member', msg); errs.push([mem ? 'Check the membership number' : 'Enter your membership number', '#member-no']);
    }
    const box = $('#tix-errors');
    if (errs.length) {
      box.innerHTML = `<b>${errs.length === 1 ? 'One thing to fix' : errs.length + ' things to fix'} before booking</b><ul>${errs.map(([t, s]) => `<li><a href="#" data-focus='${s}'>${t}</a></li>`).join('')}</ul>`;
      box.hidden = false; box.focus();
      return;
    }
    box.hidden = true;
    confirmBooking();
  });
  $('#tix-errors').addEventListener('click', e => { const a = e.target.closest('a[data-focus]'); if (!a) return; e.preventDefault(); const el = $(a.dataset.focus); el?.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' }); el?.focus({ preventScroll: true }); });

  /* ---------------- Modal ---------------- */
  const modal = $('#modal'); let lastFocus = null;
  function openModal(html) { lastFocus = document.activeElement; $('#m-inner').innerHTML = html; modal.showModal(); $('#m-title')?.focus(); }
  modal.addEventListener('click', e => { if (e.target === modal || e.target.closest('[data-close]')) modal.close(); });
  modal.addEventListener('close', () => lastFocus?.focus());

  function qr(seed) {
    let s = '', r = 0;
    for (let y = 0; y < 11; y++) for (let x = 0; x < 11; x++) {
      const corner = (x < 3 && y < 3) || (x > 7 && y < 3) || (x < 3 && y > 7);
      r = rand(seed + x * 13 + y);
      if (corner ? !(x % 10 === 1 && y % 10 === 1) && !((x === 9 && y === 1)) && !((x === 1 && y === 9)) : r > .5) s += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
    }
    return `<svg class="qr" viewBox="0 0 11 11" aria-hidden="true" fill="#0d0d0d" shape-rendering="crispEdges">${s}</svg>`;
  }
  function confirmBooking() {
    const code = 'OUT-' + Math.random().toString(36).slice(2, 6).toUpperCase();
    const d = dayList[selDay];
    const people = TYPES.filter(t => cart[t.id]).map(t => `${cart[t.id]} ${t.name.toLowerCase()}`).join(', ');
    const total = TYPES.reduce((a, t) => a + priceOf(t) * cart[t.id], 0);
    openModal(`
      <h2 id="m-title" tabindex="-1">You're booked.</h2>
      <div class="ticket">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px">
          <div><p class="mono" style="color:#a3a29b">Booking code</p><p class="code">${code}</p></div>${qr(code)}
        </div>
        <dl>
          <dt>Day</dt><dd>${niceDay(d)}</dd>
          <dt>Entry</dt><dd>${hm(selSlot)}, stay until ${hm(HOURS[d.getDay()][1])}</dd>
          <dt>Tickets</dt><dd>${people}</dd>
          <dt>Total</dt><dd>${total ? '€' + total : 'Free'}</dd>
        </dl>
      </div>
      <p>Show the code at the Turbine Quay entrance. You can arrive up to 15 minutes after your time.</p>
      <button class="btn btn-ink btn-block" type="button" data-close>Done</button>`);
    // fresh form for the next booking
    Object.keys(cart).forEach(k => cart[k] = 0);
    selSlot = null; $('#member-no').value = '';
    renderSlots(); refresh();
  }

  // Thursday CTA
  $$('[data-thursday]').forEach(a => a.addEventListener('click', () => {
    const i = dayList.findIndex(d => d.getDay() === 4);
    const inp = $(`input[name="day"][value="${i}"]`);
    if (i >= 0 && inp && !inp.disabled) {
      inp.checked = true; selDay = i; selSlot = null; renderSlots();
      const late = $$('#slots input').find(x => +x.value >= 1020 && !x.disabled);
      if (late) { late.checked = true; selSlot = +late.value; }
      refresh();
    }
  }));
})();
