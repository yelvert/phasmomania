import React, { FunctionComponent } from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router, Redirect, Route, Link, Switch } from 'react-router-dom'

import NestedRoutes from './NestedRoutes'
import Data from './Data'
import Hunt from './Hunt'

export const App : FunctionComponent = () =>
  <Router basename={ document.location.pathname } >
    <ul>
      <li>
        <Link to='/hunt/new'>New Hunt</Link>
      </li>
      <li>
        <Link to='/data'>Data</Link>
      </li>
    </ul>
    <NestedRoutes>
      <Switch>
        <Route path="/hunt">
          <Hunt />
        </Route>
        <Route path="/data">
          <Data />
        </Route>
        <Route>
          <Redirect to="/data" />
        </Route>
      </Switch>
    </NestedRoutes>
  </Router>

export default App
