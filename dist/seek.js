(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.seek = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = seek;
var E_SHOW = 'Argument 1 of seek must use filter NodeFilter.SHOW_TEXT.';
var E_WHERE = 'Argument 2 of seek must be a number or a Text Node.';

function seek(iter, where) {
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
  return node.compareDocumentPosition(ref) & Node.DOCUMENT_POSITION_PRECEDING;
}

function after(ref, node) {
  return node.compareDocumentPosition(ref) & Node.DOCUMENT_POSITION_FOLLOWING;
}
module.exports = exports['default'];

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL3RpbGdvdmkvc3JjL2RvbS1zZWVrL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7cUJDSXdCLElBQUk7QUFKNUIsSUFBTSxNQUFNLEdBQUcsMERBQTBELENBQUM7QUFDMUUsSUFBTSxPQUFPLEdBQUcscURBQXFELENBQUM7O0FBR3ZELFNBQVMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDeEMsTUFBSSxJQUFJLENBQUMsVUFBVSxLQUFLLFVBQVUsQ0FBQyxTQUFTLEVBQUU7QUFDNUMsVUFBTSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztHQUN6Qjs7QUFFRCxNQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDZCxNQUFJLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO0FBQzlCLE1BQUksVUFBVSxHQUFHLElBQUksQ0FBQzs7QUFFdEIsTUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDbkIsY0FBVSxHQUFHO0FBQ1gsYUFBTyxFQUFFO2VBQU0sS0FBSyxHQUFHLEtBQUs7T0FBQTtBQUM1QixjQUFRLEVBQUU7ZUFBTSxLQUFLLEdBQUcsS0FBSztPQUFBO0tBQzlCLENBQUM7R0FDSCxNQUFNLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQ3hCLGNBQVUsR0FBRztBQUNYLGFBQU8sRUFBRTtlQUFNLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDO09BQUE7QUFDbEMsY0FBUSxFQUFFO2VBQU0sQ0FBQyxJQUFJLENBQUMsMEJBQTBCLElBQUksS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUM7T0FBQTtLQUN2RSxDQUFDO0dBQ0gsTUFBTTtBQUNMLFVBQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7R0FDMUI7O0FBRUQsU0FBTyxVQUFVLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFBLEtBQU0sSUFBSSxFQUFFO0FBQ2hFLFNBQUssSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQztHQUNsQzs7QUFFRCxTQUFPLFVBQVUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUEsS0FBTSxJQUFJLEVBQUU7QUFDckUsU0FBSyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDO0dBQ2xDOztBQUVELFNBQU8sS0FBSyxDQUFDO0NBQ2Q7O0FBR0QsU0FBUyxRQUFRLENBQUMsQ0FBQyxFQUFFO0FBQ25CLFNBQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQzNDOztBQUdELFNBQVMsTUFBTSxDQUFDLElBQUksRUFBRTtBQUNwQixTQUFPLElBQUksQ0FBQyxRQUFRLEtBQUssSUFBSSxDQUFDLFNBQVMsQ0FBQztDQUN6Qzs7QUFHRCxTQUFTLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFO0FBQ3pCLFNBQU8sSUFBSSxDQUFDLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQywyQkFBMkIsQ0FBQztDQUM3RTs7QUFHRCxTQUFTLEtBQUssQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFO0FBQ3hCLFNBQU8sSUFBSSxDQUFDLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQywyQkFBMkIsQ0FBQztDQUM3RSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjb25zdCBFX1NIT1cgPSAnQXJndW1lbnQgMSBvZiBzZWVrIG11c3QgdXNlIGZpbHRlciBOb2RlRmlsdGVyLlNIT1dfVEVYVC4nO1xuY29uc3QgRV9XSEVSRSA9ICdBcmd1bWVudCAyIG9mIHNlZWsgbXVzdCBiZSBhIG51bWJlciBvciBhIFRleHQgTm9kZS4nO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNlZWsoaXRlciwgd2hlcmUpIHtcbiAgaWYgKGl0ZXIud2hhdFRvU2hvdyAhPT0gTm9kZUZpbHRlci5TSE9XX1RFWFQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoRV9TSE9XKTtcbiAgfVxuXG4gIGxldCBjb3VudCA9IDA7XG4gIGxldCBub2RlID0gaXRlci5yZWZlcmVuY2VOb2RlO1xuICBsZXQgcHJlZGljYXRlcyA9IG51bGw7XG5cbiAgaWYgKGlzTnVtYmVyKHdoZXJlKSkge1xuICAgIHByZWRpY2F0ZXMgPSB7XG4gICAgICBmb3J3YXJkOiAoKSA9PiBjb3VudCA8IHdoZXJlLFxuICAgICAgYmFja3dhcmQ6ICgpID0+IGNvdW50ID4gd2hlcmVcbiAgICB9O1xuICB9IGVsc2UgaWYgKGlzVGV4dCh3aGVyZSkpIHtcbiAgICBwcmVkaWNhdGVzID0ge1xuICAgICAgZm9yd2FyZDogKCkgPT4gYmVmb3JlKG5vZGUsIHdoZXJlKSxcbiAgICAgIGJhY2t3YXJkOiAoKSA9PiAhaXRlci5wb2ludGVyQmVmb3JlUmVmZXJlbmNlTm9kZSB8fCBhZnRlcihub2RlLCB3aGVyZSlcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihFX1dIRVJFKTtcbiAgfVxuXG4gIHdoaWxlIChwcmVkaWNhdGVzLmZvcndhcmQoKSAmJiAobm9kZSA9IGl0ZXIubmV4dE5vZGUoKSkgIT09IG51bGwpIHtcbiAgICBjb3VudCArPSBub2RlLnRleHRDb250ZW50Lmxlbmd0aDtcbiAgfVxuXG4gIHdoaWxlIChwcmVkaWNhdGVzLmJhY2t3YXJkKCkgJiYgKG5vZGUgPSBpdGVyLnByZXZpb3VzTm9kZSgpKSAhPT0gbnVsbCkge1xuICAgIGNvdW50IC09IG5vZGUudGV4dENvbnRlbnQubGVuZ3RoO1xuICB9XG5cbiAgcmV0dXJuIGNvdW50O1xufVxuXG5cbmZ1bmN0aW9uIGlzTnVtYmVyKG4pIHtcbiAgcmV0dXJuICFpc05hTihwYXJzZUludChuKSkgJiYgaXNGaW5pdGUobik7XG59XG5cblxuZnVuY3Rpb24gaXNUZXh0KG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFO1xufVxuXG5cbmZ1bmN0aW9uIGJlZm9yZShyZWYsIG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUuY29tcGFyZURvY3VtZW50UG9zaXRpb24ocmVmKSAmIE5vZGUuRE9DVU1FTlRfUE9TSVRJT05fUFJFQ0VESU5HO1xufVxuXG5cbmZ1bmN0aW9uIGFmdGVyKHJlZiwgbm9kZSkge1xuICByZXR1cm4gbm9kZS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbihyZWYpICYgTm9kZS5ET0NVTUVOVF9QT1NJVElPTl9GT0xMT1dJTkc7XG59XG4iXX0=
