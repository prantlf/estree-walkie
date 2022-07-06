import { deepStrictEqual, ok, strictEqual } from 'assert'
import tehanu from 'tehanu'
import { walk } from 'estree-walkie'
import { parse } from 'meriyah'

function parseTest(source) {
  return parse(source, { module: true, next: true })
}

const test = tehanu(import.meta.url)

test('should be able to visit base node', () => {
  let seen = false
  const program = parseTest(`var hello = 'world'`)
  walk(program, {
    Program(node) {
      ok(node === program)
      seen = true
    }
  })
  ok(seen)
})

test('should traverse child nodes recursively', () => {
  const seen = []
  const program = parseTest(`
    const INFORMAL = true
    export function testing(props) {
      let name = props.name || props.fullname
      return INFORMAL ? whaddup(name) : greet(name)
    }
  `)

  walk(program, {
    Identifier(node) {
      seen.push(node.name)
    }
  })

  deepStrictEqual(seen, [
    'INFORMAL',
    'testing', 'props',
    'name', 'props', 'name', 'props', 'fullname',
    'INFORMAL', 'whaddup', 'name', 'greet', 'name'
  ])
})

test('should support visitors with enter/exit methods', () => {
  const state = { count: 0 }
  const program = parseTest(`
    function hello(props) {
      return props.name || 'world'
    }
  `)

  walk(program, {
    Program: {
      enter(_n, s) {
        strictEqual(s, state)
        strictEqual(s.count, 0)
      },
      exit(_n, s) {
        strictEqual(s, state)
        strictEqual(s.count, 4)
      }
    },
    Identifier(_n, s) {
      strictEqual(s, state)
      s.count++
    }
  }, undefined, state)

  strictEqual(state.count, 4)
})

test('should pass parent node to visitors', () => {
  const state = { count: 0 }
  const program = parseTest(`
    function hello(props) {
      return props.name || 'world'
    }
  `)

  walk(program, {
    Program(_n, s, p) {
      strictEqual(p, undefined)
      strictEqual(s, state)
      strictEqual(s.count, 0)
      s.count++
    },
    Identifier(_n, s, p) {
      strictEqual(typeof p, 'object')
      strictEqual(s, state)
      s.count++
    }
  }, {}, state)

  strictEqual(state.count, 5)
})
