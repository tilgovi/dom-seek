DOM Seek
========

POSIX has `lseek(2)`. Now the browser has `dom-seek`.

This library can answer two kinds of questions about character offsets in a
document:

- Given a `Node`, at what offset does its text content start?

- Given an offset, in which `Node` can I find that text?

It is especially useful for dealing with text that breaks across elements,
since it handles traversal and let's you think instead in terms of text
position.


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
reference node is either equal to the argument, when the argument is a `Text`
node, or the `Text` node that immediately precedes the first `Text` node
contained by the argument, when the argument is an `Element`.

Returns the number of characters traversed.

Example
=======

Often, when searching for text strings in HTML documents, authors will traverse
a document and look at the text of the leaf Elements. However, when the search
pattern is split across element boundaries, the problem is harder.

Below is an example of using `seek` to highlight a string in a document, even
if that string is split across element boundaries.

```javascript

// Find the text.
var offset = document.body.textContent.indexOf('ipsum');
var length = 'ipsum'.length

// Create a NodeIterator.
var iter = document.createNodeIterator(document.body, NodeFilter.SHOW_TEXT);

// Seek the iterator forward by some amount, splitting the text node that
// contains the destination if it does not fall exactly at a text node boundary.
function split(where) {
  var count = seek(iter, where);
  if (count != where) {
    // Split the text at the offset
    iter.referenceNode.splitText(where - count);
    iter.nextNode();
  }
}

// Find split points
split(offset);
split(length);

// Walk backward to the start and highlight all the nodes.
do {
  var node = iter.previousNode();

  var highlight = document.createElement('span');
  highlight.classList.add('highlight');

  node.parentNode.replaceChild(highlight, node);
  highlight.appendChild(node);
} while(node !== start);
```
