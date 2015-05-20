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
    let iter = null;

    beforeEach(function () {
      iter = createIter();
    });

    it('accepts zero as an argument', function () {
      assert.doesNotThrow(() => seek(iter, 0));
    });

    it('stops when traversing past the beginning', function () {
      let count = seek(iter, -100);
      assert.equal(count, 0);
      assert.strictEqual(iter.referenceNode, iter.root);
      assert.isTrue(iter.pointerBeforeReferenceNode);
    });

    it('stops when traversing past the end', function () {
      let p = fixture.el.childNodes[0];
      let text = p.childNodes[p.childNodes.length-1];
      let count = seek(iter, fixture.el.textContent.length + 100);
      assert.strictEqual(iter.referenceNode, text);
      assert.isFalse(iter.pointerBeforeReferenceNode);
    });

    it('seeks to that offset if it marks the start of a node', function () {
      let text = 'Aenean ultricies mi vitae est.'
      let offset = fixture.el.textContent.indexOf(text);
      let count = seek(iter, offset);
      assert.equal(count, offset);
      assert.equal(iter.nextNode().textContent, text);
    });

    it('seeks to the nearest node', function () {
      let text = 'Aenean ultricies mi vitae est.'
      let offset = fixture.el.textContent.indexOf(text);
      let count = seek(iter, offset + 5);
      assert.equal(count, offset);
      assert.equal(iter.referenceNode.textContent, text);
      assert.isTrue(iter.pointerBeforeReferenceNode);
    });

    it('seeks forwards and backwards', function () {
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
});
