import { throttle } from 'lodash';
import { useRef, useLayoutEffect } from 'react';
import { Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { DataHoverEvent, DataHoverClearEvent, LegacyGraphHoverEvent } from '@grafana/data';

const EventBusPlugin = ({ config, eventBus, frame }) => {
  const frameRef = useRef(frame);
  frameRef.current = frame;
  useLayoutEffect(() => {
    let u = null;
    const payload = {
      point: {
        time: null
      },
      data: frameRef.current
    };
    config.addHook("init", (_u) => {
      u = _u;
    });
    let closestSeriesIdx = null;
    config.addHook("setSeries", (u2, seriesIdx) => {
      closestSeriesIdx = seriesIdx;
    });
    config.addHook("setLegend", () => {
      var _a;
      let viaSync = u.cursor.event == null;
      if (!viaSync) {
        let dataIdx = u.cursor.idxs.find((v) => v != null);
        if (dataIdx == null) {
          throttledClear();
        } else {
          let rowIdx = dataIdx;
          let colIdx = closestSeriesIdx;
          let xData = (_a = u.data[0]) != null ? _a : u.data[1][0];
          payload.point.time = xData[rowIdx];
          payload.rowIndex = rowIdx != null ? rowIdx : void 0;
          payload.columnIndex = colIdx != null ? colIdx : void 0;
          payload.data = frameRef.current;
          let top = u.cursor.top;
          payload.point.panelRelY = top === 0 ? 1e-3 : top > 0 ? top / u.rect.height : 1;
          throttledHover();
        }
      }
    });
    function handleCursorUpdate(evt) {
      var _a, _b;
      const time = (_b = (_a = evt.payload) == null ? void 0 : _a.point) == null ? void 0 : _b.time;
      if (time) {
        const left = u.valToPos(time, "x");
        u.setCursor({
          left,
          top: u.rect.height / 2
        });
      }
    }
    const subscription = new Subscription();
    const hoverEvent = new DataHoverEvent(payload).setTags(["uplot"]);
    const clearEvent = new DataHoverClearEvent().setTags(["uplot"]);
    let throttledHover = throttle(() => {
      eventBus.publish(hoverEvent);
    }, 100);
    let throttledClear = throttle(() => {
      eventBus.publish(clearEvent);
    }, 100);
    subscription.add(
      eventBus.getStream(DataHoverEvent).subscribe({
        next: (evt) => {
          var _a;
          if (eventBus === evt.origin || ((_a = evt.tags) == null ? void 0 : _a.has("uplot"))) {
            return;
          }
          handleCursorUpdate(evt);
        }
      })
    );
    subscription.add(
      eventBus.getStream(LegacyGraphHoverEvent).subscribe({
        next: (evt) => handleCursorUpdate(evt)
      })
    );
    subscription.add(
      eventBus.getStream(DataHoverClearEvent).pipe(throttleTime(50)).subscribe({
        next: (evt) => {
          var _a;
          if (eventBus === evt.origin || ((_a = evt.tags) == null ? void 0 : _a.has("uplot"))) {
            return;
          }
          if (!u.cursor._lock) {
            u.setCursor({
              left: -10,
              top: -10
            });
          }
        }
      })
    );
    return () => {
      subscription.unsubscribe();
    };
  }, [config]);
  return null;
};

export { EventBusPlugin };
//# sourceMappingURL=EventBusPlugin.js.map
