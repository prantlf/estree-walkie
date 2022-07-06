import { strictEqual } from 'assert'
import tehanu from 'tehanu'
import { walkAtOffset } from 'estree-walkie'
import { parse } from 'meriyah'

const parseTest = source => parse(source, { module: true, next: true, ranges: true })
const test = tehanu(import.meta.url)

test('should call visitors at offset', () => {
  const state = { count: 0 }
  const program = parseTest(`
    function hello(props) {
      return props.name || 'world'
    }
  `)

  walkAtOffset(program, 50, {
    Identifier(n, s) {
      strictEqual(n.name, 'name')
      strictEqual(s, state)
      s.count++
    }
  }, undefined, state)

  strictEqual(state.count, 1)
})
