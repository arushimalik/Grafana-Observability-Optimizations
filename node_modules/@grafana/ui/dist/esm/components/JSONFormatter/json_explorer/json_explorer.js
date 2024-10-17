import { isNumber } from 'lodash';
import { isObject, getObjectName, getType, cssClass, createElement, getValuePreview } from './helpers.js';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const DATE_STRING_REGEX = /(^\d{1,4}[\.|\\/|-]\d{1,2}[\.|\\/|-]\d{1,4})(\s*(?:0?[1-9]:[0-5]|1(?=[012])\d:[0-5])\d\s*[ap]m)?$/;
const PARTIAL_DATE_REGEX = /\d{2}:\d{2}:\d{2} GMT-\d{4}/;
const JSON_DATE_REGEX = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/;
const MAX_ANIMATED_TOGGLE_ITEMS = 10;
const requestAnimationFrame = typeof window !== "undefined" && window.requestAnimationFrame || ((cb) => {
  cb();
  return 0;
});
const _defaultConfig = {
  animateOpen: true,
  animateClose: true
};
class JsonExplorer {
  /**
   * @param {object} json The JSON object you want to render. It has to be an
   * object or array. Do NOT pass raw JSON string.
   *
   * @param {number} [open=1] his number indicates up to how many levels the
   * rendered tree should expand. Set it to `0` to make the whole tree collapsed
   * or set it to `Infinity` to expand the tree deeply
   *
   * @param {object} [config=defaultConfig] -
   *  defaultConfig = {
   *   hoverPreviewEnabled: false,
   *   hoverPreviewArrayCount: 100,
   *   hoverPreviewFieldCount: 5
   * }
   *
   * Available configurations:
   *  #####Hover Preview
   * * `hoverPreviewEnabled`:  enable preview on hover
   * * `hoverPreviewArrayCount`: number of array items to show in preview Any
   *    array larger than this number will be shown as `Array[XXX]` where `XXX`
   *    is length of the array.
   * * `hoverPreviewFieldCount`: number of object properties to show for object
   *   preview. Any object with more properties that thin number will be
   *   truncated.
   *
   * @param {string} [key=undefined] The key that this object in its parent
   * context
   */
  constructor(json, open = 1, config = _defaultConfig, key) {
    this.json = json;
    this.open = open;
    this.config = config;
    this.key = key;
    // Hold the open state after the toggler is used
    __publicField(this, "_isOpen", null);
    // A reference to the element that we render to
    __publicField(this, "element", null);
    __publicField(this, "skipChildren", false);
  }
  /*
   * is formatter open?
   */
  get isOpen() {
    if (this._isOpen !== null) {
      return this._isOpen;
    } else {
      return this.open > 0;
    }
  }
  /*
   * set open state (from toggler)
   */
  set isOpen(value) {
    this._isOpen = value;
  }
  /*
   * is this a date string?
   */
  get isDate() {
    return this.type === "string" && (DATE_STRING_REGEX.test(this.json) || JSON_DATE_REGEX.test(this.json) || PARTIAL_DATE_REGEX.test(this.json));
  }
  /*
   * is this a URL string?
   */
  get isUrl() {
    return this.type === "string" && this.json.indexOf("http") === 0;
  }
  /*
   * is this an array?
   */
  get isArray() {
    return Array.isArray(this.json);
  }
  /*
   * is this an object?
   * Note: In this context arrays are object as well
   */
  get isObject() {
    return isObject(this.json);
  }
  /*
   * is this an empty object with no properties?
   */
  get isEmptyObject() {
    return !this.keys.length && !this.isArray;
  }
  /*
   * is this an empty object or array?
   */
  get isEmpty() {
    return this.isEmptyObject || this.keys && !this.keys.length && this.isArray;
  }
  /*
   * did we receive a key argument?
   * This means that the formatter was called as a sub formatter of a parent formatter
   */
  get hasKey() {
    return typeof this.key !== "undefined";
  }
  /*
   * if this is an object, get constructor function name
   */
  get constructorName() {
    return getObjectName(this.json);
  }
  /*
   * get type of this value
   * Possible values: all JavaScript primitive types plus "array" and "null"
   */
  get type() {
    return getType(this.json);
  }
  /*
   * get object keys
   * If there is an empty key we pad it wit quotes to make it visible
   */
  get keys() {
    if (this.isObject) {
      return Object.keys(this.json).map((key) => key ? key : '""');
    } else {
      return [];
    }
  }
  /**
   * Toggles `isOpen` state
   *
   */
  toggleOpen() {
    this.isOpen = !this.isOpen;
    if (this.element) {
      if (this.isOpen) {
        this.appendChildren(this.config.animateOpen);
      } else {
        this.removeChildren(this.config.animateClose);
      }
      this.element.classList.toggle(cssClass("open"));
    }
  }
  /**
   * Open all children up to a certain depth.
   * Allows actions such as expand all/collapse all
   *
   */
  openAtDepth(depth = 1) {
    if (depth < 0) {
      return;
    }
    this.open = depth;
    this.isOpen = depth !== 0;
    if (this.element) {
      this.removeChildren(false);
      if (depth === 0) {
        this.element.classList.remove(cssClass("open"));
      } else {
        this.appendChildren(this.config.animateOpen);
        this.element.classList.add(cssClass("open"));
      }
    }
  }
  isNumberArray() {
    return this.json.length > 0 && this.json.length < 4 && (isNumber(this.json[0]) || isNumber(this.json[1]));
  }
  renderArray() {
    const arrayWrapperSpan = createElement("span");
    arrayWrapperSpan.appendChild(createElement("span", "bracket", "["));
    if (this.isNumberArray()) {
      this.json.forEach((val, index) => {
        if (index > 0) {
          arrayWrapperSpan.appendChild(createElement("span", "array-comma", ","));
        }
        arrayWrapperSpan.appendChild(createElement("span", "number", val));
      });
      this.skipChildren = true;
    } else {
      arrayWrapperSpan.appendChild(createElement("span", "number", this.json.length));
    }
    arrayWrapperSpan.appendChild(createElement("span", "bracket", "]"));
    return arrayWrapperSpan;
  }
  /**
   * Renders an HTML element and installs event listeners
   *
   * @returns {HTMLDivElement}
   */
  render(skipRoot = false) {
    this.element = createElement("div", "row");
    const togglerLink = createElement("a", "toggler-link");
    const togglerIcon = createElement("span", "toggler");
    if (this.isObject) {
      togglerLink.appendChild(togglerIcon);
    }
    if (this.hasKey) {
      togglerLink.appendChild(createElement("span", "key", `${this.key}:`));
    }
    if (this.isObject) {
      const value = createElement("span", "value");
      const objectWrapperSpan = createElement("span");
      const constructorName = createElement("span", "constructor-name", this.constructorName);
      objectWrapperSpan.appendChild(constructorName);
      if (this.isArray) {
        const arrayWrapperSpan = this.renderArray();
        objectWrapperSpan.appendChild(arrayWrapperSpan);
      }
      value.appendChild(objectWrapperSpan);
      togglerLink.appendChild(value);
    } else {
      const value = this.isUrl ? createElement("a") : createElement("span");
      value.classList.add(cssClass(this.type));
      if (this.isDate) {
        value.classList.add(cssClass("date"));
      }
      if (this.isUrl) {
        value.classList.add(cssClass("url"));
        value.setAttribute("href", this.json);
      }
      const valuePreview = getValuePreview(this.json, this.json);
      value.appendChild(document.createTextNode(valuePreview));
      togglerLink.appendChild(value);
    }
    const children = createElement("div", "children");
    if (this.isObject) {
      children.classList.add(cssClass("object"));
    }
    if (this.isArray) {
      children.classList.add(cssClass("array"));
    }
    if (this.isEmpty) {
      children.classList.add(cssClass("empty"));
    }
    if (this.config && this.config.theme) {
      this.element.classList.add(cssClass(this.config.theme));
    }
    if (this.isOpen) {
      this.element.classList.add(cssClass("open"));
    }
    if (!skipRoot) {
      this.element.appendChild(togglerLink);
    }
    if (!this.skipChildren) {
      this.element.appendChild(children);
    } else {
      togglerLink.removeChild(togglerIcon);
    }
    if (this.isObject && this.isOpen) {
      this.appendChildren();
    }
    if (this.isObject) {
      togglerLink.addEventListener("click", this.toggleOpen.bind(this));
    }
    return this.element;
  }
  /**
   * Appends all the children to children element
   * Animated option is used when user triggers this via a click
   */
  appendChildren(animated = false) {
    const children = this.element && this.element.querySelector(`div.${cssClass("children")}`);
    if (!children || this.isEmpty) {
      return;
    }
    if (animated) {
      let index = 0;
      const addAChild = () => {
        const key = this.keys[index];
        const formatter = new JsonExplorer(this.json[key], this.open - 1, this.config, key);
        children.appendChild(formatter.render());
        index += 1;
        if (index < this.keys.length) {
          if (index > MAX_ANIMATED_TOGGLE_ITEMS) {
            addAChild();
          } else {
            requestAnimationFrame(addAChild);
          }
        }
      };
      requestAnimationFrame(addAChild);
    } else {
      this.keys.forEach((key) => {
        const formatter = new JsonExplorer(this.json[key], this.open - 1, this.config, key);
        children.appendChild(formatter.render());
      });
    }
  }
  /**
   * Removes all the children from children element
   * Animated option is used when user triggers this via a click
   */
  removeChildren(animated = false) {
    const childrenElement = this.element && this.element.querySelector(`div.${cssClass("children")}`);
    if (animated) {
      let childrenRemoved = 0;
      const removeAChild = () => {
        if (childrenElement && childrenElement.children.length) {
          childrenElement.removeChild(childrenElement.children[0]);
          childrenRemoved += 1;
          if (childrenRemoved > MAX_ANIMATED_TOGGLE_ITEMS) {
            removeAChild();
          } else {
            requestAnimationFrame(removeAChild);
          }
        }
      };
      requestAnimationFrame(removeAChild);
    } else {
      if (childrenElement) {
        childrenElement.innerHTML = "";
      }
    }
  }
}

export { JsonExplorer };
//# sourceMappingURL=json_explorer.js.map
