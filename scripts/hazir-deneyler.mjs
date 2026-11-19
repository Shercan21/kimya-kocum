// src/data/deneyler.ts → public/lab/hazir-deneyler.json (yönetimdeki "Sitede hazır" listesi bunu okur)
import { readFileSync, writeFileSync } from 'node:fs'
const t = readFileSync(new URL('../src/data/deneyler.ts', import.meta.url), 'utf8')
const i = t.indexOf('= {', t.indexOf('const DENEYLER')) + 2, j = t.indexOf('\n}\n', i) + 2
const D = Function('return (' + t.slice(i, j) + ')')()
const o = {}
for (const [k, v] of Object.entries(D)) o[k] = v.map(x => ({ tur: x.tur, baslik: x.baslik, ...(x.tur === 'lab' ? { sayfa: (x.modlar || [])[0] } : {}) }))
writeFileSync(new URL('../public/lab/hazir-deneyler.json', import.meta.url), JSON.stringify({ kaynak: 'src/data/deneyler.ts', deneyler: o }))
console.log('hazir-deneyler.json:', Object.keys(o).length, 'konu')
