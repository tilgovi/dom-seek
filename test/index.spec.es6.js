import {default as seek} from '../index.es6'


function createIter(whatToShow = NodeFilter.SHOW_TEXT) {
  return document.createNodeIterator(fixture.el, whatToShow);
}


describe('seek', function () {
  before(function(){
    fixture.setBase('test/fixtures')
  });

  beforeEach(function () {
    fixture.load('test.html');
  });

  afterEach(function () {
    fixture.cleanup();
  });

  it('is a function', function () {
    assert.isFunction(seek)
  });

  describe('argument 1', function () {
    it('must be a NodeIterator', function () {
      assert.throws(() => seek('thing', 10), /must be a NodeIterator/);
    });

    it('must use `NodeFilter.SHOW_TEXT`', function () {
      let iter = createIter(NodeFilter.SHOW_ELEMENT);
      assert.throws(() => seek(iter, 0), /NodeFilter.SHOW_TEXT/);
    });
  });

  describe('argument 2', function () {
    it('can be a number', function () {
      let iter = createIter();
      assert.doesNotThrow(() => seek(iter, 0));
    });

    it('can be a `Text` node', function () {
      let iter = createIter();
      let node = iter.nextNode();
      assert.doesNotThrow(() => seek(iter, node));
    });

    it('cannot be any other type of node', function () {
      let iter = createIter();
      let node = iter.nextNode();
      assert.throws(() => seek(iter, document.body));
    });

    it('cannot be anything else', function () {
      let iter = createIter();
      let node = iter.nextNode();
      assert.throws(() => seek(iter, 'bogus'));
    });
  });

  describe('by a number', function () {
    it('accepts zero as an argument', function () {
      let iter = createIter();
      assert.doesNotThrow(() => seek(iter, 0));
    });

    it('stops when traversing past the beginning', function () {
      let iter = createIter();
      let count = seek(iter, -100);
      assert.equal(count, 0);
      assert.strictEqual(iter.referenceNode, iter.root);
      assert.isTrue(iter.pointerBeforeReferenceNode);
    });

    it('stops when traversing past the end', function () {
      let iter = createIter();
      let p = fixture.el.childNodes[0];
      let node = p.childNodes[p.childNodes.length-1];
      let count = seek(iter, fixture.el.textContent.length + 100);
      assert.strictEqual(iter.referenceNode, node);
      assert.isFalse(iter.pointerBeforeReferenceNode);
    });

    it('seeks to that offset if it marks the start of a node', function () {
      let iter = createIter();
      let text = 'Aenean ultricies mi vitae est.'
      let offset = fixture.el.textContent.indexOf(text);
      let count = seek(iter, offset);
      assert.equal(count, offset);
      assert.equal(iter.nextNode().textContent, text);
    });

    it('seeks to the nearest node', function () {
      let iter = createIter();
      let text = 'Aenean ultricies mi vitae est.'
      let offset = fixture.el.textContent.indexOf(text);
      let count = seek(iter, offset + 5);
      assert.equal(count, offset);
      assert.equal(iter.referenceNode.textContent, text);
      assert.isTrue(iter.pointerBeforeReferenceNode);
    });

    it('seeks forwards and backwards', function () {
      let iter = createIter();
      let text = 'commodo vitae'
      let offset = fixture.el.textContent.indexOf(text);

      let end = seek(iter, offset + text.length);
      assert.equal(end, offset + text.length);
      assert.equal(iter.referenceNode.textContent, text);
      assert.isFalse(iter.pointerBeforeReferenceNode);

      let count = seek(iter, -(text.length - 3));
      assert.equal(count, -text.length);
      assert.equal(iter.referenceNode.textContent, text);
      assert.isTrue(iter.pointerBeforeReferenceNode);
    });
  });

  describe('to a node', function () {
    it('seeks to the given node', function () {
      let iter = createIter();
      let node = fixture.el.getElementsByTagName('code')[0].childNodes[0]
      let offset = fixture.el.textContent.indexOf(node.textContent);
      let count = seek(iter, node);
      assert.equal(count, offset);
      assert.strictEqual(iter.referenceNode, node);
      assert.isTrue(iter.pointerBeforeReferenceNode);
    });

    it('seeks forwards and backwards', function () {
      let iter = createIter();
      let text = fixture.el.textContent;
      let code = fixture.el.getElementsByTagName('code')[0].childNodes[0]
      let strong = fixture.el.getElementsByTagName('strong')[0].childNodes[0]
      seek(iter, code);

      let from = text.indexOf(code.textContent);
      let to =  text.indexOf(strong.textContent);
      let count = seek(iter, strong);
      let expected = to - from;
      assert.equal(count, expected);
    });
  });
});
