/** @module text-walker */

/** Start seeking from the beginning of the text. */
export const SEEK_SET = Symbol('SEEK_SET');

/** Start seeking from the current position within the text. */
export const SEEK_CUR = Symbol('SEEK_CUR');

/** Start seeking from the end of the text. */
export const SEEK_END = Symbol('SEEK_END');

// A NodeFilter bitmask matching node types included by `Node.textContent`.
const TEXT_FILTER = (
  NodeFilter.SHOW_ALL &
  ~NodeFilter.SHOW_COMMENT &
  ~NodeFilter.SHOW_PROCESSING_INSTRUCTION
);


export class TextWalker {
  /**
   * The `TextWalker` class provides a seekable view over a `Node` tree.
   * @class
   * @param {Node} root The root `Node` of the tree to consider
   * @param {Object} filter An `Object` containing a key, "acceptNode", that
   * has a function value that accepts a `Node` and returns `true`
   * or `false` to indicate whether the `Node` should be included when
   * traversing the tree and counting text
   * @memberof module:text-walker
   */
  constructor(root, filter) {
    this.root = root;
    this.currentNode = root;
    this.filter = filter;
    this.offset = 0;
  }

  /**
   * Seek the `TextWalker` to a new text offset.
   *
   * @param {Symbol} whence one of
   * [SEEK_SET]{@link module:text-walker.SEEK_SET},
   * [SEEK_CUR]{@link module:text-walker.SEEK_CUR} or
   * [SEEK_END]{@link module:text-walker.SEEK_END}. The meaning is the same as
   * for POSIX lseek(2) except that it is impossible to seek past the end of
   * the text
   * @returns {Number} The offset of the last `Node` that contains the
   * requested
   * destination offset, as measured from the beginning of the text
   */
  seek(offset, whence = SEEK_SET) {
    let walker = document.createTreeWalker(this.root, TEXT_FILTER, this.filter);

    switch (whence) {
    case SEEK_SET:
      this.offset = 0;
      walker.currentNode = this.root;
      break;
    case SEEK_CUR:
      // XXX: Only two hard problems...
      walker.currentNode = this.currentNode;
      break;
    case SEEK_END:
        throw new Error('Seeking from the end not yet supported');
    }

    // Walk forwards
    while (offset > 0) {
      let step = walker.currentNode.textContent.length;

      if (step > offset) {
        // If this node is longer than the remainder to seek then step in to it.
        if (walker.firstChild() === null) {
          // If there is no smaller step to take then finish.
          break;
        } else {
          // Otherwise, continue with the first child.
          continue;
        }
      } else if (walker.nextSibling() === null) {
        // If this node is not longer than the seek then try to step over it.
        if (walker.nextNode() === null) {
          // Failing that, step out or finish.
          break;
        }
      }

      // Update the instance offset cache
      this.offset += step;

      // Decrease the remainder offset and continue.
      offset -= step;
    }

    // Walk backwards
    while (offset < 0) {
      throw new Error('Negative offset values not yet supported.');
    }

    // Store the current node
    this.currentNode = walker.currentNode;

    // Return the offset.
    return this.offset;
  }

  tell() {
    // Calculating the offset is the safest way to be correct even if the DOM
    // has changed since this instance was created, but it is obviously slow.
    let node = null;
    let offset = 0;
    let walker = document.createTreeWalker(this.root, TEXT_FILTER, this.filter);

    // Start from the current node.
    walker.currentNode = this.currentNode;

    // Continue until reaching the root.
    while (walker.currentNode !== walker.root) {
      // Step backwards through siblings, to count the leading content.
      while (node = walker.previousSibling()) {
        offset += node.textContent.length;
      }
      // Step up to the parent and continue until done.
      walker.parentNode();
    }

    // Store and return the offset.
    this.offset = offset
    return this.offset
  }
}