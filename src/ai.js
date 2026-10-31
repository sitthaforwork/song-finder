// เรียก AI หลายโมเดลผ่าน API แบบ OpenAI-compatible (ใช้ฟังก์ชันเดียวได้ทุกเจ้า)
// รายชื่อโมเดลจะถูกดึงจาก provider จริงตอนรัน (ชื่อโมเดลฟรีเปลี่ยนบ่อย ไม่ต้องแก้โค้ดเอง)
// ถ้าไม่มี API key เลย -> ใช้ "โหมดจำลอง" (mock) เพื่อให้ DEMO ใช้งานได้

const PROVIDERS = {
  openrouter: {
    label: 'OpenRouter',
    baseURL: 'https://openrouter.ai/api/v1',
    keyEnv: 'OPENROUTER_API_KEY',
    headers: { 'X-Title': 'Song Finder Demo' },
    fallback: ['openrouter/free'],
  },
  groq: {
    label: 'Groq',
    baseURL: 'https://api.groq.com/openai/v1',
    keyEnv: 'GROQ_API_KEY',
    fallback: ['openai/gpt-oss-20b'],
  },
  gemini: {
    label: 'Gemini',
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai',
    keyEnv: 'GEMINI_API_KEY',
    fallback: ['gemini-flash-latest', 'gemini-flash-lite-latest'],
  },
};

// ---------- ค้นหาโมเดลที่ใช้ได้จริงจาก provider ----------
const envList = (name) =>
  (process.env[name] || '').split(',').map((s) => s.trim()).filter(Boolean);

function pickByPrefs(ids, prefs, max) {
  const out = [];
  for (const re of prefs) {
    const f = ids.find((i) => re.test(i) && !out.includes(i));
    if (f) out.push(f);
    if (out.length >= max) return out;
  }
  for (const i of ids) {
    if (out.length >= max) break;
    if (!out.includes(i)) out.push(i);
  }
  return out;
}

function pickGroq(items) {
  const bad = /whisper|tts|guard|orpheus|playai|compound|embed|safeguard/i;
  const ids = items.map((m) => m.id).filter((i) => !bad.test(i));
  return pickByPrefs(ids, [/gpt-oss-120b/, /llama-3\.3-70b/, /gpt-oss-20b/, /llama-4/, /qwen/, /kimi/], 3);
}

function pickGemini(items) {
  const bad = /embed|tts|image|live|audio|imagen|veo|aqa|robot|computer|native|learnlm|gemma/i;
  const ids = items.map((m) => m.id).filter((i) => /^gemini-/.test(i) && !bad.test(i));
  const ver = (i) => {
    const m = i.match(/gemini-(\d+(?:\.\d+)?)/);
    return m ? parseFloat(m[1]) : 0;
  };
  const isPrev = (i) => (/preview|exp/.test(i) ? 1 : 0);
  const best = (arr) => [...arr].sort((a, b) => ver(b) - ver(a) || isPrev(a) - isPrev(b))[0];
  const lite = ids.filter((i) => /flash-lite/.test(i));
  const flash = ids.filter((i) => /flash/.test(i) && !/lite/.test(i));
  return [best(flash), best(lite)].filter(Boolean);
}

function pickOpenRouter(items) {
  const free = items
    .filter(
      (m) =>
        m.id.endsWith(':free') ||
        (m.pricing && Number(m.pricing.prompt) === 0 && Number(m.pricing.completion) === 0)
    )
    .map((m) => m.id)
    .filter((i) => i !== 'openrouter/free' && !/embed|vision|image|audio|vl\b/i.test(i));
  return ['openrouter/free', ...pickByPrefs(free, [/llama.*70b/, /gpt-oss/, /qwen/, /nemotron/, /gemma/, /deepseek/], 2)];
}

const PICKERS = { groq: pickGroq, gemini: pickGemini, openrouter: pickOpenRouter };

async function fetchLive(name) {
  const p = PROVIDERS[name];
  const res = await fetch(`${p.baseURL}/models`, {
    headers: { Authorization: `Bearer ${process.env[p.keyEnv]}` },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return (data.data || []).map((m) => ({ id: String(m.id).replace(/^models\//, ''), pricing: m.pricing }));
}

const shortName = (id) => id.split('/').pop().replace(':free', '');

let cache = { t: 0, v: null };
const TTL = 10 * 60 * 1000;

async function listModels() {
  if (cache.v && Date.now() - cache.t < TTL) return cache.v;
  const models = [];
  for (const [name, p] of Object.entries(PROVIDERS)) {
    const hasKey = Boolean(process.env[p.keyEnv]);
    const override = envList(`${name.toUpperCase()}_MODELS`); // ตั้งเองใน .env ได้ (ใช้แทนค่าอัตโนมัติ)
    let ids = p.fallback;
    if (override.length) ids = override;
    else if (hasKey) {
      try {
        ids = PICKERS[name](await fetchLive(name));
        if (!ids.length) ids = p.fallback;
      } catch (e) {
        console.warn(`ดึงรายชื่อโมเดลของ ${p.label} ไม่สำเร็จ (${e.message}) ใช้ค่าสำรองแทน`);
      }
    }
    // Gemini: เพิ่มตัวเลือก "ค้นเว็บ" (Google Search grounding) ไว้ก่อน จะได้ถูกเลือกเป็นค่าเริ่มต้น
    if (name === 'gemini' && ids.length) {
      // ตั้ง GEMINI_SEARCH_MODEL ใน .env เพื่อเลือกโมเดลที่ใช้ค้นเว็บเองได้
      const sid = process.env.GEMINI_SEARCH_MODEL || ids[0];
      models.push({
        id: sid, provider: name, grounded: true, key: `${name}:${sid}:search`,
        label: `${shortName(sid)} + Web Search (Gemini)`, available: hasKey,
      });
    }
    // Groq: เพิ่มตัวเลือก "ค้นเว็บด้วย Tavily แล้วให้ Groq สรุป" ไว้ก่อน จะได้ถูกเลือกเป็นค่าเริ่มต้น
    if (name === 'groq' && ids.length) {
      models.push({
        id: ids[0], provider: name, search: true, key: `${name}:${ids[0]}:tavily`,
        label: `${shortName(ids[0])} + Tavily Search (Groq)`,
        available: hasKey && Boolean(process.env.TAVILY_API_KEY),
        needs: 'TAVILY_API_KEY',
      });
    }
    for (const id of ids) {
      models.push({ id, provider: name, key: `${name}:${id}`, label: `${shortName(id)} (${p.label})`, available: hasKey });
    }
  }
  const v = { mock: !models.some((m) => m.available), models };
  cache = { t: Date.now(), v };
  return v;
}

// ---------- คำสั่งที่ส่งให้ AI ----------
const SYSTEM_PROMPT = `You are a music expert helping people find songs.
The user may describe a mood, a genre, part of a song's lyrics, a title, or describe a melody in words.
Reply with ONLY valid JSON, no markdown, in this exact shape:
{"songs":[{"title":"...","artist":"...","reason":"..."}]}
Rules:
- Suggest up to 5 songs. Only REAL, existing songs by the correct artist. If unsure, suggest fewer. Never invent songs.
- "reason": one short sentence in the same language the user wrote in, explaining why it matches.
- Do NOT quote lyrics in your answer.
- Cover both Thai and international songs when the request does not specify.`;

function parseSongs(text) {
  if (!text) return [];
  const cleaned = String(text).replace(/```json|```/gi, '').trim();
  const tryParse = (s) => {
    try {
      return JSON.parse(s);
    } catch {
      return null;
    }
  };
  let data = tryParse(cleaned);
  if (!data) {
    const obj = cleaned.match(/\{[\s\S]*\}/);
    if (obj) data = tryParse(obj[0]);
  }
  if (!data) {
    const arr = cleaned.match(/\[[\s\S]*\]/);
    if (arr) data = tryParse(arr[0]);
  }
  let songs = Array.isArray(data) ? data : data?.songs;
  if (!Array.isArray(songs)) {
    // สำรอง: โมเดลตอบเป็นรายการข้อความ เช่น  1. "Title" - Artist
    songs = [];
    for (const line of cleaned.split('\n')) {
      const m = line.trim().match(/^(?:\d+[.)]\s*|[-*•]\s*)?["“]?(.+?)["”]?\s+(?:-|–|—|by)\s+(.+?)\s*$/i);
      if (m) songs.push({ title: m[1].replace(/\*+/g, ''), artist: m[2].replace(/\*+/g, '') });
    }
  }
  return songs
    .filter((s) => s && s.title && s.artist)
    .slice(0, 5)
    .map((s) => ({ title: String(s.title), artist: String(s.artist), reason: String(s.reason || '') }));
}

// โมเดลตอบ {"songs":[]} อย่างตั้งใจ = "ระบุเพลงไม่ได้" (ไม่ใช่ error)
const isEmptyAnswer = (text) => /"songs"\s*:\s*\[\s*\]/.test(String(text || ''));

// คืนค่า { songs, sources, queries }
// ctx (ไม่บังคับ) = { system, user } ใช้แทนคำสั่งมาตรฐาน (ตอนส่งผลค้นเว็บให้โมเดลอ่าน)
async function askModel(model, query, ctx) {
  if (!ctx && model.grounded) return askGrounded(model, query);
  if (!ctx && model.search) return askWithSearch(model, query);
  const provider = PROVIDERS[model.provider];
  const apiKey = process.env[provider.keyEnv];
  const res = await fetch(`${provider.baseURL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      ...(provider.headers || {}),
    },
    body: JSON.stringify({
      model: model.id,
      temperature: 0.3,
      messages: [
        { role: 'system', content: ctx?.system || SYSTEM_PROMPT },
        { role: 'user', content: ctx?.user || query },
      ],
    }),
    signal: AbortSignal.timeout(60000),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} ${body.slice(0, 160)}`);
  }
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  const songs = parseSongs(text);
  if (!songs.length) {
    if (isEmptyAnswer(text)) return { songs: [], sources: [], queries: [] };
    throw new Error(`อ่านคำตอบของโมเดลไม่ได้: ${String(text || '(ว่างเปล่า)').slice(0, 120)}`);
  }
  return { songs, sources: [], queries: [] };
}

// Gemini แบบเรียกตรง (native API) + เครื่องมือ Google Search ให้โมเดลค้นเว็บก่อนตอบ
const GROUNDED_EXTRA = `
You have Google Search. ALWAYS search the web first to identify the song.
For a lyric fragment, search the exact phrase in quotes (for Thai lyrics also try adding "เนื้อเพลง").
Only list songs that the search results support, best match first. Output the JSON only, no other text.`;

async function askGrounded(model, query) {
  const apiKey = process.env[PROVIDERS.gemini.keyEnv];
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model.id)}:generateContent`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT + GROUNDED_EXTRA }] },
      contents: [{ role: 'user', parts: [{ text: query }] }],
      tools: [{ google_search: {} }],
      generationConfig: { temperature: 0.2 },
    }),
    signal: AbortSignal.timeout(90000),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} ${body.replace(/\s+/g, ' ').slice(0, 700)}`);
  }
  const data = await res.json();
  const cand = data.candidates?.[0];
  const text = (cand?.content?.parts || []).map((p) => p.text || '').join('');
  const songs = parseSongs(text);
  if (!songs.length && !isEmptyAnswer(text)) {
    throw new Error(`อ่านคำตอบของโมเดลไม่ได้: ${String(text || '(ว่างเปล่า)').slice(0, 120)}`);
  }
  const gm = cand?.groundingMetadata || {};
  const sources = (gm.groundingChunks || [])
    .map((c) => c.web)
    .filter((w) => w && w.uri)
    .slice(0, 4)
    .map((w) => ({ title: w.title || w.uri, url: w.uri }));
  return { songs, sources, queries: (gm.webSearchQueries || []).slice(0, 3) };
}

// ค้นเว็บด้วย Tavily (แผนฟรี ไม่ต้องใช้บัตร) แล้วส่งผลให้โมเดลอ่านและสรุปว่าเป็นเพลงอะไร
const SEARCH_EXTRA = `
Web search results for the user's request are provided in the user message.
Use them to identify the song. Only list songs that the search results support, best match first.
If the results do not clearly identify any song, return {"songs":[]}. Output the JSON only.`;

async function askWithSearch(model, query) {
  const key = process.env.TAVILY_API_KEY;
  if (!key) throw new Error('ยังไม่ได้ตั้ง TAVILY_API_KEY ใน .env');
  // ตัดคำนำที่ไม่ใช่เนื้อเพลง (เช่น "เพลงที่ร้องว่า") ออก เพื่อให้คำค้นตรงกับเนื้อจริงมากขึ้น
  const cleaned =
    query.replace(/^\s*(เพลงที่ร้องว่า|เพลงที่มีเนื้อ(?:ร้อง)?(?:ว่า)?|เพลงที่เนื้อร้องประมาณว่า|เนื้อเพลงว่า|เนื้อเพลง|ท่อนที่ว่า)\s*/, '').trim() || query;
  const suffix = /[฀-๿]/.test(cleaned) ? ' เนื้อเพลง' : ' song lyrics';
  const searchQuery = `${cleaned}${suffix}`.slice(0, 380);
  const res = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    // TAVILY_DEPTH=advanced ใน .env = ค้นละเอียดขึ้น (ใช้ 2 เครดิตต่อครั้ง)
    body: JSON.stringify({
      query: searchQuery,
      search_depth: process.env.TAVILY_DEPTH === 'advanced' ? 'advanced' : 'basic',
      max_results: 8,
    }),
    signal: AbortSignal.timeout(25000),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Tavily HTTP ${res.status} ${body.replace(/\s+/g, ' ').slice(0, 300)}`);
  }
  const data = await res.json();
  const results = (data.results || []).slice(0, 6);
  if (!results.length) throw new Error('Tavily ไม่พบผลการค้นหา');

  const context = results
    .map((r, i) => `[${i + 1}] ${r.title}\n${r.url}\n${String(r.content || '').slice(0, 500)}`)
    .join('\n\n');
  const out = await askModel(model, query, {
    system: SYSTEM_PROMPT + SEARCH_EXTRA,
    user: `User request: ${query}\n\nWeb search results:\n${context}`,
  });
  return {
    songs: out.songs,
    queries: [searchQuery],
    sources: results.slice(0, 4).map((r) => ({ title: r.title || r.url, url: r.url })),
  };
}

// ---------- โหมดจำลอง (ไม่ต้องมี key) ----------
const MOCK_BANK = {
  sad: [
    ['Someone Like You', 'Adele', 'เพลงอกหักจังหวะช้า เหมาะฟังตอนเหงา'],
    ['Fix You', 'Coldplay', 'ทำนองปลอบใจ ค่อยๆ ไต่ระดับอารมณ์'],
    ['Skinny Love', 'Bon Iver', 'อะคูสติกเรียบง่าย บรรยากาศเศร้า'],
    ['Stay With Me', 'Sam Smith', 'เสียงร้องอบอุ่น เล่าความเหงา'],
    ['Yellow', 'Coldplay', 'อบอุ่นและเศร้าเล็กน้อย'],
  ],
  happy: [
    ['Happy', 'Pharrell Williams', 'จังหวะสนุก ฟังแล้วอารมณ์ดี'],
    ['Uptown Funk', 'Mark Ronson', 'ฟังก์สนุกๆ เต้นได้'],
    ['Dynamite', 'BTS', 'ป็อปสดใส พลังบวก'],
    ['Shake It Off', 'Taylor Swift', 'ป็อปสนุก ร้องตามง่าย'],
    ["Can't Stop the Feeling!", 'Justin Timberlake', 'ป็อปสดใสเต็มพลัง'],
  ],
  chill: [
    ['Sunflower', 'Post Malone', 'จังหวะผ่อนคลาย ฟังสบาย'],
    ['Perfect', 'Ed Sheeran', 'บัลลาดนุ่มๆ ฟังเพลินๆ'],
    ['Put Your Records On', 'Corinne Bailey Rae', 'โซลเบาๆ ฟังสบาย'],
    ['Blinding Lights', 'The Weeknd', 'ซินธ์ป็อปจังหวะสม่ำเสมอ'],
    ['Budapest', 'George Ezra', 'โฟล์กป็อปอบอุ่น'],
  ],
  rock: [
    ['Bohemian Rhapsody', 'Queen', 'ร็อกคลาสสิกหลายท่อน'],
    ['Smells Like Teen Spirit', 'Nirvana', 'กรันจ์พลังสูง'],
    ['Back In Black', 'AC/DC', 'ฮาร์ดร็อกริฟฟ์หนักแน่น'],
    ['Seven Nation Army', 'The White Stripes', 'ริฟฟ์เบสที่จำง่าย'],
    ['Mr. Brightside', 'The Killers', 'อินดี้ร็อกร้องตามสนุก'],
  ],
  rap: [
    ['Lose Yourself', 'Eminem', 'แร็ปสร้างแรงบันดาลใจ'],
    ['HUMBLE.', 'Kendrick Lamar', 'บีตหนักแน่น'],
    ['Sicko Mode', 'Travis Scott', 'ทรัปแปลกใหม่ หลายท่อน'],
    ["God's Plan", 'Drake', 'แร็ปจังหวะผ่อนคลาย'],
    ['Empire State of Mind', 'JAY-Z', 'ฮิปฮอปคลาสสิก'],
  ],
};

function mockSongs(query, index) {
  const q = query.toLowerCase();
  let bucket = 'chill';
  if (/เศร้า|เหงา|อกหัก|ร้องไห้|ฝน|คิดถึง|sad|cry|lonely|heartbreak|rain|miss/.test(q)) bucket = 'sad';
  else if (/สนุก|เต้น|มันส์|ดีใจ|happy|dance|party|fun/.test(q)) bucket = 'happy';
  else if (/ร็อก|rock|guitar|กีต้าร์/.test(q)) bucket = 'rock';
  else if (/แร็ป|ฮิปฮอป|rap|hip.?hop/.test(q)) bucket = 'rap';
  const list = MOCK_BANK[bucket];
  // หมุนลำดับต่างกันในแต่ละโมเดล เพื่อให้เห็นการเปรียบเทียบ
  const rotated = list.slice(index % list.length).concat(list.slice(0, index % list.length));
  return rotated.slice(0, 4).map(([title, artist, reason]) => ({ title, artist, reason }));
}

module.exports = { listModels, askModel, mockSongs, parseSongs, _pick: { pickGroq, pickGemini, pickOpenRouter } };
