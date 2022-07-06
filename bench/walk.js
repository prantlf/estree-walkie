import { readFileSync } from 'fs'
import { strictEqual } from 'assert'
import benchmark from 'benchmark'
import babel from '@babel/traverse'
import { walk as estree } from 'estree-walker'
import eswalk from 'estree-walk'
import esvisit from 'estree-visitor'
import { simple as acorn } from 'acorn-walk'
import { visit as asttypes } from 'ast-types'
import { walk as astray } from 'astray'
import { walk as eswalkie } from 'estree-walkie'

const { default: traverse } = babel
const { Suite } = benchmark

const fixtures = {
  '@babel/traverse': 'fixtures/babel.json',
  'estree-walker': 'fixtures/estree.json',
  'estree-walk': 'fixtures/estree.json',
  'estree-visitor': 'fixtures/estree.json',
  'acorn-walk': 'fixtures/acorn.json',
  'ast-types': 'fixtures/estree.json',
  'astray': 'fixtures/estree.json',
  'estree-walkie': 'fixtures/estree.json'
}

const walkers = {
  '@babel/traverse': tree => {
    let count = 0
    traverse(tree, {
      noScope: true,
      Identifier() {
        ++count
      }
    })
    return count
  },
  'estree-walker': tree => {
    let count = 0
    estree(tree, {
      enter(n) {
        if (n.type === 'Identifier') {
          ++count
        }
      }
    })
    return count
  },
  'estree-walk': tree => {
    let count = 0
    eswalk(tree, {
      Identifier() {
        ++count
      }
    })
    return count
  },
  'estree-visitor': tree => {
    let count = 0
    esvisit(tree, {
      enter: function(n) {
        if (n.type === 'Identifier') {
          ++count
        }
      }
    })
    return count
  },
  'acorn-walk': tree => {
    let count = 0
    acorn(tree, {
      Identifier() {
        ++count
      }
    })
    return count
  },
  'ast-types': tree => {
    let count = 0
    asttypes(tree, {
      visitIdentifier(path) {
        ++count
        this.traverse(path)
      }
    })
    return count
  },
  'astray': tree => {
    let count = 0
    astray(tree, {
      Identifier() {
        ++count
      }
    })
    return count
  },
  'estree-walkie': tree => {
    let count = 0
    eswalkie(tree, {
      Identifier() {
        ++count
      }
    })
    return count
  }
}

const inputs = {}

console.log('\nValidation: ')
Object.keys(walkers).forEach(name => {
  const input = JSON.parse(readFileSync(fixtures[name], 'utf8'))
  const idents = walkers[name](input)

  inputs[name] = input
  try {
    strictEqual(idents, 46955, 'saw 46,955 identifiers')
    console.log('  ✔', `${name} (46,955 identifiers)`)
  } catch {
    console.log('  ✘', `${name} (${idents.toLocaleString()} identifiers)`)
  }
})

console.log('\nBenchmark:')
const suite = new Suite().on('cycle', ({ target }) => console.log('  ' + target))

Object.keys(walkers).forEach(name => {
  const walker = walkers[name]
  const input = inputs[name]
  suite.add(name + ' '.repeat(15 - name.length), () => walker(input))
})

suite.run()
