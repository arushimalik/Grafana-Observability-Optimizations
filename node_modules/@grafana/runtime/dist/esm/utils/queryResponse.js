import { LoadingState, dataFrameFromJSON, toDataFrame, FieldType } from '@grafana/data';
import { toDataQueryError } from './toDataQueryError.js';

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
const cachedResponseNotice = { severity: "info", text: "Cached response" };
function toDataQueryResponse(res, queries) {
  var _a, _b, _c, _d;
  const rsp = { data: [], state: LoadingState.Done };
  const traceId = "traceId" in res ? res.traceId : void 0;
  if (traceId != null) {
    rsp.traceIds = [traceId];
  }
  const fetchResponse = res;
  if ((_a = fetchResponse.data) == null ? void 0 : _a.results) {
    const results = fetchResponse.data.results;
    const refIDs = (queries == null ? void 0 : queries.length) ? queries.map((q) => q.refId) : Object.keys(results);
    const cachedResponse = isCachedResponse(fetchResponse);
    const data = [];
    for (const refId of refIDs) {
      const dr = results[refId];
      if (!dr) {
        continue;
      }
      dr.refId = refId;
      data.push(dr);
    }
    for (const dr of data) {
      if (dr.error) {
        const errorObj = {
          refId: dr.refId,
          message: dr.error,
          status: dr.status
        };
        if (traceId != null) {
          errorObj.traceId = traceId;
        }
        if (!rsp.error) {
          rsp.error = __spreadValues({}, errorObj);
        }
        if (rsp.errors) {
          rsp.errors.push(__spreadValues({}, errorObj));
        } else {
          rsp.errors = [__spreadValues({}, errorObj)];
        }
        rsp.state = LoadingState.Error;
      }
      if ((_b = dr.frames) == null ? void 0 : _b.length) {
        for (let js of dr.frames) {
          if (cachedResponse) {
            js = addCacheNotice(js);
          }
          const df = dataFrameFromJSON(js);
          if (!df.refId) {
            df.refId = dr.refId;
          }
          rsp.data.push(df);
        }
        continue;
      }
      if ((_c = dr.series) == null ? void 0 : _c.length) {
        for (const s of dr.series) {
          if (!s.refId) {
            s.refId = dr.refId;
          }
          rsp.data.push(toDataFrame(s));
        }
      }
      if ((_d = dr.tables) == null ? void 0 : _d.length) {
        for (const s of dr.tables) {
          if (!s.refId) {
            s.refId = dr.refId;
          }
          rsp.data.push(toDataFrame(s));
        }
      }
    }
  }
  if (fetchResponse.status && fetchResponse.status !== 200) {
    if (rsp.state !== LoadingState.Error) {
      rsp.state = LoadingState.Error;
    }
    if (!rsp.error) {
      rsp.error = toDataQueryError(res);
    }
  }
  return rsp;
}
function isCachedResponse(res) {
  const headers = res == null ? void 0 : res.headers;
  if (!headers || !headers.get) {
    return false;
  }
  return headers.get("X-Cache") === "HIT";
}
function addCacheNotice(frame) {
  var _a, _b, _c, _d, _e, _f;
  return __spreadProps(__spreadValues({}, frame), {
    schema: __spreadProps(__spreadValues({}, frame.schema), {
      fields: [...(_b = (_a = frame.schema) == null ? void 0 : _a.fields) != null ? _b : []],
      meta: __spreadProps(__spreadValues({}, (_c = frame.schema) == null ? void 0 : _c.meta), {
        notices: [...(_f = (_e = (_d = frame.schema) == null ? void 0 : _d.meta) == null ? void 0 : _e.notices) != null ? _f : [], cachedResponseNotice],
        isCachedResponse: true
      })
    })
  });
}
function frameToMetricFindValue(frame) {
  if (!frame || !frame.length) {
    return [];
  }
  const values = [];
  let field = frame.fields.find((f) => f.type === FieldType.string);
  if (!field) {
    field = frame.fields.find((f) => f.type !== FieldType.time);
  }
  if (field) {
    for (let i = 0; i < field.values.length; i++) {
      values.push({ text: "" + field.values[i] });
    }
  }
  return values;
}

export { cachedResponseNotice, frameToMetricFindValue, toDataQueryResponse };
//# sourceMappingURL=queryResponse.js.map
