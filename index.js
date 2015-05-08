/** @module text-walker */

/* Internal constants */

const E_NODE = 'Argument 1 of TextIterator.seek is neither Element nor Text.';
const E_TYPE = 'Argument 1 of TextIterator.seek is neither Numer nor Node.';
const SEEKABLE_NODES = [Node.ELEMENT_NODE, Node.TEXT_NODE, Node.DOCUMENT_NODE];


/* Public interface */

export class TextIterator {};

export function createTextIterator(root, filter) {
  let document = global.document;
  let iter = document.createNodeIterator(root, NodeFilter.SHOW_TEXT, filter);

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
        if (iter.referenceNode) {
          return iter.referenceNode;
        } else {
          // IE portability
          iter.nextNode();
          return iter.previousNode();
        }
      }
    },

    seek: {
      value: function (where) {
        let self = this;

        if (!isNaN(parseInt(where)) && isFinite(where)) {
          return seek_offset(iter, parseInt(where));
        } else if (where.nodeType) {
          if (SEEKABLE_NODES.indexOf(where.nodeType) !== -1) {
            return seek_node(iter, where);
          } else {
            return Promise.reject(new TypeError(E_NODE));
          }
        } else {
          return Promise.reject(new TypeError(E_TYPE));
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
    } else {
      count += curNode.textContent.length;
      if (after(curNode, node)) {
        return Promise.resolve(count);
      } else {
        return new Promise((r) => setTimeout(r, 0, count)).then(forward);
      }
    }
  }

  function backward(count) {
    let curNode = iter.previousNode();
    if (curNode === null) {
      return Promise.resolve(count);
    } else {
      count -= curNode.textContent.length;
      if(curNode === node || before(curNode, node)) {
        return Promise.resolve(count);
      } else {
        return new Promise((r) => setTimeout(r, 0, count)).then(backward);
      }
    }
  }

  return forward(0).then(backward);
}


function seek_offset(iter, offset) {
  function forward(count) {
    let curNode = iter.nextNode()
    if (curNode === null) {
      return Promise.resolve(count);
    } else {
      count += curNode.textContent.length;
      if (count > offset) {
        return Promise.resolve(count);
      } else {
        return new Promise((r) => setTimeout(r, 0, count)).then(forward);
      }
    }
  }

  function backward(count) {
    let curNode = iter.previousNode();
    if (curNode === null) {
      return Promise.resolve(count);
    } else {
      count -= curNode.textContent.length;
      if (count <= offset) {
        return Promise.resolve(count);
      } else {
        return new Promise((r) => setTimeout(r, 0, count)).then(backward);
      }
    }
  }

  return forward(0).then(backward);
}
