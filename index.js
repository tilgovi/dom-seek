'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = seek;
var E_SHOW = 'Argument 1 of seek must use filter NodeFilter.SHOW_TEXT.';
var E_SEEK = 'Argument 2 of seek is neither a number nor Text Node.';

function seek(iter, where) {

  if (iter.whatToShow !== NodeFilter.SHOW_TEXT) {
    throw new Error(E_SHOW);
  }

  var count = 0;
  var node = null;
  var predicates = null;

  if (isNumber(where)) {
    predicates = {
      forward: function forward() {
        return count <= where;
      },
      backward: function backward() {
        return count > where;
      }
    };
  } else if (isText(where)) {
    predicates = {
      forward: function forward() {
        return node === where || before(node, where);
      },
      backward: function backward() {
        return after(node, where);
      }
    };
  } else {
    throw new Error(E_SEEK);
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
  } while (predicates.forward());

  do {
    node = iter.previousNode();
    if (node === null) break;
    count -= node.textContent.length;
  } while (predicates.backward());

  return count;
}

function isNumber(n) {
  return !isNaN(parseInt(n)) && isFinite(n);
}

function isText(node) {
  return node.nodeType === Node.TEXT_NODE;
}

function before(referenceNode, node) {
  return referenceNode.compareDocumentPosition(node) & (Node.DOCUMENT_POSITION_FOLLOWING | Node.DOCUMENT_CONTAINED_BY);
}

function after(referenceNode, node) {
  return referenceNode.compareDocumentPosition(node) & (Node.DOCUMENT_POSITION_PRECEDING | Node.DOCUMENT_CONTAINS);
}
module.exports = exports['default'];

