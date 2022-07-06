import * as AST from 'estree'

type Handler = (node: AST.Node, state: any, parent: AST.Node) => boolean | void

type Handlers = {
  enter?: Handler
  exit?: Handler
}

type Visitor = {
  [key in (keyof AST)]?: Handler | Handlers
}

export function walk(node: AST.Node, visitor: Visitor, fallback?: Handler | Handlers, state?: any): void
export function walkAtOffset(node: AST.Node, offset: number, visitor: Visitor, fallback?: Handler | Handlers, state?: any): void
export function walkAtPosition(node: AST.Node, line: number, column: number, visitor: Visitor, fallback?: Handler | Handlers, state?: any): void
export function walkInRange(node: AST.Node, start: number, end: number, visitor: Visitor, fallback?: Handler | Handlers, state?: any): void
export function walkBetweenLines(node: AST.Node, first: number, last: number, visitor: Visitor, fallback?: Handler | Handlers, state?: any): void
