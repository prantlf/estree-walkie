import { strictEqual } from 'assert'
import tehanu from 'tehanu'
import { walkAtPosition } from 'estree-walkie'
import { parse } from 'meriyah'

const parseTest = source => parse(source, { module: true, next: true, loc: true })
const test = tehanu(import.meta.url)

test('should call visitors at location', () => {
  const state = { count: 0 }
  const program = parseTest(`
    function hello(props) {
      return props.name || 'world'
    }
  `)

  walkAtPosition(program, 3, 19, {
    Identifier(n, s) {
      strictEqual(n.name, 'name')
      strictEqual(s, state)
      s.count++
    }
  }, undefined, state)

  strictEqual(state.count, 1)
})
