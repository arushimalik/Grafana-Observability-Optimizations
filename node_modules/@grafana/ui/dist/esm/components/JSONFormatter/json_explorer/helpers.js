function formatString(str) {
  return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
function isObject(value2) {
  const type = typeof value2;
  return !!value2 && type === "object";
}
function getObjectName(object) {
  if (object === void 0) {
    return "";
  }
  if (object === null) {
    return "Object";
  }
  if (typeof object === "object" && !object.constructor) {
    return "Object";
  }
  const funcNameRegex = /function ([^(]*)/;
  const results = funcNameRegex.exec(object.constructor.toString());
  if (results && results.length > 1) {
    return results[1];
  } else {
    return "";
  }
}
function getType(object) {
  if (object === null) {
    return "null";
  }
  return typeof object;
}
function getValuePreview(object, value2) {
  const type = getType(object);
  if (type === "null" || type === "undefined") {
    return type;
  }
  if (type === "string") {
    value2 = '"' + formatString(value2) + '"';
  }
  if (type === "function") {
    return object.toString().replace(/[\r\n]/g, "").replace(/\{.*\}/, "") + "{\u2026}";
  }
  return value2;
}
function cssClass(className) {
  return `json-formatter-${className}`;
}
function createElement(type, className, content) {
  const el = document.createElement(type);
  if (className) {
    el.classList.add(cssClass(className));
  }
  if (content !== void 0) {
    if (content instanceof Node) {
      el.appendChild(content);
    } else {
      el.appendChild(document.createTextNode(String(content)));
    }
  }
  return el;
}

export { createElement, cssClass, formatString, getObjectName, getType, getValuePreview, isObject };
//# sourceMappingURL=helpers.js.map
