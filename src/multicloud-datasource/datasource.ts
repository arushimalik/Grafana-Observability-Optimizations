import { DataQueryRequest, DataQueryResponse, DataSourceInstanceSettings, CoreApp, ScopedVars } from '@grafana/data';
import { DataSourceWithBackend, getTemplateSrv, getBackendSrv } from '@grafana/runtime';

import { MyQuery, MyDataSourceOptions, DEFAULT_QUERY } from './types';

export class DataSource extends DataSourceWithBackend<MyQuery, MyDataSourceOptions> {
  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
  }

  getDefaultQuery(_: CoreApp): Partial<MyQuery> {
    return DEFAULT_QUERY;
  }

  applyTemplateVariables(query: MyQuery, scopedVars: ScopedVars) {
    return {
      ...query,
      queryText: getTemplateSrv().replace(query.queryText, scopedVars),
    };
  }

  filterQuery(query: MyQuery): boolean {
    // if no query has been provided, prevent the query from being executed
    return !!query.queryText;
  }

  async query(request: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const datasources = await getBackendSrv().get("/api/datasources"); // Get all datasources
    const graphiteURLs = datasources.filter((ds: any) => ds.type === "graphite");

    const results = await Promise.all(
      graphiteURLs.map((url: any) =>
        getBackendSrv().fetch({
          url: `${url}/render`,
          method: 'POST',
          data: request.targets, // Modify as needed
        })
      )
    );

    return { data: results.flatMap(r => r.data) };
  }
}
