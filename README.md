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

## `seek.to(iter, node)`

Seeks the iterator forward or backward until its reference node is either equal
to the argument, when it is a `Text` node, or the `Text` node that immediately
precedes the first `Text` node in `Element` in the iteration sequence.

Returns a `Promise` that will be fulfilled with the number of characters
traversed.

## `seek.by(iter, offset)`

Seeks the iterator forward (if offset is positive) or backward (if offset is
negative) until `offset` characters have been traversed or the traversal ends.

Returns a `Promise` that will be fulfilled with the number of characters
traversed.

Example
=======

Often, when searching for text strings in HTML documents, authors will traverse
a document and look at the text of the leaf Elements. However, when the search
pattern is split across element boundaries, the problem is harder.

Below is an example of using `TextIterator` to highlight a string in a document,
even if that string is split across element boundaries.

```javascript

// Find the text.
var offset = document.body.textContent.indexOf('ipsum');
var length = 'ipsum'.length

// Create a NodeIterator.
var iter = document.createNodeIterator(document.body, NodeFilter.SHOW_TEXT);

// Seek the iterator forward by some amount, splitting the text node that
// contains the destination offset if it does not fall exactly at the offset.
function split(offset) {
  return seek(iter, offset).then(function (count) {
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
