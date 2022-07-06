import { deepStrictEqual, strictEqual } from 'assert'
import tehanu from 'tehanu'
import { walk } from 'estree-walkie'
import { parse } from 'meriyah'

const parseTest = source => parse(source, { module: true, next: true })
const test = tehanu(import.meta.url)

test('should skip children if parent dictates', () => {
  const program = parseTest(`
    export function hello(props) {
      if (props.disabled) {
        var name = props.name || 'world'
        var verb = props.informal ? 'Yo' : 'Hello'
        return verb + ' , ' + name
      }
    }
  `)

  let count = 0
  walk(program, {
    IfStatement() {
      return false
    },
    Identifier(_node) {
      count++
    }
  })

  // would be 12 without skip
  strictEqual(count, 2)
})

test('should skip Node children of terminal', () => {
  const program = parseTest(`
    let foo = 'bar'
    if (bar) baz = 'foo'
  `)

  let count = 0
  const idents = []

  walk(program, {
    Identifier(node) {
      count++
      idents.push(node.name)
    },
    VariableDeclaration(_node) {
      return false
    }
  })

  strictEqual(count, 2)
  deepStrictEqual(idents, ['bar', 'baz'])
})

test('should skip children of block', () => {
  const program = parseTest(`
    let foo = 'bar'
    if (bar) baz = 'foo'
  `)

  let count = 0
  const idents = []

  walk(program, {
    Identifier(node) {
      count++
      idents.push(node.name)
    },
    IfStatement(_node) {
      return false
    }
  })

  strictEqual(count, 1)
  deepStrictEqual(idents, ['foo'])
})

test('should skip children on enter', () => {
  const program = parseTest(`
    let foo = 'bar'
    if (bar) baz = 'foo'
  `)

  let count = 0
  const idents = []

  walk(program, {
    Identifier(node) {
      count++
      idents.push(node.name)
    },
    IfStatement: {
      enter(_node) {
        return false
      }
    }
  })

  strictEqual(count, 1)
  deepStrictEqual(idents, ['foo'])
})

test('should skip children on exit', () => {
  const program = parseTest(`
    let foo = 'bar'
    if (bar) baz = 'foo'
  `)

  let count = 0
  const idents = []

  walk(program, {
    Identifier(node) {
      count++
      idents.push(node.name)
    },
    IfStatement: {
      exit(_node) {
        return false
      }
    }
  })

  // skip() on exit is too late
  strictEqual(count, 3)
  deepStrictEqual(idents, ['foo', 'bar', 'baz'])
})
