import * as common from '@grafana/schema';
export declare const pluginVersion = "%VERSION%";
export type PyroscopeQueryType = ('metrics' | 'profile' | 'both');
export declare const defaultPyroscopeQueryType: PyroscopeQueryType;
export interface GrafanaPyroscopeDataQuery extends common.DataQuery {
    /**
     * Allows to group the results.
     */
    groupBy: Array<string>;
    /**
     * Specifies the query label selectors.
     */
    labelSelector: string;
    /**
     * Sets the maximum number of nodes in the flamegraph.
     */
    maxNodes?: number;
    /**
     * Specifies the type of profile to query.
     */
    profileTypeId: string;
    /**
     * Specifies the query span selectors.
     */
    spanSelector?: Array<string>;
}
export declare const defaultGrafanaPyroscopeDataQuery: Partial<GrafanaPyroscopeDataQuery>;
