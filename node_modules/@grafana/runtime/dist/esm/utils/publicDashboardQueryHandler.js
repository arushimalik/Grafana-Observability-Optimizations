import { of, switchMap, catchError } from 'rxjs';
import { config } from '../config.js';
import { getBackendSrv } from '../services/backendSrv.js';
import { toDataQueryResponse } from './queryResponse.js';

function publicDashboardQueryHandler(request) {
  const {
    intervalMs,
    maxDataPoints,
    requestId,
    panelId,
    queryCachingTTL,
    range: { from: fromRange, to: toRange }
  } = request;
  if (!request.targets.length) {
    return of({ data: [] });
  }
  const body = {
    intervalMs,
    maxDataPoints,
    queryCachingTTL,
    timeRange: {
      from: fromRange.valueOf().toString(),
      to: toRange.valueOf().toString(),
      timezone: request.timezone
    }
  };
  return getBackendSrv().fetch({
    url: `/api/public/dashboards/${config.publicDashboardAccessToken}/panels/${panelId}/query`,
    method: "POST",
    data: body,
    requestId
  }).pipe(
    switchMap((raw) => {
      return of(toDataQueryResponse(raw, request.targets));
    }),
    catchError((err) => {
      return of(toDataQueryResponse(err));
    })
  );
}

export { publicDashboardQueryHandler };
//# sourceMappingURL=publicDashboardQueryHandler.js.map
