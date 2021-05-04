import React, { useContext, createContext, PropsWithChildren, FunctionComponent, ElementType } from 'react'
import ReactDom from 'react-dom'
import { useRouteMatch } from 'react-router-dom'

export const NestedRoutesContext = createContext<string>('/');

export const useNestedRoute = () : string => useContext(NestedRoutesContext);

export const NestedRoutes : FunctionComponent<PropsWithChildren<{ route ?: string }>> = ({ route, children }) => {
  const routeMatch = useRouteMatch();
  return (
    <NestedRoutesContext.Provider value={route || routeMatch.url}>
      { children }
    </NestedRoutesContext.Provider>
  );
};
export default NestedRoutes;

export const withNestedRoutes = (WrappedComponent : ElementType) : FunctionComponent => ({ ...props }) : ReturnType<FunctionComponent> => (
  <NestedRoutes>
    <WrappedComponent { ...props } />
  </NestedRoutes>
);