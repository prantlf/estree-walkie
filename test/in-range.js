import { strictEqual } from 'assert'
import tehanu from 'tehanu'
import { walkInRange } from 'estree-walkie'
import { parse } from 'meriyah'

const parseTest = source => parse(source, { module: true, next: true, ranges: true })
const test = tehanu(import.meta.url)

test('should call visitors within small range', () => {
  const state = { count: 0 }
  const program = parseTest(`
    function hello(props) {
      return props.name || 'world'
    }
  `)

  walkInRange(program, 50, 54, {
    Identifier(n, s) {
      strictEqual(n.name, 'name')
      strictEqual(s, state)
      s.count++
    }
  }, undefined, state)

  strictEqual(state.count, 1)
})

test('should call visitors within large range', () => {
  const state = { count: 0 }
  const program = parseTest(`
    function hello(props) {
      return props.name || 'world'
    }
  `)
  const names = ['props', 'name']

  walkInRange(program, 46, 58, {
    Identifier(n, s) {
      strictEqual(n.name, names[s.count])
      strictEqual(s, state)
      s.count++
    }
  }, undefined, state)

  strictEqual(state.count, 2)
})
