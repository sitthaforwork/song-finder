// ตรรกะ "ถาม AI -> ตรวจกับ iTunes" แยกออกมาจาก server.js เพื่อให้ทดสอบง่าย
const ai = require('./ai');
const music = require('./music');

const hasThai = (s) => /[฀-๿]/.test(s);

// ถามโมเดลหนึ่งตัว แล้วตรวจทุกเพลงกับ iTunes
async function runModel(m, query, country, mock, i = 0) {
  const started = Date.now();
  try {
    const asked = mock ? { songs: ai.mockSongs(query, i), sources: [], queries: [] } : await ai.askModel(m, query);
    const suggestions = asked.songs;
    const verified = [];
    const unverified = [];
    const rejected = [];
    for (const s of suggestions) {
      const v = await music.verifySong(s.title, s.artist, country);
      if (v.status === 'found') verified.push({ ...v.song, reason: s.reason });
      else if (v.status === 'error') unverified.push({ title: s.title, artist: s.artist, reason: s.reason, unverified: true });
      else rejected.push(`${s.title} - ${s.artist}`);
    }
    return {
      key: m.key, label: m.label, ok: true, ms: Date.now() - started,
      songs: [...verified, ...unverified], rejected,
      sources: asked.sources, queries: asked.queries, noMatch: suggestions.length === 0,
    };
  } catch (err) {
    return { key: m.key, label: m.label, ok: false, ms: Date.now() - started, error: err.message, songs: [], rejected: [] };
  }
}

// ลำดับโมเดลของโหมด Auto (ประหยัดโควตา: ถามทีละตัว หยุดทันทีที่ได้เพลง)
//  - เนื้อเพลงภาษาไทย  -> ค้นเว็บ (Tavily + Groq) ก่อน เพราะโมเดลทั่วไปจำเพลงไทยได้น้อย
//  - ภาษาอื่น (สากล)   -> Gemini ก่อน (จำเพลงดังได้ดี) แล้วค่อยค้นเว็บ
function autoOrder(models, thai) {
  const avail = models.filter((m) => m.available);
  const tavily = avail.find((m) => m.search);
  const gemini = avail
    .filter((m) => m.provider === 'gemini' && !m.grounded)
    .sort((a, b) => Number(/lite/.test(b.id)) - Number(/lite/.test(a.id))); // รุ่น lite เร็วและประหยัดกว่า
  const groq = avail.find((m) => m.provider === 'groq' && !m.search);
  const order = thai ? [tavily, gemini[0], groq] : [gemini[0], gemini[1], tavily, groq];
  return [...new Set(order.filter(Boolean))].slice(0, 3);
}

async function runAuto(models, query, country, mock) {
  const order = mock ? models.slice(0, 1) : autoOrder(models, hasThai(query));
  if (!order.length) throw new Error('ไม่มีโมเดลที่ใช้ได้ ตรวจ API key ในไฟล์ .env');
  const trace = [];
  let last;
  for (const m of order) {
    const r = await runModel(m, query, country, mock, 0);
    last = r;
    const got = r.ok && r.songs.length > 0;
    trace.push({ label: m.label, ms: r.ms, status: !r.ok ? 'error' : got ? 'ok' : 'empty', error: r.error });
    if (got) return { ...r, key: 'auto', label: 'Auto', trace, routed: m.label };
  }
  return { ...last, key: 'auto', label: 'Auto', trace, routed: null };
}

module.exports = { runModel, runAuto, autoOrder, hasThai };
