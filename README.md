DOM Seek
========

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](http://opensource.org/licenses/MIT)
[![NPM Package](https://img.shields.io/npm/v/dom-seek.svg)](https://www.npmjs.com/package/dom-seek)
[![Build Status](https://travis-ci.org/tilgovi/dom-seek.svg?branch=master)](https://travis-ci.org/tilgovi/dom-seek)
[![Coverage Status](https://img.shields.io/codecov/c/github/tilgovi/dom-seek/master.svg)](https://codecov.io/gh/tilgovi/dom-seek)

POSIX has `lseek(2)`. Now the browser has `dom-seek`.

This library can answer two questions:

- What is the offset of a given `TextNode` within a text?

- Which `TextNode` within a text contains the given offset?

Installation
============

Using npm:

    npm install dom-seek

Usage
=====

## `seek(iter, where)`

Adjust the position of a [`NodeIterator`] by an offset measured in text code
units or to the position immediately before a target node.

If `where` is a positive integer, seek the iterator forward until the sum of
the text code unit lengths of all nodes that the iterator traverses is as close
as possible to `where` without exceeding it.

If `where` is a negative integer, seek the iterator backward until the sum of
the text code unit lengths of all nodes that the iterator traverses is as close
as possible to the positive value of `where` without exceeding it.

If `where` is a node, seek the iterator forward or backward until its pointer is
positioned immediately before the target node.

Return the number of text code units between the initial and final iterator
positions. This number will be negative when the traversal causes the iterator
to traverse backward in document order.

After this function returns, the `pointerBeforeReferencNode` property of the
iterator should be `true`. The function may return a value less than `where` if
returning `where` exactly would result in the iterator pointing after the last
text node that its root node contains.

Raise `InvalidStateError` when the root node of the iterator contains no text,
the `whatToShow` property of the iterator is not `NodeFilter.SHOW_TEXT`, or when
the `where` argument specifies a traversal beyond the bounds of the root node of
the iterator.

[`NodeIterator`]: https://developer.mozilla.org/en-US/docs/Web/API/NodeIterator

Browser Support
===============

Use the `dom-node-iterator` module for a portable `NodeIterator` polyfill if
targeting browsers that lack a full implementation that includes the
`referenceNode` and `pointerBeforeReferenceNode` properties.

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
  var remainder = where - count;

  if (remainder) {
    // Split the text at the offset
    iter.referenceNode.splitText(remainder);

    // Seek to the exact offset
    seek(iter, remainder);
  }

  return iter.referenceNode;
}

// Find split points
var start = split(offset);
var end = split(length);

// Walk backwards, collecting all the nodes
var nodes = [end];
while (iter.referenceNode !== start) {
  nodes.unshift(iter.previousNode());
}

// Highlight all the nodes.
for (var i = 0 ; i < nodes.length ; i++) {
  var node = nodes[i];

  // Create a highlight
  var highlight = document.createElement('mark');

  // Wrap it around the text node
  node.parentNode.replaceChild(highlight, node);
  highlight.appendChild(node);
}
```
