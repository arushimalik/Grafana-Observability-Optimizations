import { useLayoutEffect } from 'react';

const MIN_ZOOM_DIST = 5;
const maybeZoomAction = (e) => e != null && !e.ctrlKey && !e.metaKey;
const ZoomPlugin = ({ onZoom, config, withZoomY = false }) => {
  useLayoutEffect(() => {
    let yZoomed = false;
    let yDrag = false;
    if (withZoomY) {
      config.addHook("init", (u) => {
        u.over.addEventListener(
          "mousedown",
          (e) => {
            if (!maybeZoomAction(e)) {
              return;
            }
            if (e.button === 0 && e.shiftKey) {
              yDrag = true;
              u.cursor.drag.x = false;
              u.cursor.drag.y = true;
              let onUp = (e2) => {
                u.cursor.drag.x = true;
                u.cursor.drag.y = false;
                document.removeEventListener("mouseup", onUp, true);
              };
              document.addEventListener("mouseup", onUp, true);
            }
          },
          true
        );
      });
    }
    config.addHook("setSelect", (u) => {
      const isXAxisHorizontal = u.scales.x.ori === 0;
      if (maybeZoomAction(u.cursor.event)) {
        if (withZoomY && yDrag) {
          if (u.select.height >= MIN_ZOOM_DIST) {
            for (let key in u.scales) {
              if (key !== "x") {
                const maxY = isXAxisHorizontal ? u.posToVal(u.select.top, key) : u.posToVal(u.select.left + u.select.width, key);
                const minY = isXAxisHorizontal ? u.posToVal(u.select.top + u.select.height, key) : u.posToVal(u.select.left, key);
                u.setScale(key, { min: minY, max: maxY });
              }
            }
            yZoomed = true;
          }
          yDrag = false;
        } else {
          if (u.select.width >= MIN_ZOOM_DIST) {
            const minX = isXAxisHorizontal ? u.posToVal(u.select.left, "x") : u.posToVal(u.select.top + u.select.height, "x");
            const maxX = isXAxisHorizontal ? u.posToVal(u.select.left + u.select.width, "x") : u.posToVal(u.select.top, "x");
            onZoom({ from: minX, to: maxX });
            yZoomed = false;
          }
        }
      }
      u.setSelect({ left: 0, width: 0, top: 0, height: 0 }, false);
    });
    config.setCursor({
      bind: {
        dblclick: (u) => () => {
          if (!maybeZoomAction(u.cursor.event)) {
            return null;
          }
          if (withZoomY && yZoomed) {
            for (let key in u.scales) {
              if (key !== "x") {
                u.setScale(key, { min: null, max: null });
              }
            }
            yZoomed = false;
          } else {
            let xScale = u.scales.x;
            const frTs = xScale.min;
            const toTs = xScale.max;
            const pad = (toTs - frTs) / 2;
            onZoom({ from: frTs - pad, to: toTs + pad });
          }
          return null;
        }
      }
    });
  }, [config, onZoom, withZoomY]);
  return null;
};

export { ZoomPlugin };
//# sourceMappingURL=ZoomPlugin.js.map
