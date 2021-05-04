import React, { FunctionComponent } from 'react'
import ReactDOM from 'react-dom'

import Ghosts from '../services/ghosts'
import Maps from '../services/maps'

export interface DataProps {
}

export const Data : FunctionComponent<DataProps> = () =>
  <ul>
    <li>
      Maps
      <ul>
        { Maps.map( map => <li key={ map.name }>{ map.name }<small>({ map.size })</small></li> ) }
      </ul>
    </li>
    <li>
      Ghosts
      <ul>
        {
          Ghosts.map( ghost =>
            <li key={ ghost.name }>
              { ghost.name }
              <ul>
                { ghost.evidence.map( evidence => <li key={ evidence }>{ evidence }</li> ) }
              </ul>
            </li>
          )
        }
      </ul>
    </li>
  </ul>

export default Data
