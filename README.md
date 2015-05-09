DOM Seek
========

POSIX has `lseek(2)`. Now the browser has `dom-seek`.


Installation
============

Download or include `seek.js` or `seek.min.js` from this distribution:

    <script src="https://raw.githubusercontent.com/tilgovi/dom-seek/master/seek.js"></script>

Use with Browserify or WebPack:

    npm install dom-seek

Use with RequireJS or other AMD loaders by including the script as usual. It
should properly detect your AMD environment and register itself as the `seek`
module.

Usage
=====

The library provides a new type, `TextIterator` and a factory function,
`createTextIterator`. These are accessible on the module object along with
a polyfill installer, `install`.

If you're using a module system, just `require('dom-seek')`, otherwise the
`seek` namespace should be available globally after the script loads.

## `seek.install()`

Installs the polyfill, with `seek.createTextIterator` on `document`
and `seek.TextIterator` on the global object.

## `seek.createTextIterator(root, [filter])`

Creates a new instance of `TextIterator`.

<dl>
<dt>
root
</dt>

<dd>
The root node whose descendants will be traversed by this iterator.
</dd>

<dt>
filter
</dt>

<dd>
An object with a method for accepting nodes for inclusion in the iteration.
</dd>
</dl>

The `root` node must be an `Element`.

If supplied, `filter` should be an object with an `acceptNode` method
that takes as its argument a `Node`, returning `true` if the node should
be included in the traversal and `false` otherwise.

## `seek.TextIterator.referenceNode`

The current node for the iterator. When first initialized, this will
be the root node for the iteration, but after seeking it will always
be a `Text` node.

## `seek.TextIterator.prototype.seek(where)`

Returns a `Promise` that will be fulfilled with the number of characters
traversed.

<dl>
<dt>
where
</dt>

<dd>
A destination node or integer offset for seeking.
</dd>
</dl>

The argument is an integer, else an `Element` or `Text` object.

If the argument is an integer, the iterator will seek forward (if
where is positive) or backward (if where is negative) until the
reference node is a `Text` node that contains the destination or
reaches the beginning or end of the range covered by the root.

If the argument is a node, the iterator will seek forward or backward
until the reference node is either equal to the argument, when it is a
`Text` node, or a `Text` node that immediately precedes the first
`Text` node in `Element` in the iteration sequence.

Example
=======

Often, when searching for text strings in HTML documents, authors will traverse
document and look at the text of the leaf Elements. However, when the search
pattern is split across element boundaries, the problem is harder.

Below is an example of using `TextIterator` to highlight a string in a document,
even if that string is split across element boundaries.

```javascript
// Install the polyfill.
seek.install();

// Find the start word.
var offset = document.body.textContent.indexOf('ipsum');
var length = 'ipsum'.length

// Create a TextIterator.
var iter = document.createTextIterator(document.body);

// Seek the iterator forward by some amount, splitting the text node that
// contains the destination offset if it does not fall exactly at the offset.
// The result is a node that starts exactly at the requested offset.
function split(offset) {
  iter.seek(offset).then(function (count) {
    if (count == offset) {
      return iter.referenceNode;
    } else {
      // Split the text at the offset
      return iter.referenceNode.splitText(offset - count);
    }
  });
}

// Find text nodes at the start and end of the word.
split(offset).then(function (start) {
  split(length).then(function (end) {
    // Highlight all the nodes in between.
    do {
      var node = iter.previousNode();

      var highlight = document.createElement('<span>');
      highlight.classList.add('highlight');

      node.parentNode.replaceChild(highlight, node);
      highlight.appendChild(node);
    } while(node !== start);
  });
});
```
