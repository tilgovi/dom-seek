DOM Seek
========

POSIX has `lseek(2)`. Now the browser has `dom-seek`.


Installation
============

Include as a script tag:

    <script src="https://raw.githubusercontent.com/tilgovi/dom-seek/master/dist.js"></script>

Use with Browserify or WebPack:

    npm install dom-seek


Usage
=====

The library provides a new type, `TextIterator` and a factory function,
`createTextIterator`. These are accessible on the module object along with
a polyfill installer, `install`.

```javascript
domseek.install();

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
