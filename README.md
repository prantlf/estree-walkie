# estree-walkie

[![Latest version](https://img.shields.io/npm/v/estree-walkie)
 ![Dependency status](https://img.shields.io/librariesio/release/npm/estree-walkie)
](https://www.npmjs.com/package/estree-walkie)
[![Coverage](https://codecov.io/gh/prantlf/estree-walkie/branch/master/graph/badge.svg)](https://codecov.io/gh/prantlf/estree-walkie)

Walks a JavaScript [AST] compatible with [ESTree].

* [ESM], [CJS] and [UMD] modules offering an [API] for programmatic usage in [Node.js], [Deno] and web browser.
* Includes TypeScript types.
* No dependencies.
* Tiny size - 926 B minified, 435 B gzipped, 390 B brotlied.
* [Blazingly fast].

## Synopsis

```js
import { parse } from 'meriyah'
import { walk } from 'estree-walkie'

const program = parse('...', { module: true, next: true })
const identifiers = []

walk(program, {
  Identifier(node) {
    identifiers.push(node.name)
  }
})
```

## API

Exported methods:

    walk(node, visitor, fallback, state)
    walkAtOffset(node, offset, visitor, fallback, state)
    walkAtPosition(node, line, column, visitor, fallback, state)
    walkInRange(node, start, end, visitor, fallback, state)
    walkBetweekLines(node, first, last, visitor, fallback, state)

Arguments:

* `node` - [AST] node to start walking with
* `visitor` - object with visiting handlers named by node types
* `fallback` - handler for nodes not matched by the visitor (optional)
* `state` - custom value passed to each handler (optional)
* `offset` - source code character offset to walk the [AST] around
* `start` and `ens` - source code character range to walk the [AST] within
* `line` and `column` - source code position to walk the [AST] around
* `first` and `last` - source code line range to walk the [AST] within

Visiting handler:

    handler(node, state, parent) => boolean?
    { enter?: handler, exit?: handler }

* `node` - currently visited [AST] node
* `state` - custom value passed to the walking method (optional)
* `node` - parent of the currently visited [AST] node

If the handler retuns `false` children of the current node will not be visited.
If an object with `enter` and/or `exit` methods is used as a visiting handler, `enter` will be caled before visiting children and `exit` after visiting children of the current node.

## Node.js usage

Make sure that you use [Node.js] >= 8.3. Install the `estree-walkie` package locally using your favourite package manager:

```
npm i estree-walkie
pnpm i estree-walkie
yarn add estree-walkie
```

Either import methods from the [API] using the [CJS] module:

```js
const { walk, walkAtOffset, walkAtPosition, walkInRange, walkBetweekLines } = require('estree-walkie')
...
```

Or import methods from the [API] using the [ESM] module:

```js
import { walk, walkAtOffset, walkAtPosition, walkInRange, walkBetweekLines } from 'estree-walkie'
...
```

## Browser usage

You can either compile this module to your application bundle, or load it directly to the browser. For the former, you would install this package and import methods from the [API] in the same way as for the [Node.js usage]. For the latter, you would either refer to the module installed locally, or to the module from the [UNPKG CDN], for example:

    node_modules/estree-walkie/dist/index.umd.min.js
    https://unpkg.com/estree-walkie@0.0.1/dist/index.min.mjs

The following modules are available in the `dist` directory:

| Name               | Type                       |
| ------------------ | -------------------------- |
| `index.js`         | [CJS] module, not minified |
| `index.mjs`        | [ESM] module, not minified |
| `index.min.mjs`    | [ESM] module, minified     |
| `index.umd.js`     | [UMD] module, not minified |
| `index.umd.min.js` | [UMD] module, minified     |

Either import methods from the [API] using the [ESM] module:

```html
<script type=module>
  import { walk, walkAtOffset, walkAtPosition, walkInRange, walkBetweekLines }
    from 'https://unpkg.com/estree-walkie@0.0.1/dist/index.min.mjs'
  ...
</script>
```

Or import methods from the [API] using the [UMD] module, which will set a global object `estree-walkie`:

```html
<script src=https://unpkg.com/estree-walkie@0.0.1/dist/index.umd.min.js></script>
<script>
  (() => {
    const { walk, walkAtOffset, walkAtPosition, walkInRange, walkBetweekLines } = estreeWalkie
    ...
  })()
</script>
```

If an [AMD] module loader is detected, the [UMD] module will return exports es expected:

```html
<script>
  require(['https://unpkg.com/estree-walkie@0.0.1/dist/index.umd.min.js'],
    ({ walk, walkAtOffset, walkAtPosition, walkInRange, walkBetweekLines }) => {
      ...
    })
</script>
```

## Performance

Comparison with other libraries, which allow visiting [AST] nodes by their types:

    $ cd bench && pnpm i && node walk

    Validation:
      ✔ @babel/traverse (46,955 identifiers)
      ✔ estree-walker (46,955 identifiers)
      ✔ estree-walk (46,955 identifiers)
      ✔ estree-visitor (46,955 identifiers)
      ✘ acorn-walk (26,662 identifiers)
      ✔ ast-types (46,955 identifiers)
      ✔ astray (46,955 identifiers)
      ✔ estree-walkie (46,955 identifiers)

    Benchmark:
      @babel/traverse x 8.18 ops/sec ±7.00% (25 runs sampled)
      estree-walker   x 95.59 ops/sec ±2.63% (69 runs sampled)
      estree-walk     x 46.53 ops/sec ±1.57% (60 runs sampled)
      estree-visitor  x 61.86 ops/sec ±1.87% (64 runs sampled)
      acorn-walk      x 78.81 ops/sec ±0.92% (68 runs sampled)
      ast-types       x 3.65 ops/sec ±8.24% (14 runs sampled)
      astray          x 98.37 ops/sec ±0.93% (72 runs sampled)
      estree-walkie   x 131 ops/sec ±0.99% (76 runs sampled)

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using `npm test`.

## License

Copyright (c) 2022 Ferdinand Prantl

Licensed under the MIT license.

[AST]: https://astexplorer.net/
[ESTree]: https://github.com/estree/estree#readme
[Node.js]: https://nodejs.org/
[Deno]: https://deno.land/
[Blazingly fast]: #performance
[API]: #api
[Node.js usage]: #nodejs-usage
[UNPKG CDN]: https://unpkg.com/
[CJS]: https://blog.risingstack.com/node-js-at-scale-module-system-commonjs-require/#commonjstotherescue
[UMD]: https://github.com/umdjs/umd#readme
[AMD]: https://github.com/amdjs/amdjs-api/wiki/AMD
[ESM]: https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/#content-head
