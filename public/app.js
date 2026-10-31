// ---------- ข้อความสองภาษา ----------
const I18N = {
  th: {
    brand: 'Song Finder', marketTh: 'เพลงไทย', marketIntl: 'สากล',
    tabHits: 'เพลงฮิต', tabGenres: 'แนวเพลง', tabSearch: 'ค้นหา', tabAi: 'AI ช่วยหาเพลง', tabAbout: 'เกี่ยวกับ',
    hitsTitle: 'เพลงฮิตตอนนี้', genresTitle: 'เลือกแนวเพลง', searchTitle: 'ค้นหาเพลง / ศิลปิน',
    searchPh: 'พิมพ์ชื่อเพลงหรือศิลปิน', searchBtn: 'ค้นหา',
    aiTitle: 'ให้ AI ช่วยหาเพลง',
    aiDesc: 'พิมพ์อารมณ์ แนวเพลง ชื่อเพลง เนื้อเพลงบางส่วน หรืออธิบายทำนองเป็นคำพูด (ฮัมเสียงยังไม่รองรับ)',
    aiPh: 'เช่น เพลงเศร้าๆ ฟังตอนฝนตก', aiModels: 'เลือกโมเดลที่จะเปรียบเทียบ:', aiBtn: 'ค้นหาด้วย AI',
    mockBanner: '⚠️ ยังไม่ได้ใส่ API key — ตอนนี้เป็น "โหมดจำลอง" (คำตอบ AI เป็นข้อมูลตัวอย่าง) ใส่ key ในไฟล์ .env เพื่อใช้ AI จริง',
    aboutTitle: 'เกี่ยวกับโปรเจ็กต์ (DEMO)',
    loading: 'กำลังโหลด…', empty: 'ไม่พบผลลัพธ์', noPreview: 'เพลงนี้ไม่มีตัวอย่างเสียง', openLink: 'ฟังเต็มบน Apple Music ↗',
    verified: 'ตรวจแล้วว่ามีจริง', noMatch: 'AI ไม่พบเพลงที่ตรงกับคำค้น (ดูแหล่งอ้างอิงด้านล่างว่าค้นเจออะไร)', searched: 'ค้นเว็บด้วยคำว่า',
    topSearchPh: 'ค้นหาเพลงหรือศิลปิน', hitsLede: 'อันดับเพลงยอดนิยมจาก Apple Music ตามตลาดที่เลือก กดที่ปกเพื่อฟังตัวอย่าง 30 วินาที',
    npIdle: 'ยังไม่ได้เลือกเพลง กดที่ปกเพื่อฟังตัวอย่าง', npNote: 'ตัวอย่าง 30 วินาที', themeTitle: 'สลับธีมมืด / สว่าง',
    railNote: 'ข้อมูลเพลงจาก iTunes Search API', cannotPlay: 'เล่นตัวอย่างนี้ไม่ได้ ลองกดอีกครั้ง',
    micTitle: 'พูดเพื่อค้นหา (กดอีกครั้งเพื่อหยุด)', micDenied: 'ไม่ได้รับอนุญาตให้ใช้ไมโครโฟน กดไอคอนแม่กุญแจข้างช่อง URL แล้วอนุญาต',
    micNoSpeech: 'ไม่ได้ยินเสียงพูด ลองอีกครั้ง', micNoDevice: 'ไม่พบไมโครโฟน', micNet: 'เชื่อมต่อบริการแปลงเสียงไม่ได้ (ต้องต่ออินเทอร์เน็ต)', micErr: 'ใช้ไมค์ไม่ได้:',
    emptyGenre: 'ยังไม่พบเพลงแนวนี้ในหมวดที่เลือก ลองสลับ "เพลงไทย/สากล" ด้านบน หรือเพิ่มชื่อศิลปินของแนวนี้ใน server.js',
    autoLabel: '✨ Auto (แนะนำ · ประหยัดโควตา)', autoHint: 'ให้ระบบเลือกโมเดลตามภาษาของคำค้น และถามทีละตัวจนกว่าจะเจอเพลง',
    route: 'ลำดับที่ระบบลอง', consensusTitle: '🏆 เพลงที่โมเดลตอบตรงกัน', agree: 'ตรงกัน', modelsWord: 'โมเดล',
    noConsensus: 'ยังไม่มีเพลงที่โมเดลมากกว่าหนึ่งตัวตอบตรงกัน', unverified: 'ยังตรวจกับ iTunes ไม่ได้ (เชื่อมต่อขัดข้อง/ถูกจำกัด) จึงยังไม่รู้ว่ามีจริงหรือไม่', dropped: 'ตัดทิ้ง (ตรวจไม่พบในฐานข้อมูล — อาจเป็นเพลงที่ AI แต่งขึ้น):',
    sec: 'วิ', noSongs: 'ไม่มีเพลงที่ผ่านการตรวจสอบ', noKey: 'ไม่มี key',
    examples: ['เพลงเศร้าๆ ฟังตอนฝนตก', 'เพลงสนุกๆ เปิดตอนขับรถเที่ยว', 'เพลงเนื้อร้องประมาณว่าคิดถึงคนที่จากไป', 'ทำนองช้าๆ เริ่มด้วยเปียโน เสียงผู้หญิง', 'upbeat songs for studying'],
    about: `
      <h3>เว็บนี้ทำอะไรได้</h3>
      <ul><li>แสดงเพลงฮิต แนะนำตามแนวเพลง และค้นหาด้วยชื่อเพลง/ศิลปิน (ข้อมูลจาก iTunes Search API)</li>
      <li>AI ช่วยหาเพลงจากอารมณ์ / เนื้อเพลงบางส่วน / คำอธิบายทำนอง และเปรียบเทียบหลายโมเดลคู่กัน</li></ul>
      <h3>จุดเด่น: ป้องกัน AI "เดามั่ว"</h3>
      <ul><li>ทุกเพลงที่ AI แนะนำจะถูกตรวจกับ iTunes ก่อนแสดงผล เพลงที่ไม่พบจะถูกตัดทิ้งและแจ้งให้ทราบ</li></ul>
      <h3>ข้อจำกัด</h3>
      <ul><li>ไม่รองรับการฮัมเสียง/อัดเสียงเพื่อหาเพลง (ต้องใช้ audio fingerprinting) — รองรับเฉพาะ "อธิบายทำนองเป็นคำพูด" ซึ่งความแม่นยำต่ำกว่า</li>
      <li>ไม่แสดงเนื้อเพลงเต็ม (ลิขสิทธิ์) และเล่นได้เฉพาะตัวอย่าง 30 วินาที</li>
      <li>ปุ่มไมค์ใช้ได้เฉพาะ Chrome/Edge และเสียงจะถูกส่งไปแปลงเป็นข้อความที่บริการของผู้ผลิตเบราว์เซอร์ (เป็นการพูดแทนการพิมพ์ ไม่ใช่การฮัมให้เดาเพลง)</li>
      <li>AI ฟรีมีโควตา/ความเร็วจำกัด และรายชื่อโมเดลฟรีเปลี่ยนได้ตลอด</li>
      <li>เพลงไทยเก่าๆ หรือเพลงเฉพาะกลุ่มอาจไม่มีใน iTunes จึงอาจถูกตัดทิ้ง</li></ul>`,
  },
  en: {
    brand: 'Song Finder', marketTh: 'Thai', marketIntl: 'International',
    tabHits: 'Hits', tabGenres: 'Genres', tabSearch: 'Search', tabAi: 'AI Finder', tabAbout: 'About',
    hitsTitle: 'Trending now', genresTitle: 'Pick a genre', searchTitle: 'Search songs / artists',
    searchPh: 'Type a song or artist', searchBtn: 'Search',
    aiTitle: 'Let AI find your song',
    aiDesc: 'Describe a mood, genre, title, part of the lyrics, or describe the melody in words (humming is not supported)',
    aiPh: 'e.g. sad songs for a rainy day', aiModels: 'Models to compare:', aiBtn: 'Find with AI',
    mockBanner: '⚠️ No API key yet — running in "mock mode" (AI answers are sample data). Add keys to .env for real AI.',
    aboutTitle: 'About this project (DEMO)',
    loading: 'Loading…', empty: 'No results', noPreview: 'No preview available', openLink: 'Full song on Apple Music ↗',
    verified: 'verified real', noMatch: 'The AI found no matching song (see the sources below for what the search returned)', searched: 'Searched the web for',
    topSearchPh: 'Search songs or artists', hitsLede: 'Top songs from Apple Music for the selected market. Press a cover to hear a 30-second preview.',
    npIdle: 'Nothing playing. Press a cover to preview a song', npNote: '30-second preview', themeTitle: 'Switch light / dark theme',
    railNote: 'Song data from the iTunes Search API', cannotPlay: 'Cannot play this preview. Try again',
    micTitle: 'Speak to search (click again to stop)', micDenied: 'Microphone permission denied. Click the padlock next to the URL and allow it',
    micNoSpeech: 'No speech heard, try again', micNoDevice: 'No microphone found', micNet: 'Cannot reach the speech service (internet required)', micErr: 'Microphone error:',
    emptyGenre: 'No songs found for this genre in the selected market. Try switching Thai / International above, or add artists for this genre in server.js',
    autoLabel: '✨ Auto (recommended · saves quota)', autoHint: 'The app picks models by the language of your query and asks one at a time until a song is found',
    route: 'Order tried', consensusTitle: '🏆 Songs several models agree on', agree: 'Agreed by', modelsWord: 'models',
    noConsensus: 'No song was returned by more than one model', unverified: 'Could not be checked against iTunes (connection error / rate limit), so unknown whether it exists', dropped: 'Dropped (not found in the database — possibly invented by the AI):',
    sec: 's', noSongs: 'No verified songs', noKey: 'no key',
    examples: ['sad songs for a rainy day', 'fun road trip songs', 'a song about missing someone who left', 'slow melody starting with piano, female vocal', 'เพลงอินดี้ไทยฟังสบายๆ'],
    about: `
      <h3>What it does</h3>
      <ul><li>Trending songs, genre recommendations and search by song/artist (data from the iTunes Search API)</li>
      <li>AI song finder from a mood, lyric fragment or melody description, comparing several models side by side</li></ul>
      <h3>Highlight: guarding against AI hallucination</h3>
      <ul><li>Every AI suggestion is checked against iTunes before it is shown; unverified songs are dropped and reported.</li></ul>
      <h3>Limitations</h3>
      <ul><li>No humming/recording search (needs audio fingerprinting) — only melody described in words, which is less accurate</li>
      <li>No full lyrics (copyright); only 30-second previews</li>
      <li>The mic button works in Chrome/Edge only, and the audio is sent to the browser vendor's speech service for transcription (voice typing, not humming to identify a song)</li>
      <li>Free AI tiers have quotas and speed limits, and the free model list changes often</li>
      <li>Older or niche Thai songs may be missing from iTunes and get dropped</li></ul>`,
  },
};

// ---------- สถานะ ----------
const state = { auto: true, lang: 'th', market: 'TH', tab: 'hits', genre: null, genres: [], models: [], mock: true, picked: new Set() };
const $ = (s) => document.querySelector(s);
const t = (k) => I18N[state.lang][k];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function api(url, opts) {
  const res = await fetch(url, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg; el.hidden = false;
  clearTimeout(toast.t); toast.t = setTimeout(() => (el.hidden = true), 4000);
}

// ---------- เครื่องเล่นตัวอย่างเสียง (เล่นทีละเพลง) + แถบเล่นเพลงด้านล่าง ----------
const audio = new Audio();
let curSrc = '';
const fmtTime = (s) => { s = Math.max(0, Math.floor(s || 0)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
const isPlaying = (src) => Boolean(src) && src === curSrc && !audio.paused;
function syncPlayUi() {
  document.querySelectorAll('.play[data-src]').forEach((b) => {
    const on = isPlaying(b.dataset.src);
    b.textContent = on ? '⏸' : '▶';
    b.closest('.card, .trow, .mini')?.classList.toggle('is-playing', on);
  });
  $('#npToggle').textContent = audio.paused ? '▶' : '⏸';
  $('#npDisc').classList.toggle('spin', !audio.paused);
  $('#deck').classList.toggle('playing', !audio.paused);
}
function setProgress(p) {
  $('#npBar').style.width = p + '%';
  $('#deck').style.setProperty('--p', p + '%');
}
['play', 'pause', 'ended'].forEach((ev) => audio.addEventListener(ev, syncPlayUi));
audio.addEventListener('timeupdate', () => {
  setProgress(Math.min(100, (audio.currentTime / (audio.duration || 30)) * 100));
  $('#npTime').textContent = `${fmtTime(audio.currentTime)} / ${fmtTime(audio.duration || 30)}`;
});
audio.addEventListener('ended', () => { setProgress(0); $('#npTime').textContent = `0:00 / ${fmtTime(audio.duration || 30)}`; });
function startTrack(d) {
  curSrc = d.src; audio.src = d.src;
  $('#npTitle').textContent = d.title; $('#npArtist').textContent = d.artist;
  const img = $('#npArt');
  if (d.art) img.src = d.art; else img.removeAttribute('src');
  setProgress(0);
  audio.play().catch(() => toast(t('cannotPlay')));
}
function togglePlay() {
  if (!curSrc) return;
  if (audio.paused) audio.play().catch(() => toast(t('cannotPlay'))); else audio.pause();
}
document.addEventListener('click', (e) => {
  const b = e.target.closest('.play');
  if (!b || b.disabled || !b.dataset.src) return;
  if (b.dataset.src === curSrc) togglePlay(); else startTrack(b.dataset);
});
$('#npToggle').addEventListener('click', togglePlay);
$('#npTrack').addEventListener('click', (e) => {
  if (!curSrc || !Number.isFinite(audio.duration)) return;
  const r = e.currentTarget.getBoundingClientRect();
  audio.currentTime = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * audio.duration;
});

// ---------- สร้างการ์ดเพลง ----------
function playBtn(s) {
  if (!s.previewUrl) return `<button class="play" disabled title="${esc(t('noPreview'))}" aria-label="${esc(t('noPreview'))}">▶</button>`;
  return `<button class="play" data-src="${esc(s.previewUrl)}" data-title="${esc(s.title)}" data-artist="${esc(s.artist)}" data-art="${esc(s.artwork || '')}" aria-label="play ${esc(s.title)}">${isPlaying(s.previewUrl) ? '⏸' : '▶'}</button>`;
}
function card(s, rank) {
  return `<div class="card ${isPlaying(s.previewUrl) ? 'is-playing' : ''}">
    <div class="art">${s.artwork ? `<img loading="lazy" src="${esc(s.artwork)}" alt="">` : ''}
      ${rank ? `<span class="rank">#${rank}</span>` : ''}${playBtn(s)}</div>
    <div class="title">${esc(s.title)}</div><div class="artist">${esc(s.artist)}</div>
    ${s.genre ? `<div class="tag" title="iTunes genre">${esc(s.genre)}</div>` : ''}
    ${s.reason ? `<div class="reason">💡 ${esc(s.reason)}</div>` : ''}
    ${s.link ? `<a href="${esc(s.link)}" target="_blank" rel="noopener">${esc(t('openLink'))}</a>` : ''}
  </div>`;
}
function mini(s) {
  return `<div class="mini ${isPlaying(s.previewUrl) ? 'is-playing' : ''}"><div class="art">${s.artwork ? `<img src="${esc(s.artwork)}" alt="">` : ''}${playBtn(s)}</div>
    <div><div class="title">${esc(s.title)}</div><div class="artist">${esc(s.artist)}</div>
    ${s.reason ? `<div class="reason">💡 ${esc(s.reason)}</div>` : ''}
    ${s.unverified ? `<div class="reason" style="color:var(--warn)">⚠ ${esc(t('unverified'))}</div>` : ''}</div></div>`;
}
function renderGrid(el, songs, ranked) {
  el.innerHTML = songs.length ? songs.map((s, i) => card(s, ranked ? i + 1 : 0)).join('') : `<div class="empty">${esc(t('empty'))}</div>`;
}
// ตารางอันดับ: ใช้กับหน้าเพลงฮิต (ลำดับเป็นข้อมูลจริง จึงมีเลขกำกับ)
function chartRow(s, i) {
  return `<div class="trow ${isPlaying(s.previewUrl) ? 'is-playing' : ''}">
    <span class="rank">${i + 1}</span>
    <div class="tart">${s.artwork ? `<img loading="lazy" src="${esc(s.artwork)}" alt="">` : ''}${playBtn(s)}</div>
    <div class="tmeta"><div class="title">${esc(s.title)}</div><div class="artist">${esc(s.artist)}</div></div>
    ${s.genre ? `<span class="tag" title="iTunes genre">${esc(s.genre)}</span>` : '<span></span>'}
    ${s.link ? `<a class="tlink" href="${esc(s.link)}" target="_blank" rel="noopener">${esc(t('openLink'))}</a>` : '<span></span>'}
  </div>`;
}
function renderChart(el, songs) {
  el.innerHTML = songs.length ? songs.map(chartRow).join('') : `<div class="empty">${esc(t('empty'))}</div>`;
}

// ---------- แต่ละแท็บ ----------
async function loadHits() {
  const el = $('#hitsGrid'); el.innerHTML = `<div class="loading">${esc(t('loading'))}</div>`;
  try { renderChart(el, await api(`/api/hits?market=${state.market}`)); } catch (e) { el.innerHTML = ''; toast(e.message); }
}
function renderGenreChips() {
  $('#genreChips').innerHTML = state.genres.map((g) =>
    `<button class="chip ${state.genre === g.id ? 'on' : ''}" data-genre="${g.id}">${esc(g[state.lang])}</button>`).join('');
}
async function loadGenre() {
  if (!state.genre) return;
  const el = $('#genreGrid'); el.innerHTML = `<div class="loading">${esc(t('loading'))}</div>`;
  try {
    const songs = await api(`/api/genre?id=${state.genre}&market=${state.market}`);
    if (songs.length) renderGrid(el, songs);
    else el.innerHTML = `<div class="empty">${esc(t('emptyGenre'))}</div>`;
  } catch (e) { el.innerHTML = ''; toast(e.message); }
}
async function doSearch(q) {
  const el = $('#searchGrid'); if (!q) { el.innerHTML = ''; return; }
  el.innerHTML = `<div class="loading">${esc(t('loading'))}</div>`;
  try { renderGrid(el, await api(`/api/search?q=${encodeURIComponent(q)}&market=${state.market}`)); } catch (e) { el.innerHTML = ''; toast(e.message); }
}

function renderModelChecks() {
  const auto = `<label class="chip ${state.auto ? 'on' : ''}" title="${esc(t('autoHint'))}"><input type="checkbox" data-auto ${state.auto ? 'checked' : ''}>${esc(t('autoLabel'))}</label>`;
  const list = state.models.map((m) => {
    const hasKey = state.mock || m.available;
    const usable = hasKey && !state.auto; // เปิด Auto อยู่ = ปิดการเลือกโมเดลเอง (ติ๊ก Auto ออกเพื่อเทียบหลายโมเดล)
    return `<label class="chip ${usable ? '' : 'off'}"><input type="checkbox" data-model="${esc(m.key)}" ${state.picked.has(m.key) ? 'checked' : ''} ${usable ? '' : 'disabled'}>${esc(m.label)}${hasKey ? '' : ` <small>(${esc(t('noKey'))})</small>`}</label>`;
  }).join('');
  $('#modelChecks').innerHTML = auto + list;
}

// เพลงที่โมเดลมากกว่าหนึ่งตัวตอบตรงกัน (เฉพาะเพลงที่ตรวจกับ iTunes แล้ว)
function consensusHtml(results) {
  const ok = results.filter((r) => r.ok);
  if (ok.length < 2) return '';
  const map = new Map();
  for (const r of ok) {
    const seenKeys = new Set();
    for (const s of r.songs.filter((x) => !x.unverified)) {
      const k = `${s.title.toLowerCase().replace(/\(.*?\)|\[.*?\]/g, '').trim()}|${s.artist.toLowerCase()}`;
      if (seenKeys.has(k)) continue;
      seenKeys.add(k);
      const e = map.get(k) || { song: s, models: [] };
      e.models.push(r.label);
      map.set(k, e);
    }
  }
  const top = [...map.values()].filter((e) => e.models.length >= 2).sort((a, b) => b.models.length - a.models.length).slice(0, 3);
  const body = top.length
    ? top.map((e) => `${mini({ ...e.song, reason: '' })}<div class="meta" style="margin:-6px 0 12px 74px"><span class="ok">${esc(t('agree'))} ${e.models.length}/${ok.length} ${esc(t('modelsWord'))}</span> (${e.models.map(esc).join(', ')})</div>`).join('')
    : `<div class="empty">${esc(t('noConsensus'))}</div>`;
  return `<div class="col consensus"><h3>${esc(t('consensusTitle'))}</h3>${body}</div>`;
}
function renderExamples() {
  $('#aiExamples').innerHTML = t('examples').map((x) => `<button class="chip" data-ex="${esc(x)}">${esc(x)}</button>`).join('');
}
async function loadModels() {
  const { mock, models } = await api('/api/ai/models');
  state.mock = mock; state.models = models;
  // ค่าเริ่มต้น: เลือกโมเดลแรกของแต่ละเจ้า (กระจายโควตา ไม่ให้เจ้าเดียวโดนจำกัด)
  const seen = new Set();
  state.picked = new Set(
    models.filter((m) => mock || m.available).filter((m) => (seen.has(m.provider) ? false : seen.add(m.provider))).map((m) => m.key)
  );
  $('#mockBanner').hidden = !mock;
  renderModelChecks();
}
async function runAi() {
  const query = $('#aiInput').value.trim();
  if (!query) return toast(t('aiPh'));
  const btn = $('#aiGo'); btn.disabled = true;
  const out = $('#aiResults'); out.innerHTML = `<div class="loading">${esc(t('loading'))}</div>`;
  try {
    const data = await api('/api/ai/find', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, market: state.market, models: [...state.picked], auto: state.auto }),
    });
    const icon = { ok: '✓', empty: '○', error: '✗' };
    out.innerHTML = consensusHtml(data.results) + data.results.map((r) => `<div class="col">
      <h3>${esc(r.label)}${r.routed ? ` → ${esc(r.routed)}` : ''}</h3>
      ${r.trace ? `<div class="meta">🧭 ${esc(t('route'))}: ${r.trace.map((x) => `${icon[x.status]} ${esc(x.label)} (${(x.ms / 1000).toFixed(1)} ${esc(t('sec'))})`).join(' → ')}</div>` : ''}
      <div class="meta">${r.ok ? `<span class="ok">✓ ${r.songs.filter((s) => !s.unverified).length} ${esc(t('verified'))}</span>` : '<span class="bad">✗ error</span>'} · ${(r.ms / 1000).toFixed(1)} ${esc(t('sec'))}</div>
      ${r.ok ? (r.songs.length ? r.songs.map(mini).join('') : `<div class="empty">${esc(t(r.noMatch ? 'noMatch' : 'noSongs'))}</div>`) : `<div class="err">${esc(r.error)}</div>`}
      ${r.queries?.length ? `<div class="meta">🔎 ${esc(t('searched'))}: ${r.queries.map(esc).join(' · ')}</div>` : ''}
      ${r.sources?.length ? `<div class="meta">${r.sources.map((s) => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)}</a>`).join(' · ')}</div>` : ''}
      ${r.rejected.length ?`<div class="rej">⚠ ${esc(t('dropped'))}<br>${r.rejected.map(esc).join('<br>')}</div>` : ''}
    </div>`).join('');
  } catch (e) { out.innerHTML = ''; toast(e.message); }
  btn.disabled = false;
}

// ---------- ภาษา / แท็บ ----------
function applyLang() {
  document.documentElement.lang = state.lang;
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n) ?? el.textContent; });
  document.querySelectorAll('[data-i18n-ph]').forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
  $('#aboutBody').innerHTML = t('about');
  document.querySelectorAll('#langSeg button').forEach((b) => b.classList.toggle('on', b.dataset.lang === state.lang));
  renderGenreChips(); renderExamples(); renderModelChecks();
  state.micLang = state.lang === 'th' ? 'th-TH' : 'en-US';
  document.querySelectorAll('.micLang').forEach((s) => { s.value = state.micLang; });
  document.querySelectorAll('.mic').forEach((b) => { b.title = t('micTitle'); });
  $('#themeBtn').title = t('themeTitle');
  if (!curSrc) { $('#npTitle').textContent = t('npIdle'); $('#npArtist').textContent = ''; }
}
function showTab(name) {
  state.tab = name;
  $('.stage').scrollTo(0, 0); window.scrollTo(0, 0);
  document.querySelectorAll('#tabs button').forEach((b) => b.classList.toggle('on', b.dataset.tab === name));
  document.querySelectorAll('.panel').forEach((p) => (p.hidden = p.id !== `tab-${name}`));
  if (name === 'hits') loadHits();
  if (name === 'genres') loadGenre();
}

document.addEventListener('click', (e) => {
  const tab = e.target.closest('#tabs button'); if (tab) return showTab(tab.dataset.tab);
  const lang = e.target.closest('#langSeg button'); if (lang) { state.lang = lang.dataset.lang; return applyLang(); }
  const mk = e.target.closest('#marketSeg button');
  if (mk) {
    state.market = mk.dataset.market;
    document.querySelectorAll('#marketSeg button').forEach((b) => b.classList.toggle('on', b === mk));
    return showTab(state.tab);
  }
  const g = e.target.closest('[data-genre]');
  if (g) { state.genre = g.dataset.genre; renderGenreChips(); return loadGenre(); }
  const ex = e.target.closest('[data-ex]'); if (ex) { $('#aiInput').value = ex.dataset.ex; return; }
});
document.addEventListener('change', (e) => {
  const a = e.target.closest('[data-auto]');
  if (a) { state.auto = a.checked; return renderModelChecks(); }
  const m = e.target.closest('[data-model]'); if (!m) return;
  m.checked ? state.picked.add(m.dataset.model) : state.picked.delete(m.dataset.model);
});
$('#searchForm').addEventListener('submit', (e) => { e.preventDefault(); doSearch($('#searchInput').value.trim()); });
$('#aiGo').addEventListener('click', runAi);

// ---------- ค้นหาด้วยเสียง (Web Speech API: Chrome/Edge) ----------
const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
function setupMic() {
  const buttons = document.querySelectorAll('.mic');
  if (!SpeechRec) { buttons.forEach((b) => (b.hidden = true)); document.querySelectorAll('.micLang').forEach((s) => (s.hidden = true)); return; }
  document.querySelectorAll('.micLang').forEach((sel) => sel.addEventListener('change', () => {
    state.micLang = sel.value;
    document.querySelectorAll('.micLang').forEach((s) => { s.value = state.micLang; });
  }));
  const errMsg = { 'not-allowed': 'micDenied', 'service-not-allowed': 'micDenied', 'no-speech': 'micNoSpeech', 'audio-capture': 'micNoDevice', network: 'micNet' };
  buttons.forEach((btn) => {
    const input = document.getElementById(btn.dataset.mic);
    let rec = null;
    btn.addEventListener('click', () => {
      if (rec) { rec.stop(); return; }
      rec = new SpeechRec();
      rec.lang = state.micLang || 'th-TH';
      rec.interimResults = true;
      rec.continuous = false;
      let failed = false;
      rec.onresult = (e) => { input.value = Array.from(e.results).map((r) => r[0].transcript).join(' ').trim(); };
      rec.onerror = (e) => {
        if (e.error === 'aborted') return;
        failed = true;
        toast(errMsg[e.error] ? t(errMsg[e.error]) : `${t('micErr')} ${e.error}`);
      };
      rec.onend = () => {
        btn.classList.remove('rec'); btn.textContent = '🎤'; rec = null;
        if (!failed && input.value.trim() && btn.id === 'micSearch') doSearch(input.value.trim()); // ช่อง AI ไม่ค้นเอง (กันเปลืองโควตา)
      };
      try { rec.start(); btn.classList.add('rec'); btn.textContent = '⏹'; } catch (err) { rec = null; toast(`${t('micErr')} ${err.message}`); }
    });
  });
}

// ---------- ธีมมืด/สว่าง + ช่องค้นหาด้านบน ----------
const SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
const MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>';
function setThemeBtn() { $('#themeBtn').innerHTML = document.documentElement.dataset.theme === 'dark' ? SUN : MOON; }
$('#themeBtn').addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('sf-theme', next); } catch (_) { /* บันทึกไม่ได้ก็ไม่เป็นไร */ }
  setThemeBtn();
});
$('#topSearch').addEventListener('submit', (e) => {
  e.preventDefault();
  const q = $('#topSearchInput').value.trim();
  if (!q) return;
  $('#searchInput').value = q;
  showTab('search');
  doSearch(q);
});

// ---------- เริ่มต้น ----------
(async function init() {
  setupMic();
  setThemeBtn();
  try { state.genres = await api('/api/genres'); } catch (e) { toast(e.message); }
  applyLang();
  loadModels().catch((e) => toast(e.message));
  showTab('hits');
})();
