// ติดต่อ iTunes Search API (ฟรี ไม่ต้องใช้ key) + Apple RSS สำหรับเพลงฮิต
// iTunes จำกัดจำนวนคำขอต่อนาที จึงมีคิวหน่วงเวลา + ลองใหม่เมื่อถูกจำกัด
const cache = new Map();
const TTL = 10 * 60 * 1000; // เก็บแคช 10 นาที ลดการยิง API ซ้ำ
const GAP_MS = 400; // เว้นระยะระหว่างคำขอ
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let chain = Promise.resolve();
let lastCall = 0;
function throttled(fn) {
  const run = chain.then(async () => {
    const wait = Math.max(0, lastCall + GAP_MS - Date.now());
    if (wait) await sleep(wait);
    lastCall = Date.now();
    return fn();
  });
  chain = run.catch(() => {});
  return run;
}

async function getJson(url) {
  const hit = cache.get(url);
  if (hit && Date.now() - hit.t < TTL) return hit.v;
  let lastErr;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await throttled(() => fetch(url, { signal: AbortSignal.timeout(15000) }));
      if (res.status === 403 || res.status === 429 || res.status >= 500) {
        lastErr = new Error(`HTTP ${res.status} จาก ${new URL(url).host} (อาจถูกจำกัดจำนวนคำขอ)`);
        await sleep(2000 * (attempt + 1)); // ถูกจำกัด -> รอแล้วลองใหม่
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status} จาก ${new URL(url).host}`);
      const v = await res.json();
      cache.set(url, { t: Date.now(), v });
      return v;
    } catch (e) {
      lastErr = e;
      if (attempt < 2) await sleep(800);
    }
  }
  throw lastErr;
}

function normalizeTrack(t) {
  return {
    id: String(t.trackId),
    title: t.trackName,
    artist: t.artistName,
    artistId: String(t.artistId || ''),
    album: t.collectionName || '',
    genre: t.primaryGenreName || '',
    artwork: (t.artworkUrl100 || '').replace('100x100', '400x400'),
    previewUrl: t.previewUrl || '',
    link: t.trackViewUrl || '',
  };
}

async function searchSongs(term, country = 'TH', limit = 20, attribute) {
  const params = { term, media: 'music', entity: 'song', country, limit: String(limit) };
  if (attribute) params.attribute = attribute; // เช่น artistTerm = ค้นเฉพาะชื่อศิลปิน
  const url = 'https://itunes.apple.com/search?' + new URLSearchParams(params);
  const data = await getJson(url);
  return (data.results || []).filter((r) => r.trackName).map(normalizeTrack);
}

// ค้นหลายคำ/หลายศิลปินแล้วรวมผล: ตัดเพลงซ้ำ, จำกัดต่อศิลปินไม่ให้คนเดียวเต็มหน้า, สลับลำดับให้หลากหลาย
async function searchMany(specs, country, total = 24, perArtist = 3, keep = () => true) {
  const lists = [];
  let ok = 0;
  let lastErr;
  for (const spec of specs) {
    const isArtist = typeof spec === 'object';
    try {
      const found = await searchSongs(isArtist ? spec.artist : spec, country, isArtist ? 10 : 25, isArtist ? 'artistTerm' : undefined);
      lists.push(found.filter(keep));
      ok++;
    } catch (e) {
      lastErr = e;
      lists.push([]);
    }
  }
  if (!ok) throw lastErr;
  const seen = new Set();
  const count = new Map();
  const out = [];
  for (let i = 0; out.length < total; i++) {
    let any = false;
    for (const l of lists) {
      const s = l[i];
      if (!s) continue;
      any = true;
      const a = s.artist.toLowerCase();
      if (seen.has(s.id) || (count.get(a) || 0) >= perArtist) continue;
      seen.add(s.id);
      count.set(a, (count.get(a) || 0) + 1);
      out.push(s);
      if (out.length >= total) break;
    }
    if (!any) break;
  }
  return out;
}

// ---------- แยกเพลงไทย / สากล ----------
// iTunes ไม่มีช่อง "ประเทศของศิลปิน" จึงเดาจาก: ตัวอักษรไทยในชื่อเพลง/ศิลปิน/อัลบั้ม,
// ชื่อแนวเพลงที่มีคำว่า Thai, หรือชื่อศิลปินที่อยู่ในรายชื่อ seed ของแนวนั้น (ศิลปินไทยที่ใช้ชื่ออังกฤษต้องใส่ใน seed)
const THAI_CHARS = /[\u0E00-\u0E7F]/;
const THAI_GENRE = /thai|t-pop|luk thung|mor lam|ลูกทุ่ง|หมอลำ/i;
const hasThaiText = (s) => THAI_CHARS.test(`${s.title} ${s.artist} ${s.album}`) || THAI_GENRE.test(s.genre || '');
const artistNames = (s) => String(s.artist).toLowerCase().split(/\s*(?:,|&|\bfeat\.?|\bft\.?|\bx\b)\s*/i).map((x) => x.trim()).filter(Boolean);

// seeds = Map(ชื่อศิลปินตัวพิมพ์เล็ก -> spec)
//  spec.artistId  = ต้องเป็นศิลปิน ID นี้เท่านั้น (กันชื่อซ้ำกับวงต่างชาติ)
//  spec.needsId   = ชื่อซ้ำกับศิลปินอื่น ยังไม่ได้ระบุ ID -> ไม่ใช้ชื่ออย่างเดียวเป็นหลักฐานว่าเป็นเพลงไทย
function isThaiSong(s, seeds) {
  if (hasThaiText(s)) return true;
  return artistNames(s).some((n) => {
    const spec = seeds.get(n);
    if (!spec) return false;
    if (spec.artistId) return String(spec.artistId) === s.artistId;
    return !spec.needsId;
  });
}

// เพลงของแนวเพลงหนึ่งๆ
//  - ตลาดไทย: เฉพาะเพลงไทย (ตามตัวกรองด้านบน)   - ตลาดสากล: ตัดเพลงไทยออก
//  - genre.anyOrigin = true (เช่น K-Pop) ไม่กรองที่มา
async function genreSongs(genre, country, total = 24) {
  const thai = country === 'TH';
  const seeds = new Map();
  for (const x of genre.thai || []) if (typeof x === 'object') seeds.set(x.artist.toLowerCase(), x);
  const keep = genre.anyOrigin ? () => true : thai ? (s) => isThaiSong(s, seeds) : (s) => !hasThaiText(s);
  // ศิลปินที่ชื่อซ้ำและยังไม่มี artistId ไม่ต้องค้น (ค้นไปก็ถูกกรองทิ้ง)
  const specs = (thai ? genre.thai : genre.intl).filter((x) => typeof x !== 'object' || x.artistId || !x.needsId);
  return searchMany(specs, country, total, 3, keep);
}

// ตัวช่วยตรวจศิลปิน: ค้นชื่อศิลปินแล้วจัดกลุ่มตาม artistId เพื่อดูว่า iTunes ตอบศิลปินคนไหนบ้าง (ชื่อซ้ำ/แนวเพลงที่ iTunes ติดป้าย)
async function artistCandidates(name, country = 'TH') {
  const songs = await searchSongs(name, country, 50, 'artistTerm');
  const groups = new Map();
  for (const s of songs) {
    const k = s.artistId || s.artist;
    const g = groups.get(k) || { artistId: s.artistId, artist: s.artist, genres: new Set(), songs: [] };
    g.genres.add(s.genre);
    g.songs.push(s.title);
    groups.set(k, g);
  }
  return [...groups.values()]
    .map((g) => ({ artistId: g.artistId, artist: g.artist, genres: [...g.genres], total: g.songs.length, songs: g.songs.slice(0, 5) }))
    .sort((x, y) => y.total - x.total);
}

// เพลงฮิตจาก Apple RSS แล้ว lookup เพื่อเอา preview 30 วินาที
async function getHits(country = 'TH', limit = 24) {
  const cc = country.toLowerCase();
  const feed = await getJson(
    `https://rss.applemarketingtools.com/api/v2/${cc}/music/most-played/${limit}/songs.json`
  );
  const ids = (feed.feed?.results || []).map((r) => r.id).filter(Boolean);
  if (!ids.length) return [];
  const lookup = await getJson(
    `https://itunes.apple.com/lookup?id=${ids.join(',')}&country=${country}`
  );
  const byId = new Map((lookup.results || []).map((r) => [String(r.trackId), normalizeTrack(r)]));
  // คงลำดับอันดับตาม feed
  return ids.map((id) => byId.get(String(id))).filter(Boolean);
}

// ---------- ตรวจว่าเพลงที่ AI แนะนำมีอยู่จริงไหม ----------
function norm(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/\(.*?\)|\[.*?\]/g, ' ') // ตัดวงเล็บ เช่น (feat. ...) (Remastered)
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, ' ') // ต้องมีแฟลก u; \p{M} คือสระ/วรรณยุกต์ภาษาไทย
    .trim();
}

function looseMatch(a, b) {
  const x = norm(a);
  const y = norm(b);
  if (!x || !y) return false;
  return x === y || x.includes(y) || y.includes(x);
}

// คืนค่า { status: 'found' | 'missing' | 'error', song? }
//  found   = พบเพลงนี้จริง
//  missing = ค้นหาสำเร็จแต่ไม่พบ (น่าจะเป็นเพลงที่ AI แต่งขึ้น)
//  error   = ตรวจไม่ได้เพราะเชื่อมต่อ/ถูกจำกัด (ไม่ควรสรุปว่าเพลงไม่มีจริง)
async function verifySong(title, artist, country = 'TH') {
  const countries = [...new Set([country, 'US'])];
  let hadError = false;
  for (const c of countries) {
    try {
      const results = await searchSongs(`${title} ${artist}`, c, 10);
      const found = results.find((r) => looseMatch(r.title, title) && looseMatch(r.artist, artist));
      if (found) return { status: 'found', song: found };
    } catch (e) {
      hadError = true;
      console.warn(`ตรวจเพลง "${title} - ${artist}" (${c}) ไม่สำเร็จ: ${e.message}`);
    }
  }
  return { status: hadError ? 'error' : 'missing' };
}

module.exports = { searchSongs, searchMany, genreSongs, artistCandidates, getHits, verifySong, _test: { norm, looseMatch, isThaiSong } };
