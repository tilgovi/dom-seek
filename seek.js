(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.seek = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.createTextIterator = createTextIterator;
exports.install = install;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

/* Internal constants */

var E_ROOT = 'Argument 1 of createTextIterator is not an Element.';
var E_SEEK = 'Argument 1 of TextIterator.seek is neither a number nor Text.';

var FRAME_RATE = 60;
var TICK_LENGTH = 1000 / FRAME_RATE;

/* Public interface */

var TextIterator = (function (_NodeIterator) {
  function TextIterator() {
    _classCallCheck(this, TextIterator);

    if (_NodeIterator != null) {
      _NodeIterator.apply(this, arguments);
    }
  }

  _inherits(TextIterator, _NodeIterator);

  return TextIterator;
})(NodeIterator);

exports.TextIterator = TextIterator;
;

function createTextIterator(root, filter) {
  var document = global.document;

  if (root.nodeType !== Node.ELEMENT_NODE) {
    throw new UnsupportedError(E_ROOT);
  }

  var iter = document.createNodeIterator(root, NodeFilter.SHOW_TEXT, filter);

  // IE compatibility
  if (typeof iter.referenceNode === 'undefined') {
    iter.referenceNode = root;
    iter.pointerBeforeReferenceNode = true;
  }

  // NodeIterator doesn't have a proper constructor so we don't either :(
  // Also, this keeps the NodeIterator private.
  return Object.create(TextIterator.prototype, {
    root: {
      get: function get() {
        return iter.root;
      }
    },

    whatToShow: {
      get: function get() {
        return iter.whatToShow;
      }
    },

    filter: {
      get: function get() {
        return iter.filter;
      }
    },

    referenceNode: {
      get: function get() {
        return iter.referenceNode;
      }
    },

    pointerBeforeReferenceNode: {
      get: function get() {
        return iter.pointerBeforeReferenceNode;
      }
    },

    nextNode: {
      value: function value() {
        var result = iter.nextNode();

        // IE compatibility
        if (typeof iter.referenceNode === 'undefined') {
          iter.referenceNode = result;
          iter.pointerBeforeReferenceNode = false;
        }

        return result;
      }
    },

    previousNode: {
      value: function value() {
        var result = iter.previousNode();

        // IE compatibility
        if (typeof iter.referenceNode === 'undefined') {
          iter.referenceNode = result;
          iter.pointerBeforeReferenceNode = true;
        }

        return result;
      }
    },

    seek: {
      value: function value(where) {
        // Pre-condition: pointerBeforeReferenceNode
        if (!this.pointerBeforeReferenceNode) {
          this.previousNode();
        }

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

function isNumber(n) {
  return !isNaN(parseInt(n)) && isFinite(n);
}

function isText(node) {
  if (typeof node.nodeType === 'number') {
    return node.nodeType === Node.TEXT_NODE;
  } else {
    return false;
  }
}

function before(referenceNode, node) {
  return referenceNode.compareDocumentPosition(node) & (Node.DOCUMENT_POSITION_FOLLOWING | Node.DOCUMENT_CONTAINED_BY);
}

function after(referenceNode, node) {
  return referenceNode.compareDocumentPosition(node) & (Node.DOCUMENT_POSITION_PRECEDING | Node.DOCUMENT_CONTAINS);
}

function seek_node(iter, node) {
  var yieldAt = Date.now() + TICK_LENGTH;

  function forward(_x) {
    var _again = true;

    _function: while (_again) {
      curNode = undefined;
      _again = false;
      var count = _x;

      var curNode = iter.nextNode();

      if (curNode === null) {
        return Promise.resolve(count);
      }

      count += curNode.textContent.length;

      if (after(curNode, node)) {
        return Promise.resolve(count);
      }

      if (Date.now() < yieldAt) {
        _x = count;
        _again = true;
        continue _function;
      } else {
        return new Promise(function (resolve) {
          requestAnimationFrame(function () {
            yieldAt = Date.now() + TICK_LENGTH;
            resolve(forward(count));
          });
        });
      }
    }
  }

  function backward(_x2) {
    var _again2 = true;

    _function2: while (_again2) {
      curNode = undefined;
      _again2 = false;
      var count = _x2;

      var curNode = iter.previousNode();

      if (curNode === null) {
        return Promise.resolve(count);
      }

      count -= curNode.textContent.length;

      if (curNode === node || before(curNode, node)) {
        return Promise.resolve(count);
      }

      if (Date.now() < yieldAt) {
        _x2 = count;
        _again2 = true;
        continue _function2;
      } else {
        return new Promise(function (resolve) {
          requestAnimationFrame(function () {
            yieldAt = Date.now() + TICK_LENGTH;
            resolve(backward(count));
          });
        });
      }
    }
  }

  return forward(0).then(backward);
}

function seek_offset(iter, offset) {
  var yieldAt = Date.now() + TICK_LENGTH;

  function forward(_x3) {
    var _again3 = true;

    _function3: while (_again3) {
      curNode = undefined;
      _again3 = false;
      var count = _x3;

      var curNode = iter.nextNode();

      if (curNode === null) {
        return Promise.resolve(count);
      }

      count += curNode.textContent.length;

      if (count > offset) {
        return Promise.resolve(count);
      }

      if (Date.now() < yieldAt) {
        _x3 = count;
        _again3 = true;
        continue _function3;
      } else {
        return new Promise(function (resolve) {
          requestAnimationFrame(function () {
            yieldAt = Date.now() + TICK_LENGTH;
            resolve(forward(count));
          });
        });
      }
    }
  }

  function backward(_x4) {
    var _again4 = true;

    _function4: while (_again4) {
      curNode = undefined;
      _again4 = false;
      var count = _x4;

      var curNode = iter.previousNode();

      if (curNode === null) {
        return Promise.resolve(count);
      }

      count -= curNode.textContent.length;

      if (count <= offset) {
        return Promise.resolve(count);
      }

      if (Date.now() < yieldAt) {
        _x4 = count;
        _again4 = true;
        continue _function4;
      } else {
        return new Promise(function (resolve) {
          requestAnimationFrame(function () {
            yieldAt = Date.now() + TICK_LENGTH;
            resolve(backward(count));
          });
        });
      }
    }
  }

  return forward(0).then(backward);
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});