const E_SEEK = 'Argument 1 of seek is neither a number nor Text Node.';
const E_SHOW = 'NodeIterator.whatToShow is not NodeFilter.SHOW_TEXT.';

const FRAME_RATE = 60;
const TICK_LENGTH = 1000 / FRAME_RATE;


function before(referenceNode, node) {
  return referenceNode.compareDocumentPosition(node) &
    (Node.DOCUMENT_POSITION_FOLLOWING | Node.DOCUMENT_CONTAINED_BY);
}


function after(referenceNode, node) {
  return referenceNode.compareDocumentPosition(node) &
    (Node.DOCUMENT_POSITION_PRECEDING | Node.DOCUMENT_CONTAINS);
}


function checkPreconditions(iter) {
  if (iter.whatToShow !== NodeFilter.SHOW_TEXT) {
    return Promise.reject(new Error(E_SHOW));
  }

  // Pre-condition: pointerBeforeReferenceNode
  if (!iter.pointerBeforeReferenceNode) {
    iter.previousNode();
  }
}


function seek(iter, predicates) {
  var yieldAt = Date.now() + TICK_LENGTH;

  function forward(count) {
    let curNode = iter.nextNode();

    if (curNode === null) {
      return Promise.resolve(count);
    }

    count += curNode.textContent.length;

    if (predicates.forward(curNode, count)) {
      return Promise.resolve(count);
    }

    if (Date.now() < yieldAt) {
      return forward(count)
    } else {
      return new Promise((resolve) => {
        requestAnimationFrame(() => {
          yieldAt = Date.now() + TICK_LENGTH;
          resolve(forward(count));
        });
      });
    }
  }

  function backward(count) {
    let curNode = iter.previousNode();

    if (curNode === null) {
      return Promise.resolve(count);
    }

    count -= curNode.textContent.length;

    if(predicates.backward(curNode, count)) {
      return Promise.resolve(count);
    }

    if (Date.now() < yieldAt) {
      return backward(count)
    } else {
      return new Promise((resolve) => {
        requestAnimationFrame(() => {
          yieldAt = Date.now() + TICK_LENGTH;
          resolve(backward(count));
        });
      });
    }
  }

  return forward(0).then(backward);
}


export function to(iter, node) {
  checkPreconditions(iter);
  return seek(iter, {
    forward: (curNode, _) => after(curNode, node),
    backward: (curNode, _) => curNode === node || before(curNode, node)
  });
}


export function by(iter, offset) {
  checkPreconditions(iter);
  return seek(iter, {
    forward: (_, count) => count > offset,
    backward: (_, count) => count <= offset
  });
}
