(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.seek = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = seek;
var E_SHOW = 'Argument 1 of seek must use filter NodeFilter.SHOW_TEXT.';
var E_SEEK = 'Argument 2 of seek is neither a number nor Text Node.';

function seek(iter, where) {
  var predicates = null;

  if (iter.whatToShow !== NodeFilter.SHOW_TEXT) {
    throw new Error(E_SHOW);
  }

  if (isNumber(where)) {
    predicates = {
      forward: function forward(_, count) {
        return count <= where;
      },
      backward: function backward(_, count) {
        return count > where;
      }
    };
  } else if (isText(where)) {
    predicates = {
      forward: function forward(node, _) {
        return node === where || before(node, where);
      },
      backward: function backward(node, _) {
        return after(node, where);
      }
    };
  } else {
    throw new Error(E_SEEK);
  }

  if (!iter.pointerBeforeReferenceNode) {
    iter.previousNode();
  }

  var count = 0;

  do {
    var _curNode = iter.nextNode();
    if (_curNode === null) break;
    count += _curNode.textContent.length;
  } while (predicates.forward(curNode, count));

  do {
    var _curNode2 = iter.previousNode();
    if (_curNode2 === null) break;
    count -= _curNode2.textContent.length;
  } while (predicates.backward(curNode, count));

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

},{}]},{},[1])(1)
});