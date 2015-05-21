'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = seek;
var E_ITER = 'Argument 1 of seek must be a NodeIterator.';
var E_SHOW = 'Argument 1 of seek must use filter NodeFilter.SHOW_TEXT.';
var E_WHERE = 'Argument 2 of seek must be a number or a Text Node.';

function seek(iter, where) {
  if (!(iter instanceof NodeIterator)) {
    throw new Error(E_ITER);
  }

  if (iter.whatToShow !== NodeFilter.SHOW_TEXT) {
    throw new Error(E_SHOW);
  }

  var count = 0;
  var node = iter.referenceNode;
  var predicates = null;

  if (isNumber(where)) {
    predicates = {
      forward: function forward() {
        return count < where;
      },
      backward: function backward() {
        return count > where;
      }
    };
  } else if (isText(where)) {
    predicates = {
      forward: function forward() {
        return before(node, where);
      },
      backward: function backward() {
        return !iter.pointerBeforeReferenceNode || after(node, where);
      }
    };
  } else {
    throw new Error(E_WHERE);
  }

  while (predicates.forward() && (node = iter.nextNode()) !== null) {
    count += node.textContent.length;
  }

  while (predicates.backward() && (node = iter.previousNode()) !== null) {
    count -= node.textContent.length;
  }

  return count;
}

function isNumber(n) {
  return !isNaN(parseInt(n)) && isFinite(n);
}

function isText(node) {
  return node.nodeType === Node.TEXT_NODE;
}

function before(ref, node) {
  return ref.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_FOLLOWING;
}

function after(ref, node) {
  return ref.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_PRECEDING;
}
module.exports = exports['default'];

