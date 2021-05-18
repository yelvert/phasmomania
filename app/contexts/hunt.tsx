import React, { createContext, useContext, useState, FunctionComponent, ElementType } from 'react'
import ReactDOM from 'react-dom'
import _includes from 'lodash/includes'
import _clone from 'lodash/clone'
import _merge from 'lodash/merge'
import _filter from 'lodash/filter'
import _every from 'lodash/every'
import _map from 'lodash/map'
import _union from 'lodash/union'
import _pullAll from 'lodash/pullAll'

import { IMap } from '../services/maps'
import Ghosts, { IGhost, TEvidenceType, EEvidenceType } from '../services/ghosts'

export type THuntEvidenceState = boolean | null

export type THuntEvidence = {
  [index in TEvidenceType]: THuntEvidenceState
}

export const negatableEvidenceTypes : Readonly<Array<TEvidenceType>> = Object.freeze([ 'freezing', 'orbs' ])

export interface IHuntContext {
  map ?: IMap
  setMap : (map : IMap) => void
  ghost ?: IGhost
  setGhost : (ghost : IGhost) => void
  evidence : THuntEvidence
  getEvidenceType : (evidenceType : TEvidenceType) => THuntEvidenceState
  setEvidenceType : ( evidenceType : TEvidenceType, state : THuntEvidenceState ) => void
  possibleGhosts : Array<IGhost>
  selectedEvidence : Array<TEvidenceType>
  remainingEvidence : Array<TEvidenceType>
  newHunt : () => void
}

export const HuntContext = createContext<IHuntContext>(null)
export const Provider = HuntContext.Provider
export const Consumer = HuntContext.Consumer

const emptyEvidence = () => (
  Object.keys(EEvidenceType).reduce<THuntEvidence>(
    (memo, evidenceType : TEvidenceType) => {
      memo[evidenceType] = null
      return memo
    },
    {} as THuntEvidence
  )
)

export const createHuntContext = () : IHuntContext => {
  const [ map, setMap ] = useState<IHuntContext['map']>()
  const [ ghost, setGhost ] = useState<IHuntContext['ghost']>()
  const [ evidence, setEvidence ] = useState<IHuntContext['evidence']>(emptyEvidence())
  const getEvidenceType : IHuntContext['getEvidenceType'] = (evidenceType) => evidence[evidenceType]
  const setEvidenceType : IHuntContext['setEvidenceType'] = (evidenceType, state) => {
    setEvidence(
      _merge(
        _clone(evidence),
        { [evidenceType]: state }
      )
    )
  }
  const possibleGhosts : IHuntContext['possibleGhosts'] = _filter(Ghosts, ghost =>
    _every(evidence, (state, evidenceType) => {
      if (state === null) return true
      if (state === true) return _includes(ghost.evidence, evidenceType)
      if (state === false) return !_includes(ghost.evidence, evidenceType)
    })
  )
  const selectedEvidence : IHuntContext['selectedEvidence'] = _filter(
    Object.keys(evidence) as TEvidenceType[],
    evidenceType => evidence[evidenceType] !== null
  )
  const remainingEvidence : IHuntContext['remainingEvidence'] = _pullAll(
    _union(
      ..._map<IGhost, TEvidenceType[]>(
        possibleGhosts, g => g.evidence
      )
    ),
    selectedEvidence
  )
  const newHunt : IHuntContext['newHunt'] = () => {
    setMap(null)
    setGhost(null)
    setEvidence(emptyEvidence())
  }
  return {
    map,
    setMap,
    ghost,
    setGhost,
    evidence,
    getEvidenceType,
    setEvidenceType,
    possibleGhosts,
    selectedEvidence,
    remainingEvidence,
    newHunt,
  }
}

export interface IHuntContextProviderProps {
}

export const HuntContextProvider : FunctionComponent<IHuntContextProviderProps> = ({ children }) => {
  return <Provider value={createHuntContext()}>{ children }</Provider>
}

export const withHuntContext = (WrappedComponent : ElementType) : FunctionComponent =>
  ({ ...props }) : ReturnType<FunctionComponent> => (
    <HuntContextProvider>
      <WrappedComponent { ...props } />
    </HuntContextProvider>
  )

export const useHunt : () => IHuntContext = () => useContext(HuntContext)

export default {
  HuntContext,
  Provider,
  Consumer,
  createHuntContext,
  HuntContextProvider,
  useHunt,
}