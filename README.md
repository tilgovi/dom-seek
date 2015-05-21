DOM Seek
========

POSIX has `lseek(2)`. Now the browser has `dom-seek`.

This library can answer two kinds of questions about character offsets in a
document:

- Given a `Node`, at what offset does its text content start?

- Given an offset, in which `Node` can I find that text?

Installation
============

There are a few different ways to include the library.

With a CommonJS bundler to `require('dom-seek')`:

    npm install dom-seek

With a script tag, include one of the scripts from the `dist` directory.

RequireJS or other AMD loaders should be able to wrap the CommonJS module
in index.js

Usage
=====

## `seek(iter, where)`

The `iter` argument must be a `NodeIterator` instance with a `whatToShow`
property equal to `NodeFilter.SHOW_TEXT`.

The `where` argument is an integer, else an `Element` or `Text` node.

If the argument is an integer, seeks the iterator forward (if where is positive)
or backward (if where is negative) until `where` characters have been traversed
orthe traversal ends.

If the argument is a node, seeks the iterator forward or backward until its
reference node is equal to the argument and the iterator pointer is before the
reference node.

Returns the number of characters traversed (negative if traversing backwards).
Iteration always finishes with the pointer before the node containing the
destination offset, meaning that the return value may be less than the requested
value (a greater negative value than requested, if negative).

Example
=======

Often, when searching for text strings in HTML documents, authors will traverse
a document and look at the text of the leaf Elements. However, when the search
pattern is split across element boundaries, the problem is harder.

Below is an example of using `seek` to highlight a string in a document, even
if that string is split across element boundaries.

```javascript
var text = 'ipsum';

// Find the text.
var offset = document.body.textContent.indexOf(text);
var length = text.length

// Create a NodeIterator.
var iter = document.createNodeIterator(document.body, NodeFilter.SHOW_TEXT);

// Seek the iterator forward by some amount, splitting the text node that
// contains the destination if it does not fall exactly at a text node boundary.
function split(where) {
  var count = seek(iter, where);
  if (count != where) {
    // Split the text at the offset
    iter.referenceNode.splitText(where - count);

    // Seek to the exact offset.
    seek(iter, where - count);
  }
  return iter.referenceNode;
}

// Find split points
var start = split(offset);
var end = split(length);

// Walk backwards, collecting all the nodes
var nodes = [];
while (iter.referenceNode !== start && !iter.pointerBeforeReferenceNode) {
  nodes.push(iter.previousNode());
}

// Highlight all the nodes.
for (var i = 0 ; i < nodes.length ; i++) {
  var node = nodes[i];

  // Create a highlight
  var highlight = document.createElement('span');
  highlight.classList.add('annotator-hl');

  // Wrap it around the text node
  node.parentNode.replaceChild(highlight, node);
  highlight.appendChild(node);
}
```
