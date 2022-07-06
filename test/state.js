import { deepStrictEqual, strictEqual } from 'assert'
import tehanu from 'tehanu'
import { walk } from 'estree-walkie'
import { parse } from 'meriyah'

const parseTest = source => parse(source, { module: true, next: true })
const test = tehanu(import.meta.url)

test('maintain state across visitor levels', () => {
  const program = parseTest(`
    export function hello(props) {
      var name = props.name || 'world'
      return 'Howdy, ' + name
    }
  `)

  const seen = []
  walk(program, {
    FunctionDeclaration(_node, state) {
      state.parent = 'hello'
      seen.push('function')
    },
    VariableDeclaration(_node, state) {
      strictEqual(state.parent, 'hello')
      state.variable = 'name'
      seen.push('variable')
    },
    ReturnStatement(_node, state) {
      strictEqual(state.parent, 'hello')
      strictEqual(state.variable, 'name')
      seen.push('return')
    }
  }, undefined, {})

  deepStrictEqual(seen, ['function', 'variable', 'return'])
})

test('accept initial state value', () => {
  const state = { count: 0 }
  const program = parseTest(`
    export function hello(props) {
      var name = props.name || 'world'
      return 'Howdy, ' + name
    }
  `)

  walk(program, {
    Identifier(_n, s) {
      strictEqual(s, state)
      s.count++
    }
  }, undefined, state)

  strictEqual(state.count, 6)
})
