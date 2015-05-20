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

    describe('when traversing past the beginning', function () {
      it('stops', function () {
        let iter = createIter();
        let count = seek(iter, -100);
        assert.equal(count, 0);
      });

      it('ends on a text node', function () {
        let text = fixture.el.childNodes[0].childNodes[0].childNodes[0];
        let iter = createIter();
        let count = seek(iter, -100);
        assert.strictEqual(iter.referenceNode, text);
      });
    });

    describe('when traversing past the end', function () {
      it('stops', function () {
        let p = fixture.el.childNodes[0];
        let text = p.childNodes[p.childNodes.length-1];
        let iter = createIter();
        let count = seek(iter, fixture.el.textContent.length + 100);
        assert.strictEqual(iter.referenceNode, text);
      });
    });

    it('seeks to that offset if it marks the start of a node', function () {
      let text = 'Aenean ultricies mi vitae est.'
      let offset = fixture.el.textContent.indexOf(text);
      let iter = createIter();
      let count = seek(iter, offset);
      assert.equal(count, offset);
      assert.equal(iter.referenceNode.textContent, text);
    });

    it('seeks to the nearest node', function () {
      let text = 'Aenean ultricies mi vitae est.'
      let offset = fixture.el.textContent.indexOf(text);
      let iter = createIter();
      let count = seek(iter, offset + 5);
      assert.equal(count, offset);
      assert.equal(iter.referenceNode.textContent, text);
    });

    it('seeks forwards and backwards', function () {
      let text = 'commodo vitae'
      let offset = fixture.el.textContent.indexOf(text);
      let iter = createIter();
      let end = seek(iter, offset + text.length);
      let count = seek(iter, -text.length);
      assert.equal(count, -text.length);
      assert.equal(iter.referenceNode.textContent, text);
    });
  });
});
