if (typeof window !== "undefined" && "Element" in window && !Element.prototype.closest) {
  Element.prototype.closest = function(s) {
    const matches = (this.document || this.ownerDocument).querySelectorAll(s);
    let el = this;
    let i;
    do {
      i = matches.length;
      while (--i >= 0 && matches.item(i) !== el) {
      }
      el = el.parentElement;
    } while (i < 0 && el);
    return el;
  };
}
function getPreviousCousin(node, selector) {
  let sibling = node.parentElement.previousSibling;
  let el;
  while (sibling) {
    el = sibling.querySelector(selector);
    if (el) {
      return el;
    }
    sibling = sibling.previousSibling;
  }
  return void 0;
}
function getNextCharacter(global) {
  const selection = (global || window).getSelection();
  if (!selection || !selection.anchorNode) {
    return null;
  }
  const range = selection.getRangeAt(0);
  const text = selection.anchorNode.textContent;
  const offset = range.startOffset;
  return text.slice(offset, offset + 1);
}

export { getNextCharacter, getPreviousCousin };
//# sourceMappingURL=dom.js.map
