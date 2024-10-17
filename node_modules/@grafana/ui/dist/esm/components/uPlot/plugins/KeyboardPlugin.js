import { clamp } from 'lodash';
import { useLayoutEffect } from 'react';

const PIXELS_PER_MS = 0.1;
const SHIFT_MULTIPLIER = 2;
const KNOWN_KEYS = /* @__PURE__ */ new Set(["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", "Shift", " "]);
const initHook = (u) => {
  var _a, _b;
  let parentWithFocus = u.root;
  let pressedKeys = /* @__PURE__ */ new Set();
  let dragStartX = null;
  let keysLastHandledAt = null;
  if (!parentWithFocus) {
    return;
  }
  parentWithFocus.tabIndex = 0;
  const moveCursor = (dx, dy) => {
    const { cursor } = u;
    if (cursor.left === void 0 || cursor.top === void 0) {
      return;
    }
    const { width, height } = u.over.style;
    const [maxX, maxY] = [Math.floor(parseFloat(width)), Math.floor(parseFloat(height))];
    u.setCursor({
      left: clamp(cursor.left + dx, 0, maxX),
      top: clamp(cursor.top + dy, 0, maxY)
    });
  };
  const handlePressedKeys = (time) => {
    const nothingPressed = pressedKeys.size === 0;
    if (nothingPressed || !u) {
      keysLastHandledAt = null;
      return;
    }
    const dt = time - (keysLastHandledAt != null ? keysLastHandledAt : time);
    const dx = dt * PIXELS_PER_MS;
    let horValue = 0;
    let vertValue = 0;
    if (pressedKeys.has("ArrowUp")) {
      vertValue -= dx;
    }
    if (pressedKeys.has("ArrowDown")) {
      vertValue += dx;
    }
    if (pressedKeys.has("ArrowLeft")) {
      horValue -= dx;
    }
    if (pressedKeys.has("ArrowRight")) {
      horValue += dx;
    }
    if (pressedKeys.has("Shift")) {
      horValue *= SHIFT_MULTIPLIER;
      vertValue *= SHIFT_MULTIPLIER;
    }
    moveCursor(horValue, vertValue);
    const { cursor } = u;
    if (pressedKeys.has(" ") && cursor) {
      const drawHeight = Number(u.over.style.height.slice(0, -2));
      u.setSelect(
        {
          left: cursor.left < dragStartX ? cursor.left : dragStartX,
          top: 0,
          width: Math.abs(cursor.left - (dragStartX != null ? dragStartX : cursor.left)),
          height: drawHeight
        },
        false
      );
    }
    keysLastHandledAt = time;
    window.requestAnimationFrame(handlePressedKeys);
  };
  const onKeyDown = (e) => {
    if (e.key === "Tab") {
      u.setCursor({ left: -5, top: -5 });
      return;
    }
    if (!KNOWN_KEYS.has(e.key)) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    const newKey = !pressedKeys.has(e.key);
    if (newKey) {
      const initiateAnimationLoop = pressedKeys.size === 0;
      pressedKeys.add(e.key);
      dragStartX = e.key === " " && dragStartX === null ? u.cursor.left : dragStartX;
      if (initiateAnimationLoop) {
        window.requestAnimationFrame(handlePressedKeys);
      }
    }
  };
  const onKeyUp = (e) => {
    if (!KNOWN_KEYS.has(e.key)) {
      return;
    }
    pressedKeys.delete(e.key);
    if (e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      u.setSelect(u.select);
      dragStartX = null;
    }
  };
  const onFocus = () => {
    if (!(parentWithFocus == null ? void 0 : parentWithFocus.matches(":focus-visible"))) {
      return;
    }
    const drawWidth = parseFloat(u.over.style.width);
    const drawHeight = parseFloat(u.over.style.height);
    u.setCursor({ left: drawWidth / 2, top: drawHeight / 2 });
  };
  const onBlur = () => {
    keysLastHandledAt = null;
    dragStartX = null;
    pressedKeys.clear();
    u.setSelect({ left: 0, top: 0, width: 0, height: 0 }, false);
  };
  parentWithFocus.addEventListener("keydown", onKeyDown);
  parentWithFocus.addEventListener("keyup", onKeyUp);
  parentWithFocus.addEventListener("focus", onFocus);
  parentWithFocus.addEventListener("blur", onBlur);
  const onDestroy = () => {
    parentWithFocus == null ? void 0 : parentWithFocus.removeEventListener("keydown", onKeyDown);
    parentWithFocus == null ? void 0 : parentWithFocus.removeEventListener("keyup", onKeyUp);
    parentWithFocus == null ? void 0 : parentWithFocus.removeEventListener("focus", onFocus);
    parentWithFocus == null ? void 0 : parentWithFocus.removeEventListener("blur", onBlur);
    parentWithFocus = null;
  };
  ((_b = (_a = u.hooks).destroy) != null ? _b : _a.destroy = []).push(onDestroy);
};
const KeyboardPlugin = ({ config }) => {
  useLayoutEffect(() => config.addHook("init", initHook), [config]);
  return null;
};

export { KeyboardPlugin };
//# sourceMappingURL=KeyboardPlugin.js.map
