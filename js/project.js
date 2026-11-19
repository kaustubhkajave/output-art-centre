/* OUTPUT project hub: heatmap table + phase nav */
(() => {
  // Illustrative entries per hour (Tue–Sun, 10:00–20:00). Monday closed.
  const days = ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  const data = {
    Tue: [22, 38, 64, 71, 58, 44, 30, 0, 0, 0, 0],
    Wed: [25, 41, 69, 74, 62, 47, 33, 0, 0, 0, 0],
    Thu: [24, 40, 66, 70, 60, 52, 61, 118, 132, 96, 54],
    Fri: [30, 52, 81, 88, 79, 66, 49, 0, 0, 0, 0],
    Sat: [48, 96, 162, 188, 181, 154, 98, 0, 0, 0, 0],
    Sun: [41, 88, 151, 176, 169, 132, 72, 0, 0, 0, 0],
  };
  const max = 188;
  const t = document.getElementById('heat');
  let html = '<caption class="sr-only">Average entries per hour by day. Monday closed. Only Thursday opens after 17:00.</caption><thead><tr><td></td>' + hours.map(h => `<th scope="col">${h}:00</th>`).join('') + '</tr></thead><tbody>';
  days.forEach(d => {
    html += `<tr><th scope="row">${d}</th>`;
    data[d].forEach((v, i) => {
      const closed = v === 0 && hours[i] >= 17;
      if (closed) { html += '<td class="closed"><span class="sr-only">Closed</span></td>'; return; }
      // five fixed steps so every cell's text passes AA (paper text up to step 3, ink text from step 4)
      const r = v / max, steps = [.08, .2, .32, .7, 1], s = Math.min(4, Math.floor(r * 5));
      html += `<td style="--a:${steps[s]}" class="${s >= 3 ? 'hi' : ''}">${v}</td>`;
    });
    html += '</tr>';
  });
  t.innerHTML = html + '</tbody>';

  // mobile task table labels
  document.querySelectorAll('.tasks tbody tr').forEach(tr => tr.querySelectorAll('td').forEach((td, i) => td.dataset.r = i + 1));

  // phase nav: aria-current for the section in view, keep it scrolled into view
  const links = [...document.querySelectorAll('#phase-nav a')];
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    links.forEach(a => {
      const on = a.getAttribute('href') === '#' + e.target.id;
      if (on) { a.setAttribute('aria-current', 'location'); a.scrollIntoView({ inline: 'nearest', block: 'nearest' }); }
      else a.removeAttribute('aria-current');
    });
  }), { rootMargin: '-40% 0px -55% 0px' });
  links.forEach(a => { const s = document.querySelector(a.getAttribute('href')); if (s) io.observe(s); });
})();
