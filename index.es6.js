const E_ITER = 'Argument 1 of seek must be a NodeIterator.';
const E_SHOW = 'Argument 1 of seek must use filter NodeFilter.SHOW_TEXT.';
const E_WHERE = 'Argument 2 of seek must be a number or a Text Node.';


export default function seek(iter, where) {
  if (!(iter instanceof NodeIterator)) {
    throw new Error(E_ITER);
  }

  if (iter.whatToShow !== NodeFilter.SHOW_TEXT) {
    throw new Error(E_SHOW);
  }

  let count = 0;
  let node = null;
  let predicates = null;

  if (isNumber(where)) {
    predicates = {
      forward: () => count <= where,
      backward: () => count > where
    };
  } else if (isText(where)) {
    predicates = {
      forward: () => node === where || before(node, where),
      backward: () => after(node, where)
    };
  } else {
    throw new Error(E_WHERE);
  }

  if (iter.pointerBeforeReferenceNode) {
    node = iter.referenceNode;
  } else {
    node = iter.previousNode();
  }

  do {
    node = iter.nextNode();
    if (node === null) break;
    count += node.textContent.length;
  } while(predicates.forward());

  do {
    node = iter.previousNode();
    if (node === null) break;
    count -= node.textContent.length;
  } while(predicates.backward());

  return count;
}


function isNumber(n) {
  return !isNaN(parseInt(n)) && isFinite(n);
}


function isText(node) {
  return node.nodeType === Node.TEXT_NODE;
}


function before(referenceNode, node) {
  return referenceNode.compareDocumentPosition(node) &
    (Node.DOCUMENT_POSITION_FOLLOWING | Node.DOCUMENT_CONTAINED_BY);
}


function after(referenceNode, node) {
  return referenceNode.compareDocumentPosition(node) &
    (Node.DOCUMENT_POSITION_PRECEDING | Node.DOCUMENT_CONTAINS);
}
