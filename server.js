require('dotenv').config();
const path = require('path');
const express = require('express');
const music = require('./src/music');
const ai = require('./src/ai');
const finder = require('./src/finder');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50kb' }));
app.use(express.static(path.join(__dirname, 'public')));

const COUNTRIES = { TH: 'TH', INTL: 'US' }; // "ไทย" ใช้ร้าน iTunes ไทย, "สากล" ใช้ร้านสหรัฐฯ
const countryOf = (m) => COUNTRIES[String(m).toUpperCase()] || 'TH';

// แนวเพลง + คำค้นที่ใช้กับ iTunes
//  intl = ใช้กับร้านสากล (ตัดเพลงไทยออก), thai = ใช้กับร้านไทย (เหลือเฉพาะเพลงไทย)
//  ข้อความธรรมดา = ค้นด้วยคำ, { artist: '...' } = ค้นเฉพาะชื่อศิลปิน (เพิ่ม/แก้ชื่อศิลปินได้ตรงนี้เลย)
const GENRES = [
  { id: 'pop', th: 'ป็อป', en: 'Pop', intl: ['pop hits'], thai: ['เพลงป็อป', 'thai pop'] },
  { id: 'rock', th: 'ร็อก', en: 'Rock', intl: ['rock hits'], thai: ['เพลงร็อก', 'thai rock'] },
  {
    id: 'hiphop', th: 'ฮิปฮอป / แร็ป', en: 'Hip-hop / Rap',
    intl: ['hip hop', 'rap hits'],
    thai: [
      { artist: 'YOUNGOHM' }, { artist: 'Pondering' }, { artist: 'Saran', needsId: true }, { artist: 'Milli', needsId: true },
      { artist: 'F.HERO' }, { artist: 'Thaitanium' }, { artist: 'URBOYTJ' }, 'แร็ป ฮิปฮอป ไทย', 'thai hip hop',
    ],
  },
  { id: 'rnb', th: 'อาร์แอนด์บี', en: 'R&B', intl: ['r&b soul'], thai: ['อาร์แอนด์บี', 'thai r&b'] },
  { id: 'indie', th: 'อินดี้', en: 'Indie', intl: ['indie'], thai: ['เพลงอินดี้', 'thai indie', { artist: 'Polycat' }, { artist: 'Scrubb' }] },
  {
    id: 'alternative', th: 'อัลเทอร์เนทีฟ', en: 'Alternative',
    intl: ['alternative rock', 'alternative'],
    thai: ['อัลเทอร์เนทีฟ', 'thai alternative', { artist: 'Slot Machine' }, { artist: 'Desktop Error' }, { artist: 'Monomania', needsId: true }],
  },
  {
    id: 'shoegaze', th: 'ชูเกซ', en: 'Shoegaze',
    intl: ['shoegaze', { artist: 'My Bloody Valentine' }, { artist: 'Slowdive' }, { artist: 'Ride' }],
    thai: [
      'ชูเกซ', 'thai shoegaze',
      { artist: 'Desktop Error' }, { artist: 'Inspirative' }, { artist: 'Death of Heather' }, { artist: 'Telever' },
      { artist: 'Come Int' }, { artist: 'saltfield' }, { artist: 'SLOWWVES' },
      // ชื่อซ้ำกับวงต่างชาติ: ต้องระบุ artistId ที่ถูกต้อง (หาได้จาก http://localhost:3000/artist-check.html)
      // เช่น { artist: 'Goose', artistId: '123456789' } ไม่เช่นนั้นจะถูกข้าม เพื่อไม่ให้เพลงสากลปน
      { artist: 'Goose', needsId: true }, { artist: 'Monomania', needsId: true },
    ],
  },
  { id: 'dreampop', th: 'ดรีมป็อป', en: 'Dream Pop', intl: ['dream pop'], thai: ['ดรีมป็อป', 'thai dream pop'] },
  { id: 'punk', th: 'พังก์ / อีโม', en: 'Punk / Emo', intl: ['punk rock', 'emo'], thai: ['พังก์', 'thai punk'] },
  { id: 'metal', th: 'เมทัล', en: 'Metal', intl: ['heavy metal'], thai: ['เมทัล', 'thai metal'] },
  { id: 'folk', th: 'โฟล์ก / อะคูสติก', en: 'Folk / Acoustic', intl: ['folk', 'acoustic'], thai: ['โฟล์ก', 'อะคูสติก ไทย'] },
  { id: 'citypop', th: 'ซิตี้ป็อป', en: 'City Pop', intl: ['city pop'], thai: ['ซิตี้ป็อป', 'thai city pop'] },
  { id: 'soul', th: 'โซล / ฟังก์', en: 'Soul / Funk', intl: ['soul funk'], thai: ['โซล ไทย', 'funk ไทย'] },
  { id: 'edm', th: 'อิเล็กทรอนิกส์ / EDM', en: 'Electronic / EDM', intl: ['edm dance'], thai: ['edm', 'thai edm'] },
  { id: 'country', th: 'ลูกทุ่ง / คันทรี', en: 'Country / Luk Thung', intl: ['country'], thai: ['ลูกทุ่ง', 'หมอลำ'] },
  { id: 'jazz', th: 'แจ๊ซ', en: 'Jazz', intl: ['jazz'], thai: ['jazz', 'แจ๊ซ ไทย'] },
  { id: 'kpop', th: 'เคป็อป', en: 'K-Pop', anyOrigin: true, intl: ['k-pop'], thai: ['k-pop'] },
  { id: 'lofi', th: 'ชิลล์ / โลไฟ', en: 'Chill / Lo-fi', intl: ['chill lofi'], thai: ['chill', 'lofi ไทย'] },
];

const wrap = (fn) => (req, res) =>
  fn(req, res).catch((err) => {
    console.error(err.message);
    res.status(502).json({ error: err.message });
  });

app.get('/api/genres', (_req, res) => res.json(GENRES));

// ตัวช่วยตรวจศิลปิน (ใช้กับหน้า /artist-check.html)
app.get(
  '/api/artist-check',
  wrap(async (req, res) => {
    const q = String(req.query.q || '').trim();
    if (!q) return res.json([]);
    res.json(await music.artistCandidates(q, countryOf(req.query.market)));
  })
);

app.get(
  '/api/hits',
  wrap(async (req, res) => {
    const country = countryOf(req.query.market);
    let songs = [];
    try {
      songs = await music.getHits(country, 24);
    } catch (e) {
      console.warn('RSS ใช้ไม่ได้ ใช้การค้นหาแทน:', e.message);
    }
    if (!songs.length) songs = await music.searchSongs(country === 'TH' ? 'เพลงฮิต' : 'top hits', country, 24);
    res.json(songs);
  })
);

app.get(
  '/api/genre',
  wrap(async (req, res) => {
    const g = GENRES.find((x) => x.id === req.query.id);
    if (!g) return res.status(400).json({ error: 'ไม่รู้จักแนวเพลงนี้' });
    res.json(await music.genreSongs(g, countryOf(req.query.market), 24));
  })
);

app.get(
  '/api/search',
  wrap(async (req, res) => {
    const q = String(req.query.q || '').trim();
    if (!q) return res.json([]);
    res.json(await music.searchSongs(q, countryOf(req.query.market), 24));
  })
);

app.get(
  '/api/ai/models',
  wrap(async (_req, res) => res.json(await ai.listModels()))
);

// หัวใจของ DEMO: ถาม AI หลายโมเดลพร้อมกัน -> ตรวจกับ iTunes -> ตัดเพลงที่ไม่มีจริง
app.post(
  '/api/ai/find',
  wrap(async (req, res) => {
    const query = String(req.body?.query || '').trim().slice(0, 600);
    if (!query) return res.status(400).json({ error: 'กรุณาพิมพ์คำอธิบายหรือเนื้อเพลง' });
    const country = countryOf(req.body?.market);

    const { mock, models } = await ai.listModels();
    const wanted = new Set(req.body?.models || []);
    let chosen = models.filter((m) => (mock ? true : m.available) && wanted.has(m.key));
    if (!chosen.length) chosen = mock ? models.slice(0, 3) : models.filter((m) => m.available).slice(0, 3);

    // โหมด Auto: ถามทีละโมเดลตามภาษาของคำค้น หยุดทันทีที่ได้เพลง (ประหยัดโควตา)
    if (req.body?.auto) {
      const result = await finder.runAuto(models, query, country, mock);
      return res.json({ mock, results: [result] });
    }

    const results = await Promise.all(chosen.map((m, i) => finder.runModel(m, query, country, mock, i)));
    res.json({ mock, results });
  })
);

app.listen(PORT, async () => {
  console.log(`\n🎵 Song Finder รันอยู่ที่ http://localhost:${PORT}`);
  const { mock, models } = await ai.listModels();
  console.log(mock ? '⚠️  ไม่พบ API key -> ใช้ AI โหมดจำลอง (mock)' : '✅ พบ API key แล้ว ใช้ AI จริง');
  if (!mock) for (const m of models.filter((x) => x.available)) console.log(`   • ${m.label}  [${m.id}]`);
  console.log('');
});
