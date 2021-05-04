import React, { createContext, useContext, useState, FunctionComponent, ElementType } from 'react'
import ReactDOM from 'react-dom'
import includes from 'lodash/includes'

import { IMap } from '../services/maps'
import { IGhost, TGhostEvidences } from '../services/ghosts'

export interface IHuntContext {
  map ?: IMap
  setMap : (map : IMap) => void
  ghost ?: IGhost
  setGhost : (ghost : IGhost) => void
  evidence : TGhostEvidences
  freezing : () => boolean | null
  newHunt : () => void
}

export const HuntContext = createContext<IHuntContext>(null)
export const Provider = HuntContext.Provider
export const Consumer = HuntContext.Consumer

export const createHuntContext = () : IHuntContext => {
  const [ map, setMap ] = useState<IHuntContext['map']>()
  const [ ghost, setGhost ] = useState<IHuntContext['ghost']>()
  const [ evidence, setEvidence ] = useState<IHuntContext['evidence']>([])
  const freezing : IHuntContext['freezing'] = () => includes(evidence, 'freezing')
  const newHunt : IHuntContext['newHunt'] = () => {
    setMap(null)
    setGhost(null)
    setEvidence([])
  }
  return {
    map,
    setMap,
    ghost,
    setGhost,
    evidence,
    freezing,
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