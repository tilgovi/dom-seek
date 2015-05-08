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

```javascript
seek.install();

var where = document.body.textContent.indexOf('ipsum');
var iter = document.createTextIterator(document.body);

iter.seek(where).then(function (offset) {
  var remainder = 512 - offset;

  var text = iter.referenceNode.splitText(remainder);
  text.splitText('ipsum'.length);

  var highlight = document.createElement('<span>');
  highlight.classList.add('highlight');

  text.parentNode.replaceChild(highlight, text);
  highlight.appendChild(text);
});
```
