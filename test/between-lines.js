import { strictEqual } from 'assert'
import tehanu from 'tehanu'
import { walkBetweenLines } from '../dist/index.mjs'
import { parse } from 'meriyah'

const parseTest = source => parse(source, { module: true, next: true, loc: true })
const test = tehanu(import.meta.url)

test('should call visitors between lines', () => {
  const state = { count: 0 }
  const program = parseTest(`
    function hello(props) {
      return props.name || 'world'
    }
  `)
  const names = ['props', 'name']

  walkBetweenLines(program, 3, 3, {
    Identifier(n, s) {
      strictEqual(n.name, names[s.count])
      strictEqual(s, state)
      s.count++
    }
  }, undefined, state)

  strictEqual(state.count, 2)
})
