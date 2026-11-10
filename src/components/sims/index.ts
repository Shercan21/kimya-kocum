import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

// Sanal deney bileşenleri; her biri yalnızca açıldığında yüklenir.
export type SimProps = { modlar?: string[] }

export const SIMLER: Record<string, LazyExoticComponent<ComponentType<SimProps>>> = {
  gaz: lazy(() => import('./GasSim')),
  difuzyon: lazy(() => import('./DiffusionSim')),
  hiz: lazy(() => import('./HizSim')),
  denge: lazy(() => import('./DengeSim')),
  ph: lazy(() => import('./PHSim')),
  titrasyon: lazy(() => import('./TitrasyonSim')),
  kcc: lazy(() => import('./KccSim')),
  kalorimetre: lazy(() => import('./KalorimetreSim')),
  entalpi: lazy(() => import('./EntalpiSim')),
  elektroliz: lazy(() => import('./ElektrolizSim')),
  karistir: lazy(() => import('./KaristirSim')),
  mol: lazy(() => import('./MolSim')),
  denklem: lazy(() => import('./DenklemSim')),
  cozunme: lazy(() => import('./CozunmeSim')),
  cozunurluk: lazy(() => import('./CozunurlukSim')),
  derisim: lazy(() => import('./DerisimSim')),
  koligatif: lazy(() => import('./KoligatifSim')),
  sera: lazy(() => import('./SeraSim')),
}
