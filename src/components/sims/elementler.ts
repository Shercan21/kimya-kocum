// İlk 36 elementin özellikleri (yaklaşık değerler).
// r: hesaplanmış atom yarıçapı (pm, Clementi), ie: 1. iyonlaşma enerjisi (kJ/mol), en: Pauling elektronegatifliği

export type Element = { z: number; s: string; ad: string; r: number; ie: number; en: number | null; periyot: number; grup: string; sutun: number }

const VERI: [string, string, number, number, number | null][] = [
  ['H', 'Hidrojen', 53, 1312, 2.2], ['He', 'Helyum', 31, 2372, null],
  ['Li', 'Lityum', 167, 520, 0.98], ['Be', 'Berilyum', 112, 900, 1.57], ['B', 'Bor', 87, 801, 2.04], ['C', 'Karbon', 67, 1086, 2.55],
  ['N', 'Azot', 56, 1402, 3.04], ['O', 'Oksijen', 48, 1314, 3.44], ['F', 'Flor', 42, 1681, 3.98], ['Ne', 'Neon', 38, 2081, null],
  ['Na', 'Sodyum', 190, 496, 0.93], ['Mg', 'Magnezyum', 145, 738, 1.31], ['Al', 'Alüminyum', 118, 578, 1.61], ['Si', 'Silisyum', 111, 787, 1.9],
  ['P', 'Fosfor', 98, 1012, 2.19], ['S', 'Kükürt', 88, 1000, 2.58], ['Cl', 'Klor', 79, 1251, 3.16], ['Ar', 'Argon', 71, 1521, null],
  ['K', 'Potasyum', 243, 419, 0.82], ['Ca', 'Kalsiyum', 194, 590, 1.0], ['Sc', 'Skandiyum', 184, 633, 1.36], ['Ti', 'Titanyum', 176, 659, 1.54],
  ['V', 'Vanadyum', 171, 651, 1.63], ['Cr', 'Krom', 166, 653, 1.66], ['Mn', 'Mangan', 161, 717, 1.55], ['Fe', 'Demir', 156, 763, 1.83],
  ['Co', 'Kobalt', 152, 760, 1.88], ['Ni', 'Nikel', 149, 737, 1.91], ['Cu', 'Bakır', 145, 746, 1.9], ['Zn', 'Çinko', 142, 906, 1.65],
  ['Ga', 'Galyum', 136, 579, 1.81], ['Ge', 'Germanyum', 125, 762, 2.01], ['As', 'Arsenik', 114, 947, 2.18], ['Se', 'Selenyum', 103, 941, 2.55],
  ['Br', 'Brom', 94, 1140, 2.96], ['Kr', 'Kripton', 88, 1351, 3.0],
]

function konum(z: number): { periyot: number; sutun: number; grup: string } {
  const A = ['1A', '2A', '3B', '4B', '5B', '6B', '7B', '8B', '8B', '8B', '1B', '2B', '3A', '4A', '5A', '6A', '7A', '8A']
  let periyot: number
  let sutun: number
  if (z <= 2) { periyot = 1; sutun = z === 1 ? 1 : 18 }
  else if (z <= 10) { periyot = 2; sutun = z <= 4 ? z - 2 : z + 8 }
  else if (z <= 18) { periyot = 3; sutun = z <= 12 ? z - 10 : z }
  else { periyot = 4; sutun = z - 18 }
  return { periyot, sutun, grup: A[sutun - 1] }
}

export const ELEMENTLER: Element[] = VERI.map(([s, ad, r, ie, en], i) => ({ z: i + 1, s, ad, r, ie, en, ...konum(i + 1) }))

// Elektron dizilimi (Aufbau; Cr ve Cu istisnaları)
export const ORBITALLER: [string, number][] = [['1s', 2], ['2s', 2], ['2p', 6], ['3s', 2], ['3p', 6], ['4s', 2], ['3d', 10], ['4p', 6]]

export function dizilim(elektron: number, z: number): [string, number][] {
  const sonuc: [string, number][] = []
  let kalan = elektron
  for (const [ad, kap] of ORBITALLER) {
    if (kalan <= 0) break
    const n = Math.min(kap, kalan)
    sonuc.push([ad, n])
    kalan -= n
  }
  // nötr Cr (24) ve Cu (29) istisnaları
  if (elektron === z && (z === 24 || z === 29)) {
    const s4 = sonuc.find(o => o[0] === '4s')
    const d3 = sonuc.find(o => o[0] === '3d')
    if (s4 && d3) { s4[1] = 1; d3[1] += 1 }
  }
  return sonuc
}

// Katyon oluşurken elektronlar önce en yüksek enerji düzeyinden (4s, 3d'den önce) ayrılır
export function iyonDizilimi(z: number, yuk: number): [string, number][] {
  if (yuk <= 0) return dizilim(z - yuk, z)
  const notr = dizilim(z, z).map(([a, n]) => [a, n] as [string, number])
  let cikar = yuk
  const sira = ['4p', '4s', '3d', '3p', '3s', '2p', '2s', '1s']
  for (const ad of sira) {
    const o = notr.find(x => x[0] === ad)
    if (!o) continue
    const k = Math.min(o[1], cikar)
    o[1] -= k
    cikar -= k
    if (!cikar) break
  }
  return notr.filter(o => o[1] > 0)
}

export const UST = '⁰¹²³⁴⁵⁶⁷⁸⁹'
export function ustSayi(n: number) {
  return String(n).split('').map(c => UST[Number(c)]).join('')
}
