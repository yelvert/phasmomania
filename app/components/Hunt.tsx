import React, { useState, FunctionComponent, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { useHistory, Route, Switch, Redirect } from 'react-router-dom'

import { withNestedRoutes, useNestedRoute } from './NestedRoutes'
import { withHuntContext, useHunt } from '../contexts/hunt'
import Maps, { IMap } from '../services/maps'

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
