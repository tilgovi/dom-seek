(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.seek = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.createTextIterator = createTextIterator;
exports.install = install;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @module text-walker */

/* Internal constants */

var E_NODE = 'Argument 1 of TextIterator.seek is neither Element nor Text.';
var E_TYPE = 'Argument 1 of TextIterator.seek is neither Numer nor Node.';
var SEEKABLE_NODES = [Node.ELEMENT_NODE, Node.TEXT_NODE, Node.DOCUMENT_NODE];

/* Public interface */

var TextIterator = function TextIterator() {
  _classCallCheck(this, TextIterator);
};

exports.TextIterator = TextIterator;
;

function createTextIterator(root, filter) {
  var document = global.document;
  var iter = document.createNodeIterator(root, NodeFilter.SHOW_TEXT, filter);

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
      get: function get() {
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
      value: function value(where) {
        var self = this;

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

function install() {
  var document = global.document;

  if (typeof global.TextIterator === 'undefined') {
    global.TextIterator = TextIterator;
  }

  if (typeof document.createTextIterator === 'undefined') {
    document.createTextIterator = createTextIterator;
  }
}

/* Private implementation */

function before(referenceNode, node) {
  return referenceNode.compareDocumentPosition(node) & (Node.DOCUMENT_POSITION_FOLLOWING | Node.DOCUMENT_CONTAINED_BY);
}

function after(referenceNode, node) {
  return referenceNode.compareDocumentPosition(node) & (Node.DOCUMENT_POSITION_PRECEDING | Node.DOCUMENT_CONTAINS);
}

function seek_node(iter, node) {
  function forward(count) {
    var curNode = iter.nextNode();
    if (curNode === null) {
      return Promise.resolve(count);
    } else {
      count += curNode.textContent.length;
      if (after(curNode, node)) {
        return Promise.resolve(count);
      } else {
        return new Promise(function (r) {
          return setTimeout(r, 0, count);
        }).then(forward);
      }
    }
  }

  function backward(count) {
    var curNode = iter.previousNode();
    if (curNode === null) {
      return Promise.resolve(count);
    } else {
      count -= curNode.textContent.length;
      if (curNode === node || before(curNode, node)) {
        return Promise.resolve(count);
      } else {
        return new Promise(function (r) {
          return setTimeout(r, 0, count);
        }).then(backward);
      }
    }
  }

  return forward(0).then(backward);
}

function seek_offset(iter, offset) {
  function forward(count) {
    var curNode = iter.nextNode();
    if (curNode === null) {
      return Promise.resolve(count);
    } else {
      count += curNode.textContent.length;
      if (count > offset) {
        return Promise.resolve(count);
      } else {
        return new Promise(function (r) {
          return setTimeout(r, 0, count);
        }).then(forward);
      }
    }
  }

  function backward(count) {
    var curNode = iter.previousNode();
    if (curNode === null) {
      return Promise.resolve(count);
    } else {
      count -= curNode.textContent.length;
      if (count <= offset) {
        return Promise.resolve(count);
      } else {
        return new Promise(function (r) {
          return setTimeout(r, 0, count);
        }).then(backward);
      }
    }
  }

  return forward(0).then(backward);
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});