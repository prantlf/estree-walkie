import fs from 'fs'
import path from 'path'
import * as acorn from 'acorn'
import * as meriyah from 'meriyah'
import babel from '@babel/parser'

const D3 = path.join('node_modules/d3/dist/d3.min.js')
const source = fs.readFileSync(D3, 'utf8')

fs.mkdirSync('fixtures', { recursive: true })

fs.writeFileSync(
  path.join('fixtures', 'estree.json'),
  JSON.stringify(meriyah.parse(source), null, 2),
)

fs.writeFileSync(
  path.join('fixtures', 'acorn.json'),
  JSON.stringify(acorn.parse(source, { ecmaVersion: 'latest' }), null, 2),
)

fs.writeFileSync(
  path.join('fixtures', 'babel.json'),
  JSON.stringify(babel.parse(source), null, 2),
)
