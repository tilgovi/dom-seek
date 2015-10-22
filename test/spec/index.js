import seek from '../../src';

const SHOW_TEXT = 4

function createIter(whatToShow = SHOW_TEXT) {
  let document = fixture.el.ownerDocument;
  return document.createNodeIterator(fixture.el, whatToShow);
}


describe('seek', function () {
  let fixtureText = null

  before(() => fixture.load('test.html'))
  before(() => fixtureText = fixture.el.textContent || fixture.el.innerText)
  after(() => fixture.cleanup())

  it('is a function', function () {
    assert.isFunction(seek)
  });

  describe('argument 1', function () {
    it('must use `NodeFilter.SHOW_TEXT`', function () {
      let iter = createIter(0xFFFFFFFF);
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
      let count = seek(iter, fixtureText.length + 100);
      assert.strictEqual(iter.referenceNode, node);
      assert.isFalse(iter.pointerBeforeReferenceNode);
    });

    it('seeks to that offset if it marks the start of a node', function () {
      let iter = createIter();
      let text = 'Aenean ultricies mi vitae est.'
      let offset = fixtureText.indexOf(text);
      let count = seek(iter, offset);
      assert.equal(count, offset);
      assert.equal(iter.nextNode().nodeValue, text);
    });

    it('seeks to the nearest node', function () {
      let iter = createIter();
      let text = 'Aenean ultricies mi vitae est.'
      let offset = fixtureText.indexOf(text);
      let count = seek(iter, offset + 5);
      assert.equal(count, offset);
      assert.equal(iter.referenceNode.nodeValue, text);
      assert.isTrue(iter.pointerBeforeReferenceNode);
    });

    it('seeks forwards and backwards', function () {
      let iter = createIter();
      let text = 'commodo vitae'
      let offset = fixtureText.indexOf(text);

      let end = seek(iter, offset + text.length);
      assert.equal(end, offset + text.length);
      assert.equal(iter.referenceNode.nodeValue, text);
      assert.isFalse(iter.pointerBeforeReferenceNode);

      let count = seek(iter, -(text.length - 3));
      assert.equal(count, -text.length);
      assert.equal(iter.referenceNode.nodeValue, text);
      assert.isTrue(iter.pointerBeforeReferenceNode);
    });
  });

  describe('to a node', function () {
    it('seeks to the given node', function () {
      let iter = createIter();
      let node = fixture.el.getElementsByTagName('code')[0].childNodes[0]
      let offset = fixtureText.indexOf(node.nodeValue);
      let count = seek(iter, node);
      assert.equal(count, offset);
      assert.strictEqual(iter.referenceNode, node);
      assert.isTrue(iter.pointerBeforeReferenceNode);
    });

    it('seeks forwards and backwards', function () {
      let iter = createIter();
      let code = fixture.el.getElementsByTagName('code')[0].childNodes[0]
      let strong = fixture.el.getElementsByTagName('strong')[0].childNodes[0]
      seek(iter, code);
      let from = fixtureText.indexOf(code.nodeValue);
      let to =  fixtureText.indexOf(strong.nodeValue);
      let count = seek(iter, strong);
      let expected = to - from;
      assert.equal(count, expected);
    });
  });
});
