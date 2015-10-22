import ancestors from 'ancestors'
import contains from 'dom-contains'
import indexof from 'indexof'

const E_SHOW = 'Argument 1 of seek must use filter NodeFilter.SHOW_TEXT.'
const E_WHERE = 'Argument 2 of seek must be a number or a Text Node.'

const SHOW_TEXT = 4
const TEXT_NODE = 3

const DOCUMENT_POSITION_PRECEDING = 2
const DOCUMENT_POSITION_FOLLOWING = 4


export default function seek(iter, where) {
  if (iter.whatToShow !== SHOW_TEXT) {
    throw new Error(E_SHOW);
  }

  let count = 0;
  let node = iter.referenceNode;
  let predicates = null;

  if (isNumber(where)) {
    predicates = {
      forward: () => count < where,
      backward: () => count > where
    };
  } else if (isText(where)) {
    let forward = before(node, where) ? () => false : () => node !== where
    let backward = () => node != where || !iter.pointerBeforeReferenceNode
    predicates = {forward, backward}
  } else {
    throw new Error(E_WHERE);
  }

  while (predicates.forward() && (node = iter.nextNode()) !== null) {
    count += node.nodeValue.length;
  }

  while (predicates.backward() && (node = iter.previousNode()) !== null) {
    count -= node.nodeValue.length;
  }

  return count;
}


function isNumber(n) {
  return !isNaN(parseInt(n)) && isFinite(n);
}


function isText(node) {
  return node.nodeType === TEXT_NODE;
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

  if (left == null) return false
  if (right == null) return true

  let l = indexof(common.childNodes, left)
  let r = indexof(common.childNodes, right)
  return l > r
}
