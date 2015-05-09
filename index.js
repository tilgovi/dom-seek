/* Internal constants */

const E_ROOT = 'Argument 1 of createTextIterator is not an Element.';
const E_SEEK = 'Argument 1 of TextIterator.seek is neither a number nor Text.';


/* Public interface */

export class TextIterator extends NodeIterator {};

export function createTextIterator(root, filter) {
  let document = global.document;

  if (root.nodeType !== Node.ELEMENT_NODE) {
    throw new UnsupportedError(E_ROOT);
  }

  let iter = document.createNodeIterator(root, NodeFilter.SHOW_TEXT, filter);

  // IE compatibility
  if (typeof(iter.referenceNode) === 'undefined') {
    iter.referenceNode = root;
    iter.pointerBeforeReferenceNode = true;
  }

  // NodeIterator doesn't have a proper constructor so we don't either :(
  // Also, this keeps the NodeIterator private.
  return Object.create(TextIterator.prototype, {
    root: {
      value: root
    },

    whatToShow: {
      value: NodeFilter.SHOW_TEXT
    },

    filter: {
      value: filter
    },

    referenceNode: {
      get: function () {
        return iter.referenceNode;
      }
    },

    pointerBeforeReferenceNode: {
      get: function () {
        return iter.pointerBeforeReferenceNode;
      }
    },

    nextNode: {
      value: function () {
        var result = iter.nextNode();

        // IE compatibility
        if (typeof(iter.referenceNode) === 'undefined') {
          iter.referenceNode = result;
          iter.pointerBeforeReferenceNode = false;
        }

        return result;
      }
    },

    previousNode: {
      value: function () {
        var result = iter.previousNode();

        // IE compatibility
        if (typeof(iter.referenceNode) === 'undefined') {
          iter.referenceNode = result;
          iter.pointerBeforeReferenceNode = true;
        }

        return result;
      }
    },

    seek: {
      value: function (where) {
        if (isNumber(where)) {
          return seek_offset(this, parseInt(where));
        } else if (isText(where)) {
          return seek_node(this, where);
        } else {
          return Promise.reject(new UnsupportedError(E_SEEK));
        }
      }
    }
  });
}


export function install() {
  let document = global.document;

  if (typeof global.TextIterator === 'undefined') {
    global.TextIterator = TextIterator;
  }

  if (typeof document.createTextIterator === 'undefined') {
    document.createTextIterator = createTextIterator;
  }
}


/* Private implementation */


function isNumber(n) {
  return !isNaN(parseInt(n)) && isFinite(n);
}


function isText(node) {
  if (typeof(node.nodeType) === 'number') {
    return node.nodeType === Node.TEXT_NODE;
  } else {
    return false;
  }
}


function before(referenceNode, node) {
  return referenceNode.compareDocumentPosition(node) &
    (Node.DOCUMENT_POSITION_FOLLOWING | Node.DOCUMENT_CONTAINED_BY);
}


function after(referenceNode, node) {
  return referenceNode.compareDocumentPosition(node) &
    (Node.DOCUMENT_POSITION_PRECEDING | Node.DOCUMENT_CONTAINS);
}


function seek_node(iter, node) {
  function forward(count) {
    let curNode = iter.nextNode();

    if (curNode === null) {
      return Promise.resolve(count);
    }

    count += curNode.textContent.length;

    if (after(curNode, node)) {
      return Promise.resolve(count);
    }

    return new Promise((r) => setTimeout(r, 0, count)).then(forward);
  }

  function backward(count) {
    let curNode = iter.previousNode();

    if (curNode === null) {
      return Promise.resolve(count);
    }

    count -= curNode.textContent.length;

    if(curNode === node || before(curNode, node)) {
      return Promise.resolve(count);
    }

    return new Promise((r) => setTimeout(r, 0, count)).then(backward);
  }

  return forward(0).then(backward);
}


function seek_offset(iter, predicates) {
  function forward(count) {
    let curNode = iter.nextNode()

    if (curNode === null) {
      return Promise.resolve(count);
    }

    count += curNode.textContent.length;

    if (count > offset) {
      return Promise.resolve(count);
    }

    return new Promise((r) => setTimeout(r, 0, count)).then(forward);
  }

  function backward(count) {
    let curNode = iter.previousNode();

    if (curNode === null) {
      return Promise.resolve(count);
    }

    count -= curNode.textContent.length;

    if (count <= offset) {
      return Promise.resolve(count);
    }

    return new Promise((r) => setTimeout(r, 0, count)).then(backward);
  }

  return forward(0).then(backward);
}
