import { DataSourceRef as CommonDataSourceRef, DataSourceRef, DataTopic } from '../common/common.gen';
import * as raw from '../raw/dashboard/x/dashboard_types.gen';
import { DataQuery } from './common.types';
export type { CommonDataSourceRef as DataSourceRef };
export interface Panel<TOptions = Record<string, unknown>, TCustomFieldConfig = Record<string, unknown>> extends Omit<raw.Panel, 'fieldConfig'> {
    fieldConfig?: FieldConfigSource<TCustomFieldConfig>;
}
export interface RowPanel extends Omit<raw.RowPanel, 'panels'> {
    panels: Panel[];
}
export declare enum VariableHide {
    dontHide = 0,
    hideLabel = 1,
    hideVariable = 2
}
export interface VariableModel extends Omit<raw.VariableModel, 'datasource'> {
    datasource?: DataSourceRef | null;
}
export interface Dashboard extends Omit<raw.Dashboard, 'templating' | 'annotations' | 'panels'> {
    panels?: Array<Panel | RowPanel>;
    annotations?: AnnotationContainer;
    templating?: {
        list?: VariableModel[];
    };
}
export interface AnnotationQuery<TQuery extends DataQuery = DataQuery> extends Omit<raw.AnnotationQuery, 'target' | 'datasource'> {
    datasource?: DataSourceRef | null;
    target?: TQuery;
    snapshotData?: unknown;
}
export interface AnnotationContainer extends Omit<raw.AnnotationContainer, 'list'> {
    list?: AnnotationQuery[];
}
export interface FieldConfig<TOptions = Record<string, unknown>> extends raw.FieldConfig {
    custom?: TOptions & Record<string, unknown>;
}
export interface FieldConfigSource<TOptions = Record<string, unknown>> extends Omit<raw.FieldConfigSource, 'defaults'> {
    defaults: FieldConfig<TOptions>;
}
export interface MatcherConfig<TConfig = any> extends raw.MatcherConfig {
    options?: TConfig;
}
export interface DataTransformerConfig<TOptions = any> extends raw.DataTransformerConfig {
    options: TOptions;
    topic?: DataTopic;
}
export interface TimePickerConfig extends raw.TimePickerConfig {
}
export declare const defaultDashboard: Dashboard;
export declare const defaultVariableModel: VariableModel;
export declare const defaultTimePickerConfig: TimePickerConfig;
export declare const defaultPanel: Partial<Panel>;
export declare const defaultRowPanel: Partial<Panel>;
export declare const defaultFieldConfig: Partial<FieldConfig>;
export declare const defaultFieldConfigSource: Partial<FieldConfigSource>;
export declare const defaultMatcherConfig: Partial<MatcherConfig>;
export declare const defaultAnnotationQuery: Partial<AnnotationQuery>;
export declare const defaultAnnotationContainer: Partial<AnnotationContainer>;
