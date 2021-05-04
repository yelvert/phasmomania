import maps from '../data/maps.json'

export const enum EMapSize {
  small = 'small',
  medium = 'medium',
  large = 'large',
}

type TMapSize = keyof typeof EMapSize

export interface IMap {
  name : string
  size : TMapSize
}

export type TMaps = Array<IMap>


export const Maps = maps as TMaps
export default Maps
