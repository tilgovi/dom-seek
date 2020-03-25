import ancestors from 'ancestors'
import indexOf from 'index-of'

const E_END = 'Iterator exhausted before seek ended.'
const E_SHOW = 'Argument 1 of seek must use filter NodeFilter.SHOW_TEXT.'
const E_WHERE = 'Argument 2 of seek must be a number or a Text Node.'

const SHOW_TEXT = 4
const TEXT_NODE = 3


export default function seek(iter, where) {
  if (iter.whatToShow !== SHOW_TEXT) {
    throw new DOMException(E_SHOW, 'InvalidStateError');
  }

  let count = 0
  let node = iter.referenceNode
  let predicates = null

  if (isNumber(where)) {
    predicates = {
      forward: () => count < where,
      backward: () => count > where || !iter.pointerBeforeReferenceNode,
    }
  } else if (isText(where)) {
    let forward = before(node, where) ? () => false : () => node !== where
    let backward = () => node != where || !iter.pointerBeforeReferenceNode
    predicates = {forward, backward}
  } else {
    throw new TypeError(E_WHERE);
  }

  while (predicates.forward()) {
    node = iter.nextNode();

    if (node === null) {
      throw new DOMException(E_END, 'IndexSizeError');
    }

    count += node.nodeValue.length
  }

  if (iter.nextNode()) {
    node = iter.previousNode()
  }

  while (predicates.backward()) {
    node = iter.previousNode();

    if (node === null) {
      throw new DOMException(E_END, 'IndexSizeError');
    }

    count -= node.nodeValue.length
  }

  return count
}


function isNumber(n) {
  return !isNaN(parseInt(n)) && isFinite(n)
}


function isText(node) {
  return node.nodeType === TEXT_NODE
}


function before(ref, node) {
  if (ref === node) return false

  let common = null
  let left = [ref].concat(ancestors(ref)).reverse()
  let right = [node].concat(ancestors(node)).reverse()

  while (left[0] === right[0]) {
    common = left.shift()
    right.shift()
  }

  left = left[0]
  right = right[0]

  let l = indexOf(common.childNodes, left)
  let r = indexOf(common.childNodes, right)

  return l > r
}


function DOMException(message, name) {
  this.message = message
  this.stack = (new Error()).stack
  this.name = name
  this.code = {
    IndexSizeError: 1,
    InvalidStateError: 11,
  }[name]
  this.toString = function () {
    return name + ': ' + message
  }
}
DOMException.prototype = new Error
