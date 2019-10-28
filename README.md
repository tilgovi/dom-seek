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

Adjust the position of a [`NodeIterator`].

If the argument is an integer, seeks the iterator forward (if `where` is
positive) or backward (if `where` is negative) until `where` text code units
have been traversed or the iterator is exhausted.

If the argument is a node, seeks the iterator forward or backward until its
pointer is positioned immediately before the target node.

After seeking, the iterator will refer to the point before its reference node
(its `pointerBeforeReferencNode` property will be `true`).

Returns the change in the offset. Note that this will be negative when the
traversal causes the iterator to move backward.

Raises `InvalidStateError` when the root node of the iterator contains no text
or `iter` is not a `NodeIterator` with a `whatToShow` property equal to
`NodeFilter.SHOW_TEXT`.

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
