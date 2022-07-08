function walkInner(node, test, visitor, fallback, state, parent) {
  if (test && !test(node)) return

  const visit = visitor[node.type] || fallback
  if (visit) {
    if (typeof visit === 'function') {
      if (visit(node, state, parent) === false) return false
    } else if (visit.enter) {
      if (visit.enter(node, state, parent) === false) return false
    }
  }

  for (const key in node) {
    const child = node[key]
    if (child && typeof child === 'object') {
      if (Array.isArray(child)) {
        for (const item of child) {
          if (item && typeof item === 'object') {
            walkInner(item, test, visitor, fallback, state, node)
          }
        }
      } else if (child.type && child !== parent) {
        walkInner(child, test, visitor, fallback, state, node)
      }
    }
  }

  if (visit && visit.exit) return visit.exit(node, state, parent)
}

export function walk(node, visitor, fallback, state) {
  return walkInner(node, undefined, visitor, fallback, state)
}

export function walkAtOffset(node, offset, visitor, fallback, state) {
  const test = node => {
    const { range } = node
    return range[0] <= offset && range[1] > offset
  }
  return walkInner(node, test, visitor, fallback, state)
}

export function walkInRange(node, start, end, visitor, fallback, state) {
  const test = node => {
    const { range } = node
    return range[0] < end && range[1] > start
  }
  return walkInner(node, test, visitor, fallback, state)
}

export function walkAtPosition(node, line, column, visitor, fallback, state) {
  const test = node => {
    const { loc } = node
    const { start, end } = loc
    return start.line <= line && end.line >= line &&
      (start.line !== line || end.line !== line ||
       start.column <= column && end.column > column)
  }
  return walkInner(node, test, visitor, fallback, state)
}

export function walkBetweenLines(node, first, last, visitor, fallback, state) {
  const test = node => {
    const { loc } = node
    return loc.start.line <= last && loc.end.line >= first
  }
  return walkInner(node, test, visitor, fallback, state)
}
