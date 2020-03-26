import seek from '../src'
import createNodeIterator from 'dom-node-iterator'

const SHOW_TEXT = 4


describe('seek', function () {
  let fixtureText = null

  before(() => fixture.setBase('test/fixtures'))
  before(() => fixture.load('test.html'))
  before(() => fixtureText = fixture.el.textContent || fixture.el.innerText)
  after(() => fixture.cleanup())

  it('is a function', function () {
    assert.isFunction(seek)
  })

  describe('argument 1', function () {
    it('must use `NodeFilter.SHOW_TEXT`', function () {
      let iter = createNodeIterator(fixture.el, 0xFFFFFFFF)
      assert.throws(() => seek(iter, 0), /NodeFilter.SHOW_TEXT/)
    })

    it('must refer to a root node with text content', function () {
      let document = fixture.el.ownerDocument
      let root = document.createElement('div')
      let iter = createNodeIterator(root, SHOW_TEXT)
      assert.throws(() => seek(iter, 0), /exhausted/)
    })
  })

  describe('argument 2', function () {
    it('can be a number', function () {
      let iter = createNodeIterator(fixture.el, SHOW_TEXT)
      assert.doesNotThrow(() => seek(iter, 0))
    })

    it('can be a `Text` node', function () {
      let iter = createNodeIterator(fixture.el, SHOW_TEXT)
      let node = iter.nextNode()
      assert.doesNotThrow(() => seek(iter, node))
    })

    it('cannot be any other type of node', function () {
      let iter = createNodeIterator(fixture.el, SHOW_TEXT)
      let node = iter.nextNode()
      assert.throws(() => seek(iter, document.body))
    })

    it('cannot be anything else', function () {
      let iter = createNodeIterator(fixture.el, SHOW_TEXT)
      let node = iter.nextNode()
      assert.throws(() => seek(iter, 'bogus'), /number/)
    })
  })

  describe('by a number', function () {
    it('accepts zero as an argument', function () {
      let iter = createNodeIterator(fixture.el, SHOW_TEXT)
      let p = fixture.el.childNodes[0]
      let node = p.childNodes[0].childNodes[0]
      assert.doesNotThrow(() => seek(iter, 0))
      assert.strictEqual(iter.referenceNode, node)
      assert.isTrue(iter.pointerBeforeReferenceNode)
    })

    it('stops when traversing past the beginning', function () {
      let iter = createNodeIterator(fixture.el, SHOW_TEXT)
      assert.throws(() => seek(iter, -100), /exhausted/)
    })

    it('stops when traversing past the end', function () {
      let iter = createNodeIterator(fixture.el, SHOW_TEXT)
      assert.throws(() => seek(iter, fixtureText.length + 100), /exhausted/)
    })

    it('seeks to the start of a node', function () {
      let iter = createNodeIterator(fixture.el, SHOW_TEXT)
      let text = 'Aenean ultricies mi vitae est.'
      let offset = fixtureText.indexOf(text)
      let count = seek(iter, offset)
      assert.equal(count, offset)
      assert.equal(iter.referenceNode.nodeValue, text)
      assert.isTrue(iter.pointerBeforeReferenceNode)
    })

    it('seeks to the nearest node', function () {
      let iter = createNodeIterator(fixture.el, SHOW_TEXT)
      let text = 'Aenean ultricies mi vitae est.'
      let offset = fixtureText.indexOf(text)
      let count = seek(iter, offset + 5)
      assert.equal(count, offset)
      assert.equal(iter.referenceNode.nodeValue, text)
      assert.isTrue(iter.pointerBeforeReferenceNode)
    })

    it('seeks to the last node', function () {
      let iter = createNodeIterator(fixture.el, SHOW_TEXT)
      let text = ' in turpis pulvinar facilisis. Ut\n  felis.'
      let count = seek(iter, fixtureText.length)
      assert.equal(count, fixtureText.length - text.length)
      assert.equal(iter.referenceNode.nodeValue, text)
    })

    it('seeks forwards and backwards', function () {
      let iter = createNodeIterator(fixture.el, SHOW_TEXT)
      let text = 'commodo vitae'
      let offset = fixtureText.indexOf(text)

      let end = seek(iter, offset)
      assert.equal(end, offset)
      assert.equal(iter.referenceNode.nodeValue, text)
      assert.isTrue(iter.pointerBeforeReferenceNode)

      iter.nextNode()

      let count = seek(iter, -(text.length - 3))
      assert.equal(count, -text.length)
      assert.equal(iter.referenceNode.nodeValue, text)
      assert.isTrue(iter.pointerBeforeReferenceNode)
    })

    it('seeks from after the iterator reference node', function () {
      let iter = createNodeIterator(fixture.el, SHOW_TEXT)
      let text = 'Aenean ultricies mi vitae est.'
      let offset = fixtureText.indexOf(text)
      let count = seek(iter, offset)
      assert.equal(count, offset)
      assert.equal(iter.referenceNode.nodeValue, text)
      assert.isTrue(iter.pointerBeforeReferenceNode)

      let node = iter.nextNode()
      let nextNode = iter.nextNode()

      seek(iter, node)
      iter.previousNode()
      iter.nextNode()
      seek(iter, text.length)
      assert.equal(iter.referenceNode, nextNode)

      seek(iter, node)
      iter.nextNode()
      seek(iter, -text.length)
      assert.equal(iter.referenceNode, node)
    })
  })

  describe('to a node', function () {
    it('seeks to the given node', function () {
      let iter = createNodeIterator(fixture.el, SHOW_TEXT)
      let node = fixture.el.getElementsByTagName('code')[0].childNodes[0]
      let offset = fixtureText.indexOf(node.nodeValue)
      let count = seek(iter, node)
      assert.equal(count, offset)
      assert.strictEqual(iter.referenceNode, node)
      assert.isTrue(iter.pointerBeforeReferenceNode)
    })

    it('seeks forwards and backwards', function () {
      let iter = createNodeIterator(fixture.el, SHOW_TEXT)
      let code = fixture.el.getElementsByTagName('code')[0].childNodes[0]
      let strong = fixture.el.getElementsByTagName('strong')[0].childNodes[0]
      seek(iter, code)
      let from = fixtureText.indexOf(code.nodeValue)
      let to =  fixtureText.indexOf(strong.nodeValue)
      let count = seek(iter, strong)
      let expected = to - from
      assert.equal(count, expected)
      assert.isTrue(iter.pointerBeforeReferenceNode)
    })
  })
})
