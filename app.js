/* ───────────────────────────────────────
   TrainingVault — app.js
   Handles all pages: index, dashboard, programs
─────────────────────────────────────── */

// ── HELPERS ──────────────────────────────────
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const today = new Date();

function fmtDate(d = today) {
  return d.toLocaleDateString('en-MY', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
  });
}
function fmtShort(d = today) {
  return d.toLocaleDateString('en-MY', { year: 'numeric', month: 'long', day: 'numeric' });
}
function timeAgo(d) {
  const diff = (today - d) / 1000;
  if (diff < 60)   return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400)return `${Math.floor(diff/3600)}h ago`;
  return `${Math.floor(diff/86400)}d ago`;
}

// ── SET DATE EVERYWHERE ───────────────────────
const navDate = $('#navDate');
if (navDate) navDate.textContent = fmtDate();
const footerDate = $('#footerDate');
if (footerDate) footerDate.textContent = fmtShort();
const sessionDate = $('#sessionDate');
if (sessionDate) sessionDate.value = today.toISOString().split('T')[0];

// ── COUNTER ANIMATION ────────────────────────
function animateCount(el, target, duration = 1400) {
  const isFloat = target % 1 !== 0;
  const suffix  = el.dataset.suffix || '';
  const start   = performance.now();
  function step(now) {
    const pct = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - pct, 3);
    const val  = target * ease;
    el.textContent = (isFloat ? val.toFixed(1) : Math.round(val)) + suffix;
    if (pct < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// observe stat cards
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el  = e.target;
      const num = parseFloat(el.dataset.count);
      if (!isNaN(num)) animateCount(el, num);
      observer.unobserve(el);
    }
  });
}, { threshold: .3 });

$$('[data-count]').forEach(el => observer.observe(el));
// also for .stat-num / .kpi-val that have data-count on parent
$$('.stat-card[data-count]').forEach(card => {
  const numEl = card.querySelector('.stat-num');
  if (numEl) {
    numEl.dataset.count  = card.dataset.count;
    numEl.dataset.suffix = card.dataset.suffix || '';
    observer.observe(numEl);
    card.removeAttribute('data-count');
  }
});

// ── SAMPLE DATA ──────────────────────────────
const sampleVideos = [
  { title:'Week 3 — Sprint Intervals',    program:'Marathon Prep', date:'2026-03-30', dur:48, tag:'Endurance', emoji:'🏃' },
  { title:'Upper Body Strength A',        program:'Strength Foundation', date:'2026-03-28', dur:55, tag:'Strength',  emoji:'💪' },
  { title:'HIIT Circuit 12',              program:'HIIT Conditioning', date:'2026-03-27', dur:32, tag:'HIIT',      emoji:'⚡' },
  { title:'Hip Mobility Flow',            program:'Mobility & Recovery', date:'2026-03-26', dur:25, tag:'Mobility',  emoji:'🧘' },
  { title:'Tempo Run — Zone 3',           program:'Marathon Prep', date:'2026-03-25', dur:60, tag:'Endurance', emoji:'🏃' },
  { title:'Deadlift Technique Session',   program:'Strength Foundation', date:'2026-03-24', dur:70, tag:'Strength',  emoji:'💪' },
];

const samplePrograms = [
  { name:'Marathon Prep — 16 Week', cat:'Endurance', desc:'Build aerobic base and race-specific fitness for a sub-4hr marathon.', weeks:16, videos:42, progress:68, color:'#ff6b1a' },
  { name:'Strength Foundation',      cat:'Strength',  desc:'Three-day strength program focused on compound lifts and progressive overload.', weeks:12, videos:31, progress:55, color:'#ff4d6a' },
  { name:'HIIT Conditioning',        cat:'HIIT',      desc:'Eight-week high-intensity conditioning protocol for metabolic fitness.', weeks:8,  videos:19, progress:88, color:'#5599ff' },
  { name:'Mobility & Recovery',      cat:'Mobility',  desc:'Daily mobility flows targeting hip, thoracic, and ankle flexibility.', weeks:6,  videos:28, progress:40, color:'#39d98a' },
  { name:'10K Speed Work',           cat:'Endurance', desc:'Twelve-week plan to break the 45-minute 10K with interval training.', weeks:12, videos:23, progress:22, color:'#ffae70' },
  { name:'Powerlifting Peaking',     cat:'Strength',  desc:'Six-week peaking block leading into a powerlifting competition.', weeks:6,  videos:16, progress:10, color:'#ff4d6a' },
];

// ── INDEX PAGE ───────────────────────────────
const videoGrid = $('#videoGrid');
if (videoGrid) {
  sampleVideos.forEach((v, i) => {
    const d = new Date(v.date);
    const card = document.createElement('div');
    card.className = 'video-card fade-in';
    card.style.animationDelay = `${i * 80}ms`;
    card.innerHTML = `
      <div class="video-thumb">
        <span style="font-size:2.5rem">${v.emoji}</span>
        <span class="video-thumb-overlay">${v.dur}min</span>
      </div>
      <div class="video-info">
        <div class="video-title">${v.title}</div>
        <div class="video-meta">
          <span>${v.program}</span>
          <span>${d.toLocaleDateString('en-MY',{month:'short',day:'numeric'})}</span>
        </div>
        <span class="tag">${v.tag}</span>
      </div>`;
    videoGrid.appendChild(card);
  });
}

// ── DROP ZONE ────────────────────────────────
const dropZone  = $('#dropZone');
const fileInput = $('#fileInput');
const uploadQ   = $('#uploadQueue');
const queueList = $('#queueList');
const uploadBtn = $('#uploadBtn');

if (dropZone) {
  ['dragenter','dragover'].forEach(e => {
    dropZone.addEventListener(e, ev => { ev.preventDefault(); dropZone.classList.add('dragging'); });
  });
  ['dragleave','dragend','drop'].forEach(e => {
    dropZone.addEventListener(e, ev => {
      ev.preventDefault();
      dropZone.classList.remove('dragging');
      if (e === 'drop' && ev.dataTransfer.files.length) handleFiles(ev.dataTransfer.files);
    });
  });
  fileInput.addEventListener('change', () => handleFiles(fileInput.files));
  uploadBtn && uploadBtn.addEventListener('click', () => {
    if (!queueList || queueList.children.length === 0) {
      alert('Please select files to upload first.');
    }
  });
}

function handleFiles(files) {
  if (!uploadQ || !queueList) return;
  uploadQ.style.display = 'block';
  [...files].forEach(file => {
    const item = document.createElement('div');
    item.className = 'queue-item';
    item.innerHTML = `
      <span class="queue-name">${file.name}</span>
      <div class="queue-bar-wrap"><div class="queue-bar" style="width:0%"></div></div>
      <span class="queue-pct">0%</span>`;
    queueList.appendChild(item);
    const bar = item.querySelector('.queue-bar');
    const pct = item.querySelector('.queue-pct');
    let prog = 0;
    const iv = setInterval(() => {
      prog = Math.min(prog + Math.random() * 12, 100);
      bar.style.width = prog + '%';
      pct.textContent = Math.round(prog) + '%';
      if (prog >= 100) { clearInterval(iv); pct.textContent = '✓'; pct.style.color = 'var(--green)'; }
    }, 180);
  });
}

// ── DASHBOARD PAGE ───────────────────────────
const barChart  = $('#barChart');
const barLabels = $('#barLabels');
const donutSvg  = $('#donutSvg');
const legend    = $('#legend');
const calGrid   = $('#calGrid');
const calMonths = $('#calMonths');
const calYear   = $('#calYear');
const pipeline  = $('#pipeline');
const feed      = $('#activityFeed');

if (barChart) buildBarChart();
if (donutSvg)  buildDonut();
if (calGrid)   buildCalendar();
if (pipeline)  buildPipeline();
if (feed)      buildFeed();

function buildBarChart() {
  const weeks = ['W45','W46','W47','W48','W49','W50','W51','W52'];
  const vals  = [12, 18, 9, 22, 15, 28, 19, 31];
  const max   = Math.max(...vals);
  weeks.forEach((w, i) => {
    const col = document.createElement('div');
    col.className = 'bar-col';
    col.title = `${vals[i]} uploads`;
    col.style.height = '0px';
    barChart.appendChild(col);
    setTimeout(() => { col.style.height = (vals[i] / max * 150) + 'px'; }, 100 + i * 60);

    const lbl = document.createElement('div');
    lbl.className = 'bar-lbl';
    lbl.textContent = w;
    barLabels.appendChild(lbl);
  });
}

function buildDonut() {
  const data = [
    { label:'Endurance', pct:35, color:'#ff6b1a' },
    { label:'Strength',  pct:28, color:'#ff4d6a' },
    { label:'HIIT',      pct:20, color:'#5599ff' },
    { label:'Mobility',  pct:17, color:'#39d98a' },
  ];
  const cx=100, cy=100, r=70, stroke=24;
  let offset = 0;
  const circumference = 2 * Math.PI * r;
  data.forEach(d => {
    const dash = circumference * d.pct / 100;
    const circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', r);
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', d.color);
    circle.setAttribute('stroke-width', stroke);
    circle.setAttribute('stroke-dasharray', `${dash} ${circumference - dash}`);
    circle.setAttribute('stroke-dashoffset', -offset * circumference / 100);
    circle.setAttribute('stroke-linecap', 'butt');
    donutSvg.appendChild(circle);
    offset += d.pct;

    const item = document.createElement('div');
    item.className = 'leg-item';
    item.innerHTML = `
      <span class="leg-dot" style="background:${d.color}"></span>
      <span>${d.label}</span>
      <span class="leg-pct">${d.pct}%</span>`;
    legend.appendChild(item);
  });
}

function buildCalendar() {
  const year = today.getFullYear();
  calYear.textContent = year;
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  months.forEach(m => {
    const lbl = document.createElement('span');
    lbl.className = 'cal-month-lbl';
    lbl.textContent = m;
    calMonths.appendChild(lbl);
  });

  const startOfYear = new Date(year, 0, 1);
  const startDay    = startOfYear.getDay();
  const totalDays   = (new Date(year, 11, 31) - startOfYear) / 86400000 + 1;
  const totalCells  = startDay + totalDays;
  const weeks       = Math.ceil(totalCells / 7);

  for (let w = 0; w < weeks; w++) {
    const col = document.createElement('div');
    col.className = 'cal-week';
    for (let d = 0; d < 7; d++) {
      const dayIndex = w * 7 + d - startDay;
      const cell = document.createElement('div');
      cell.className = 'cal-day';
      if (dayIndex >= 0 && dayIndex < totalDays) {
        const date = new Date(year, 0, dayIndex + 1);
        if (date <= today) {
          const level = date.getDay() === 0 || date.getDay() === 6 ? 0 :
                        Math.random() < 0.3 ? 0 :
                        Math.floor(Math.random() * 4) + 1;
          cell.setAttribute('data-l', level);
        }
      } else {
        cell.style.visibility = 'hidden';
      }
      col.appendChild(cell);
    }
    calGrid.appendChild(col);
  }
}

function buildPipeline() {
  const steps = [
    { name:'Checkout',   time:'0.4s',  status:'ok',   statusLabel:'✓ Passed' },
    { name:'Lint',       time:'8.2s',  status:'ok',   statusLabel:'✓ Passed' },
    { name:'Test',       time:'24.1s', status:'ok',   statusLabel:'✓ Passed' },
    { name:'Build',      time:'41.7s', status:'ok',   statusLabel:'✓ Passed' },
    { name:'Deploy',     time:'12.3s', status:'ok',   statusLabel:'✓ Deployed'},
    { name:'Monitor',    time:'—',     status:'run',  statusLabel:'● Watching'},
  ];
  steps.forEach((s, i) => {
    const step = document.createElement('div');
    step.className = 'pipe-step';
    step.innerHTML = `
      <div class="pipe-box">
        <div class="pipe-name">${s.name}</div>
        <div class="pipe-time">${s.time}</div>
        <div class="pipe-status ${s.status}">${s.statusLabel}</div>
      </div>`;
    pipeline.appendChild(step);
    if (i < steps.length - 1) {
      const arr = document.createElement('div');
      arr.className = 'pipe-arrow';
      pipeline.appendChild(arr);
    }
  });
}

function buildFeed() {
  const activities = [
    { type:'upload', icon:'⬆', desc:'<b>Sprint_Intervals_W3.mp4</b> uploaded to Marathon Prep', time: new Date(today - 1000*60*18) },
    { type:'ci',     icon:'✓', desc:'GitHub Actions deploy <b>#142</b> completed successfully', time: new Date(today - 1000*60*42) },
    { type:'upload', icon:'⬆', desc:'<b>Upper_Body_Strength_A.mp4</b> uploaded to Strength Foundation', time: new Date(today - 1000*3600*3) },
    { type:'create', icon:'+', desc:'New program <b>Powerlifting Peaking</b> created', time: new Date(today - 1000*3600*7) },
    { type:'ci',     icon:'✓', desc:'GitHub Actions deploy <b>#141</b> completed successfully', time: new Date(today - 1000*3600*11) },
    { type:'upload', icon:'⬆', desc:'<b>HIIT_Circuit_12.mp4</b> uploaded to HIIT Conditioning', time: new Date(today - 1000*3600*24) },
  ];
  activities.forEach(a => {
    const item = document.createElement('div');
    item.className = 'act-item';
    item.innerHTML = `
      <div class="act-icon ${a.type}">${a.icon}</div>
      <div class="act-desc">${a.desc}</div>
      <div class="act-time">${timeAgo(a.time)}</div>`;
    feed.appendChild(item);
  });
}

// ── PROGRAMS PAGE ────────────────────────────
const programsGrid  = $('#programsGrid');
const newProgramBtn = $('#newProgramBtn');
const modalOverlay  = $('#modalOverlay');
const modalCancel   = $('#modalCancel');
const modalSave     = $('#modalSave');
const filterBtns    = $$('.filter-btn');

let programs = [...samplePrograms];

if (programsGrid) renderPrograms('all');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderPrograms(btn.dataset.filter);
  });
});

function renderPrograms(filter) {
  if (!programsGrid) return;
  programsGrid.innerHTML = '';
  const filtered = filter === 'all' ? programs : programs.filter(p => p.cat === filter);
  filtered.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'prog-card fade-in';
    card.style.animationDelay = `${i * 60}ms`;
    card.innerHTML = `
      <div class="prog-card-accent" style="background:${p.color}"></div>
      <div class="prog-cat">${p.cat}</div>
      <div class="prog-name">${p.name}</div>
      <div class="prog-desc">${p.desc}</div>
      <div class="prog-meta">
        <div class="prog-meta-item">
          <span class="prog-meta-val">${p.weeks}</span>
          <span class="prog-meta-lbl">Weeks</span>
        </div>
        <div class="prog-meta-item">
          <span class="prog-meta-val">${p.videos}</span>
          <span class="prog-meta-lbl">Videos</span>
        </div>
        <div class="prog-meta-item">
          <span class="prog-meta-val">${p.progress}%</span>
          <span class="prog-meta-lbl">Complete</span>
        </div>
      </div>
      <div class="prog-progress-wrap">
        <div class="prog-progress-bar" style="width:0%;background:${p.color}" data-target="${p.progress}"></div>
      </div>`;
    programsGrid.appendChild(card);
    setTimeout(() => {
      const bar = card.querySelector('.prog-progress-bar');
      if (bar) bar.style.width = bar.dataset.target + '%';
    }, 200 + i * 60);
  });
}

if (newProgramBtn) {
  newProgramBtn.addEventListener('click', () => { modalOverlay.classList.add('open'); });
}
if (modalCancel) {
  modalCancel.addEventListener('click', () => { modalOverlay.classList.remove('open'); });
}
modalOverlay && modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) modalOverlay.classList.remove('open');
});
if (modalSave) {
  modalSave.addEventListener('click', () => {
    const name  = $('#progName')?.value.trim();
    const weeks = parseInt($('#progWeeks')?.value || 12);
    const cat   = $('#progCat')?.value || 'Endurance';
    const desc  = $('#progDesc')?.value.trim() || 'New training program.';
    if (!name) { alert('Please enter a program name.'); return; }
    const colors = { Endurance:'#ff6b1a', Strength:'#ff4d6a', HIIT:'#5599ff', Mobility:'#39d98a', 'Sport-Specific':'#ffae70' };
    programs.unshift({ name, cat, desc, weeks, videos:0, progress:0, color: colors[cat] || '#ff6b1a' });
    renderPrograms($('.filter-btn.active')?.dataset.filter || 'all');
    modalOverlay.classList.remove('open');
    ['#progName','#progWeeks','#progDesc'].forEach(s => { const el = $(s); if (el) el.value = ''; });
  });
}
