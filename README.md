<a href="#top" id="top">
  <img src="https://user-images.githubusercontent.com/441546/181700454-90850f61-6a4e-4e7d-8bbc-079cac96be99.png" style="max-width: 100%;">
</a>
<p align="center">
  <a href="https://www.npmjs.com/package/@darkobits/react-lazy-named"><img src="https://img.shields.io/npm/v/@darkobits/react-lazy-named.svg?style=flat-square"></a>
  <a href="https://github.com/darkobits/react-lazy-named/actions?query=workflow%3Aci"><img src="https://img.shields.io/github/actions/workflow/status/darkobits/react-lazy-named/ci.yml?style=flat-square"></a>
  <a href="https://app.codecov.io/gh/darkobits/react-lazy-named/branch/master"><img src="https://img.shields.io/codecov/c/github/darkobits/react-lazy-named/master?style=flat-square"></a>
  <a href="https://depfu.com/github/darkobits/react-lazy-named"><img src="https://img.shields.io/depfu/darkobits/react-lazy-named?style=flat-square"></a>
  <a href="https://conventionalcommits.org"><img src="https://img.shields.io/static/v1?label=commits&message=conventional&style=flat-square&color=398AFB"></a>
</p>

- Lazily import React components that are defined using named exports.
- Supports destructuring syntax, including nesting.
- 100% type-safe.

## Install

```
$ npm install @darkobits/react-lazy-named
```

## Use

Assuming we have a file `Components.tsx` that exports 2 React components and some other value:

> `Components.tsx`

```tsx
import React from 'react';

export const Foo = () => {
  return (
    <div>Foo</div>
  )
};

export const Bar = () => {
  return (
    <div>Bar</div>
  );
}

export const Baz = false;
```

Then, in another file, we can lazily import these components thusly:

> `App.tsx`

```tsx
import { lazy } from '@darkobits/react-lazy-named';
import React from 'react';

// Foo, Bar are correctly typed as lazy React components.
const { Foo, Bar } = lazy(async () => import('./Components.tsx'));

// Type error.
const { Baz } = lazy(async () => import('./Components.tsx'));

export const App = () => {
  return (
    <Foo />
    <Bar />
  )
}
```

### Pre-Loading

This module attaches a static `preload` method to components that can be invoked to optimistically
pre-load a component. This method returns a `Promise` that will resolve when the component has loaded.

```ts
import { lazy } from '@darkobits/react-lazy-named';

const { Foo } = lazy(async () => import('./Components.tsx'));

await Foo.preload();
```

## Caveats

- When using this (or other solutions) to circumvent the [default export requirement](https://reactjs.org/docs/code-splitting.html#named-exports),
  tree-shaking will not work on the imported module. In most cases, this should not be an issue.

## Addendum

- Inspired by [this discussion](https://github.com/facebook/react/issues/14603) on the topic.

<br />
<a href="#top">
  <img src="https://user-images.githubusercontent.com/441546/102322726-5e6d4200-3f34-11eb-89f2-c31624ab7488.png" style="max-width: 100%;">
</a>
