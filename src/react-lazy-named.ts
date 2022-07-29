import React from 'react';


/**
 * Accepts an object and returns a new object where:
 * - All keys whose value is a React component are mapped to lazy components
 * - All keys whose value is an object are recursively mapped
 * - All keys whose value is any other type are omitted
 */
type AsLazyExotics<O extends Record<string, any>> = {
  // We can use `as` clauses in the key definition of our mapped type to filter
  // values that are not React components. For values that are React
  // components, wrap them in LazyExoticComponent.
  [P in keyof O as O[P] extends React.ComponentType<any>
    ? P
    : O[P] extends Record<string, any>
      ? P
      : never
  ]: O[P] extends React.ComponentType<any>
    ? React.LazyExoticComponent<O[P]>
    : O[P] extends Record<string, any>
      ? AsLazyExotics<O[P]>
      : never;
};


/**
 * Works like `React.lazy`, but allows for type-safe destructuring of named
 * exports from the indicated module.
 *
 * See: https://github.com/facebook/react/issues/14603
 */
export function lazy<M extends Record<string, any>, K extends keyof M>(loader: () => Promise<M>): AsLazyExotics<M> {
  // @ts-expect-error; Initial target does not match type of return value.
  return new Proxy({}, {
    get: (target: M, exportName: K) => {
      return React.lazy(async () => loader().then(moduleExports => {
        return {
          default: moduleExports[exportName]
        };
      }));
    }
  });
}
