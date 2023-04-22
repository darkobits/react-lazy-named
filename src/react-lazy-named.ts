import React from 'react';


interface PreLoadableLazyExoticComponent<
  T extends React.ComponentType<any>
> extends React.LazyExoticComponent<T> {
  /**
   * Optimistically pre-load the component.
   */
  preload: () => Promise<void>;
}


/**
 * Accepts an object and returns a new object where:
 * - All keys whose value is a React component are mapped to lazy components
 * - All keys whose value is an object are recursively mapped
 * - All keys whose value is any other type are omitted
 */
type AsPreLoadableLazyExotics<O extends Record<string, any>> = {
  // We can use `as` clauses in the key definition of our mapped type to filter
  // values that are not React components. For values that are React
  // components, wrap them in LazyExoticComponent.
  [P in keyof O as O[P] extends React.ComponentType<any>
    ? P
    : O[P] extends Record<string, any>
      ? P
      : never
  ]: O[P] extends React.ComponentType<any>
    ? PreLoadableLazyExoticComponent<O[P]>
    : O[P] extends Record<string, any>
      ? AsPreLoadableLazyExotics<O[P]>
      : never;
};


async function loadComponent<M extends Record<string, any>, K extends keyof M>(
  loader: () => Promise<M>,
  exportName: K
) {
  return loader().then(moduleExports => {
    return {
      default: moduleExports[exportName]
    };
  });
}


/**
 * Works like `React.lazy`, but allows for type-safe destructuring of named
 * exports from the indicated module.
 *
 * See: https://github.com/facebook/react/issues/14603
 */
export function lazy<M extends Record<string, any>, K extends keyof M>(loader: () => Promise<M>): AsPreLoadableLazyExotics<M> {
  return new Proxy({} as AsPreLoadableLazyExotics<M>, {
    get: (target, exportName) => {
      // Type for the current component.
      type C = React.LazyExoticComponent<M[K]>;
      const LazyComponent: C = React.lazy(async () => loadComponent(loader, exportName as K));
      let PreloadedComponent: C;

      const ProxyComponent = React.forwardRef((props: React.ComponentProps<C>, ref: React.ForwardedRef<C>) => {
        const componentRef = React.useRef(PreloadedComponent ?? LazyComponent);
        return React.createElement(componentRef.current, Object.assign(ref ? { ref } : {}, props));
      }) as PreLoadableLazyExoticComponent<C>;

      ProxyComponent.preload = async () => {
        PreloadedComponent = (await loadComponent(loader, exportName as K)).default;
      };

      return ProxyComponent;
    }
  });
}
