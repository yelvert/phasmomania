import React, { useState, FunctionComponent, useEffect, ChangeEvent, ChangeEventHandler } from 'react'
import ReactDOM from 'react-dom'
import { useHistory, Route, Switch, Redirect } from 'react-router-dom'
import _map from 'lodash/map'
import _includes from 'lodash/includes'
import _indexOf from 'lodash/indexOf'

import { withNestedRoutes, useNestedRoute } from './NestedRoutes'
import { withHuntContext, useHunt, negatableEvidenceTypes, THuntEvidenceState } from '../contexts/hunt'
import Maps, { IMap } from '../services/maps'
import { TEvidenceType, EEvidenceStrings, IGhost, EEvidenceType } from '../services/ghosts'

export const NewHunt : FunctionComponent = () => {
  const { setMap, newHunt } = useHunt()
  const route = useNestedRoute()
  const history = useHistory()
  const selectMap = (map : IMap) => {
    setMap(map)
    history.push(route+'/show')
  }
  useEffect(() => { newHunt() }, [])
  return (
    <ul>
      { Maps.map( map => <li key={ map.name } onClick={ () => selectMap(map) } >{ map.name }<small>({ map.size })</small></li> ) }
    </ul>
  )
}

const EvidenceStateIcon : Record<string, string> = {
  null: '?',
  true: '+',
  false: '-',
}
export const EvidenceField : FunctionComponent<{ evidenceType : TEvidenceType }> = ({ evidenceType }) => {
  const { getEvidenceType, setEvidenceType, remainingEvidence, selectedEvidence } = useHunt()
  const value = getEvidenceType(evidenceType)
  const evidenceStateOrder = [ null, true ]
  _includes(negatableEvidenceTypes, evidenceType) && evidenceStateOrder.unshift(false)
  const currentStateIndex = _indexOf(evidenceStateOrder, value)
  const toggle = () => {
    const to = ( currentStateIndex + 1 ) % evidenceStateOrder.length
    console.log(currentStateIndex, to)
    setEvidenceType(
      evidenceType,
      evidenceStateOrder[
        to
      ],
    )
  }
  const selected = _includes(selectedEvidence, evidenceType)
  const remaining = _includes(remainingEvidence, evidenceType)
  if (!selected && !remaining) return null
  return <li onClick={ () => toggle() }>
    {
      remaining
      ? <strong>{EEvidenceStrings[evidenceType]}</strong>
      : EEvidenceStrings[evidenceType]
    }:
    { EvidenceStateIcon[String(value)] }
  </li>
}

export const EvidenceCollection : FunctionComponent = () => {
  const { remainingEvidence } = useHunt()
  const all = Object.keys(EEvidenceType) as TEvidenceType[]
  return (
    <ul>
      { all.map( evidenceType => <EvidenceField key={ evidenceType } evidenceType={ evidenceType } />) }
    </ul>
  )
}

export const PossibleGhost : FunctionComponent<{ ghost : IGhost }> = ({ ghost }) => {
  const { getEvidenceType } = useHunt()
  return <li>
    { ghost.name }
    <ul>
      {
        ghost.evidence.map( evidenceType => (
          <li>
            {
              getEvidenceType(evidenceType)
              ? <strong>{ EEvidenceStrings[evidenceType] }</strong>
              : EEvidenceStrings[evidenceType]
            }
          </li>
        ))
      }
    </ul>
  </li>
}

export const PossibleGhosts : FunctionComponent = () => {
  const { possibleGhosts, evidence } = useHunt()
  console.log(possibleGhosts, evidence)
  return <ul>
    { possibleGhosts.map( ghost => <PossibleGhost ghost={ ghost } /> ) }
  </ul>
}

export const ShowHunt : FunctionComponent = () => {
  const { map } = useHunt()
  const route = useNestedRoute()
  const history = useHistory()
  if (!map) {
    history.push(route+'/new')
    return null
  }
  return (
    <>
      { map.name }
      <EvidenceCollection />
      <PossibleGhosts />
    </>
  )
}

export const Hunt : FunctionComponent = withNestedRoutes(withHuntContext(
  () => {
    const hunt = useHunt()
    const route = useNestedRoute()
    return (
      <Switch>
        <Route path={ route+'/new' } component={ NewHunt } />
        <Route path={ route+'/show' } component={ ShowHunt } />
        <Route><Redirect to={ route+'/new' } /></Route>
      </Switch>
    )
  }
))
export default Hunt
