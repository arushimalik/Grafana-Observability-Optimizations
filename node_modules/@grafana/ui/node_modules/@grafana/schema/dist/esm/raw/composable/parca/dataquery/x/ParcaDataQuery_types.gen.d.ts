import * as common from '@grafana/schema';
export declare const pluginVersion = "%VERSION%";
export type ParcaQueryType = ('metrics' | 'profile' | 'both');
export declare const defaultParcaQueryType: ParcaQueryType;
export interface ParcaDataQuery extends common.DataQuery {
    /**
     * Specifies the query label selectors.
     */
    labelSelector: string;
    /**
     * Specifies the type of profile to query.
     */
    profileTypeId: string;
}
export declare const defaultParcaDataQuery: Partial<ParcaDataQuery>;
