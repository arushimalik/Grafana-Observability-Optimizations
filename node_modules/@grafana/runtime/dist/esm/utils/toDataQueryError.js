function toDataQueryError(err) {
  var _a, _b, _c;
  const error = err || {};
  if (!error.message) {
    if (typeof err === "string") {
      return { message: err };
    }
    let message = "Query error";
    if (error.message) {
      message = error.message;
    } else if (error.data && error.data.message && ((_a = error.data) == null ? void 0 : _a.message) !== "Query data error") {
      message = error.data.message;
    } else if (((_b = error == null ? void 0 : error.data) == null ? void 0 : _b.message) === "Query data error" && ((_c = error == null ? void 0 : error.data) == null ? void 0 : _c.error)) {
      message = error.data.error;
    } else if (error.data && error.data.error) {
      message = error.data.error;
    } else if (error.status) {
      message = `Query error: ${error.status} ${error.statusText}`;
    }
    error.message = message;
  }
  return error;
}

export { toDataQueryError };
//# sourceMappingURL=toDataQueryError.js.map
