(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.seek = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.to = to;
exports.by = by;
/* Internal constants */

var E_SEEK = 'Argument 1 of seek is neither a number nor Text Node.';
var E_SHOW = 'NodeIterator.whatToShow is not NodeFilter.SHOW_TEXT.';

var FRAME_RATE = 60;
var TICK_LENGTH = 1000 / FRAME_RATE;

function before(referenceNode, node) {
  return referenceNode.compareDocumentPosition(node) & (Node.DOCUMENT_POSITION_FOLLOWING | Node.DOCUMENT_CONTAINED_BY);
}

function after(referenceNode, node) {
  return referenceNode.compareDocumentPosition(node) & (Node.DOCUMENT_POSITION_PRECEDING | Node.DOCUMENT_CONTAINS);
}

function check(iter) {
  if (iter.whatToShow !== NodeFilter.SHOW_TEXT) {
    return Promise.reject(new Error(E_SHOW));
  }

  // Pre-condition: pointerBeforeReferenceNode
  if (!iter.pointerBeforeReferenceNode) {
    iter.previousNode();
  }
}

function to(iter, node) {
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

  check(iter);
  return forward(0).then(backward);
}

function by(iter, offset) {
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

  check(iter);
  return forward(0).then(backward);
}

},{}]},{},[1])(1)
});