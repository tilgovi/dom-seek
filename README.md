DOM Seek
========

POSIX has `lseek(2)`. Now the browser has `dom-seek`.

This library can answer two kinds of questions about character offsets in a
document:

- Given a `Node`, at what offset does its text content start?

- Given an offset, in which `Node` can I find that text?

Both questions are answered by a `TextIterator` that can move forward,
backward or to a destination `Node`, responding with the number of characters
traversed.

It is especially useful for dealing with text that breaks across elements,
since it handles traversal and let's you think instead in terms of text
position.


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

## `createTextIterator(root, [filter])`

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

## `TextIterator.root`

A read-only property that returns the `root` node passed to the invocation of
`createTextIterator`.

## `TextIterator.whatToShow`

A read-only property that always returns `NodeFilter.SHOW_TEXT`.

## `TextIterator.filter`

A read-only property that returns the `filter` argument passed to the
invocation of `createTextIterator` or `null` if no argument was passed.

## `TextIterator.referenceNode`

The current node for the iterator. When first initialized, this will
be the root node for the iteration, but after seeking it will always
be a `Text` node.

## `TextIterator.pointerBeforeReferenceNode`

A read-only property that is `true` when the iterator is positioned after
the `reference node` and `false` otherwise. At initialization, the value
is `true`. After seeking, the value is always `true`. It may be `false` if
the iterator is advanced by a call to `nextNode`.

## `TextIterator.prototype.nextNode()`

Advance the iterator so that the next text node is the next succeeding text node
and return the new `reference node`.

## `TextIterator.prototype.previousNode()`

Rewind the iterator so that the reference node is the next preceding text node
and return the new `reference node`.

## `TextIterator.prototype.seek(where)`

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
a document and look at the text of the leaf Elements. However, when the search
pattern is split across element boundaries, the problem is harder.

Below is an example of using `TextIterator` to highlight a string in a document,
even if that string is split across element boundaries.

```javascript
// Install the polyfill.
seek.install();

// Find the text.
var offset = document.body.textContent.indexOf('ipsum');
var length = 'ipsum'.length

// Create a TextIterator.
var iter = document.createTextIterator(document.body);

// Seek the iterator forward by some amount, splitting the text node that
// contains the destination offset if it does not fall exactly at the offset.
function split(offset) {
  return iter.seek(offset).then(function (count) {
    if (count != offset) {
      // Split the text at the offset
      iter.nextNode().splitText(offset - count);
    }
  });
}

// Find the text node containing the start of the word.
split(offset).then(function () {
  var start = iter.nextNode();

  // Find the text node containing the end of the word.
  split(length).then(function () {

    // Walk backward to the start and highlight all the nodes.
    do {
      var node = iter.previousNode();

      var highlight = document.createElement('span');
      highlight.classList.add('highlight');

      node.parentNode.replaceChild(highlight, node);
      highlight.appendChild(node);
    } while(node !== start);
  });
});
```
