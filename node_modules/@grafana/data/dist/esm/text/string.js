import { camelCase } from 'lodash';

const specialChars = ["(", "[", "{", "}", "]", ")", "\\", "|", "*", "+", "-", ".", "?", "<", ">", "#", "&", "^", "$"];
const specialMatcher = "([\\" + specialChars.join("\\") + "])";
const specialCharEscape = new RegExp(specialMatcher, "g");
const specialCharUnescape = new RegExp("(\\\\)" + specialMatcher, "g");
function escapeStringForRegex(value) {
  if (!value) {
    return value;
  }
  return value.replace(specialCharEscape, "\\$1");
}
function unEscapeStringFromRegex(value) {
  if (!value) {
    return value;
  }
  return value.replace(specialCharUnescape, "$2");
}
function stringStartsAsRegEx(str) {
  if (!str) {
    return false;
  }
  return str[0] === "/";
}
function stringToJsRegex(str) {
  if (!stringStartsAsRegEx(str)) {
    return new RegExp(`^${str}$`);
  }
  const match = str.match(new RegExp("^/(.*?)/(g?i?m?y?s?)$"));
  if (!match) {
    throw new Error(`'${str}' is not a valid regular expression.`);
  }
  return new RegExp(match[1], match[2]);
}
function stringToMs(str) {
  if (!str) {
    return 0;
  }
  const nr = parseInt(str, 10);
  const unit = str.slice(String(nr).length);
  const s = 1e3;
  const m = s * 60;
  const h = m * 60;
  const d = h * 24;
  switch (unit) {
    case "s":
      return nr * s;
    case "m":
      return nr * m;
    case "h":
      return nr * h;
    case "d":
      return nr * d;
    default:
      if (!unit) {
        return isNaN(nr) ? 0 : nr;
      }
      throw new Error("Not supported unit: " + unit);
  }
}
function toNumberString(value) {
  if (value !== null && value !== void 0 && Number.isFinite(value)) {
    return value.toString();
  }
  return "";
}
function toIntegerOrUndefined(value) {
  if (!value) {
    return void 0;
  }
  const v = parseInt(value, 10);
  return isNaN(v) ? void 0 : v;
}
function toFloatOrUndefined(value) {
  if (!value) {
    return void 0;
  }
  const v = parseFloat(value);
  return isNaN(v) ? void 0 : v;
}
function toPascalCase(string) {
  const str = camelCase(string);
  return str.charAt(0).toUpperCase() + str.substring(1);
}
function escapeRegex(value) {
  return value.replace(/[\\^$*+?.()|[\]{}\/]/g, "\\$&");
}

export { escapeRegex, escapeStringForRegex, stringStartsAsRegEx, stringToJsRegex, stringToMs, toFloatOrUndefined, toIntegerOrUndefined, toNumberString, toPascalCase, unEscapeStringFromRegex };
//# sourceMappingURL=string.js.map
