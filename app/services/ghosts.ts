import ghosts from '../data/ghosts.json'

export const enum EEvidenceType {
  box = 'box',
  emf = 'emf',
  fingerprints = 'fingerprints',
  freezing = 'freezing',
  orbs = 'orbs',
  writing = 'writing',
}

export type TEvidenceType = keyof typeof EEvidenceType

export type TGhostEvidences = [ TEvidenceType? , TEvidenceType?, TEvidenceType? ]

export interface IGhost {
  name : string
  evidence : TGhostEvidences
}

export type TGhosts = Array<IGhost>


export const Ghosts = ghosts as TGhosts
export default Ghosts
