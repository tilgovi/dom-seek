(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.seek = mod.exports;
  }
})(this, function (exports, module) {
  'use strict';

  module.exports = seek;
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlZWsuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O21CQUl3QixJQUFJO0FBSjVCLE1BQU0sTUFBTSxHQUFHLDBEQUEwRCxDQUFDO0FBQzFFLE1BQU0sT0FBTyxHQUFHLHFEQUFxRCxDQUFDOztBQUd2RCxXQUFTLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQ3hDLFFBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxVQUFVLENBQUMsU0FBUyxFQUFFO0FBQzVDLFlBQU0sSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDekI7O0FBRUQsUUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ2QsUUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztBQUM5QixRQUFJLFVBQVUsR0FBRyxJQUFJLENBQUM7O0FBRXRCLFFBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQ25CLGdCQUFVLEdBQUc7QUFDWCxlQUFPLEVBQUU7aUJBQU0sS0FBSyxHQUFHLEtBQUs7U0FBQTtBQUM1QixnQkFBUSxFQUFFO2lCQUFNLEtBQUssR0FBRyxLQUFLO1NBQUE7T0FDOUIsQ0FBQztLQUNILE1BQU0sSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDeEIsZ0JBQVUsR0FBRztBQUNYLGVBQU8sRUFBRTtpQkFBTSxNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQztTQUFBO0FBQ2xDLGdCQUFRLEVBQUU7aUJBQU0sQ0FBQyxJQUFJLENBQUMsMEJBQTBCLElBQUksS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUM7U0FBQTtPQUN2RSxDQUFDO0tBQ0gsTUFBTTtBQUNMLFlBQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDMUI7O0FBRUQsV0FBTyxVQUFVLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFBLEtBQU0sSUFBSSxFQUFFO0FBQ2hFLFdBQUssSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQztLQUNsQzs7QUFFRCxXQUFPLFVBQVUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUEsS0FBTSxJQUFJLEVBQUU7QUFDckUsV0FBSyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDO0tBQ2xDOztBQUVELFdBQU8sS0FBSyxDQUFDO0dBQ2Q7O0FBR0QsV0FBUyxRQUFRLENBQUMsQ0FBQyxFQUFFO0FBQ25CLFdBQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0dBQzNDOztBQUdELFdBQVMsTUFBTSxDQUFDLElBQUksRUFBRTtBQUNwQixXQUFPLElBQUksQ0FBQyxRQUFRLEtBQUssSUFBSSxDQUFDLFNBQVMsQ0FBQztHQUN6Qzs7QUFHRCxXQUFTLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFO0FBQ3pCLFdBQU8sSUFBSSxDQUFDLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQywyQkFBMkIsQ0FBQztHQUM3RTs7QUFHRCxXQUFTLEtBQUssQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFO0FBQ3hCLFdBQU8sSUFBSSxDQUFDLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQywyQkFBMkIsQ0FBQztHQUM3RSIsImZpbGUiOiJzZWVrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgRV9TSE9XID0gJ0FyZ3VtZW50IDEgb2Ygc2VlayBtdXN0IHVzZSBmaWx0ZXIgTm9kZUZpbHRlci5TSE9XX1RFWFQuJztcbmNvbnN0IEVfV0hFUkUgPSAnQXJndW1lbnQgMiBvZiBzZWVrIG11c3QgYmUgYSBudW1iZXIgb3IgYSBUZXh0IE5vZGUuJztcblxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzZWVrKGl0ZXIsIHdoZXJlKSB7XG4gIGlmIChpdGVyLndoYXRUb1Nob3cgIT09IE5vZGVGaWx0ZXIuU0hPV19URVhUKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKEVfU0hPVyk7XG4gIH1cblxuICBsZXQgY291bnQgPSAwO1xuICBsZXQgbm9kZSA9IGl0ZXIucmVmZXJlbmNlTm9kZTtcbiAgbGV0IHByZWRpY2F0ZXMgPSBudWxsO1xuXG4gIGlmIChpc051bWJlcih3aGVyZSkpIHtcbiAgICBwcmVkaWNhdGVzID0ge1xuICAgICAgZm9yd2FyZDogKCkgPT4gY291bnQgPCB3aGVyZSxcbiAgICAgIGJhY2t3YXJkOiAoKSA9PiBjb3VudCA+IHdoZXJlXG4gICAgfTtcbiAgfSBlbHNlIGlmIChpc1RleHQod2hlcmUpKSB7XG4gICAgcHJlZGljYXRlcyA9IHtcbiAgICAgIGZvcndhcmQ6ICgpID0+IGJlZm9yZShub2RlLCB3aGVyZSksXG4gICAgICBiYWNrd2FyZDogKCkgPT4gIWl0ZXIucG9pbnRlckJlZm9yZVJlZmVyZW5jZU5vZGUgfHwgYWZ0ZXIobm9kZSwgd2hlcmUpXG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoRV9XSEVSRSk7XG4gIH1cblxuICB3aGlsZSAocHJlZGljYXRlcy5mb3J3YXJkKCkgJiYgKG5vZGUgPSBpdGVyLm5leHROb2RlKCkpICE9PSBudWxsKSB7XG4gICAgY291bnQgKz0gbm9kZS50ZXh0Q29udGVudC5sZW5ndGg7XG4gIH1cblxuICB3aGlsZSAocHJlZGljYXRlcy5iYWNrd2FyZCgpICYmIChub2RlID0gaXRlci5wcmV2aW91c05vZGUoKSkgIT09IG51bGwpIHtcbiAgICBjb3VudCAtPSBub2RlLnRleHRDb250ZW50Lmxlbmd0aDtcbiAgfVxuXG4gIHJldHVybiBjb3VudDtcbn1cblxuXG5mdW5jdGlvbiBpc051bWJlcihuKSB7XG4gIHJldHVybiAhaXNOYU4ocGFyc2VJbnQobikpICYmIGlzRmluaXRlKG4pO1xufVxuXG5cbmZ1bmN0aW9uIGlzVGV4dChub2RlKSB7XG4gIHJldHVybiBub2RlLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERTtcbn1cblxuXG5mdW5jdGlvbiBiZWZvcmUocmVmLCBub2RlKSB7XG4gIHJldHVybiBub2RlLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKHJlZikgJiBOb2RlLkRPQ1VNRU5UX1BPU0lUSU9OX1BSRUNFRElORztcbn1cblxuXG5mdW5jdGlvbiBhZnRlcihyZWYsIG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUuY29tcGFyZURvY3VtZW50UG9zaXRpb24ocmVmKSAmIE5vZGUuRE9DVU1FTlRfUE9TSVRJT05fRk9MTE9XSU5HO1xufVxuIl0sInNvdXJjZVJvb3QiOiIuLyJ9