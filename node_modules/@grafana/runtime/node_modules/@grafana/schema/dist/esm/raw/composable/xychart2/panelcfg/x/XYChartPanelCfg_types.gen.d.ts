import * as common from '@grafana/schema';
export declare const pluginVersion = "11.0.0-pre";
/**
 * Auto is "table" in the UI
 */
export declare enum SeriesMapping {
    Auto = "auto",
    Manual = "manual"
}
export declare enum XYShowMode {
    Lines = "lines",
    Points = "points",
    PointsAndLines = "points+lines"
}
/**
 * NOTE: (copied from dashboard_kind.cue, since not exported)
 * Matcher is a predicate configuration. Based on the config a set of field(s) or values is filtered in order to apply override / transformation.
 * It comes with in id ( to resolve implementation from registry) and a configuration that’s specific to a particular matcher type.
 */
export interface MatcherConfig {
    /**
     * The matcher id. This is used to find the matcher implementation from registry.
     */
    id: string;
    /**
     * The matcher options. This is specific to the matcher implementation.
     */
    options?: unknown;
}
export declare const defaultMatcherConfig: Partial<MatcherConfig>;
export interface FieldConfig extends common.HideableFieldConfig, common.AxisConfig {
    lineStyle?: common.LineStyle;
    /**
     * lineColor?: common.ColorDimensionConfig
     */
    lineWidth?: number;
    pointSize?: {
        fixed?: number;
        min?: number;
        max?: number;
    };
    show?: XYShowMode;
}
export declare const defaultFieldConfig: Partial<FieldConfig>;
export interface XYSeriesConfig {
    color?: {
        matcher: MatcherConfig;
    };
    frame?: {
        matcher: MatcherConfig;
    };
    name?: {
        fixed?: string;
    };
    size?: {
        matcher: MatcherConfig;
    };
    x?: {
        matcher: MatcherConfig;
    };
    y?: {
        matcher: MatcherConfig;
    };
}
export interface Options extends common.OptionsWithLegend, common.OptionsWithTooltip {
    mapping: SeriesMapping;
    series: Array<XYSeriesConfig>;
}
export declare const defaultOptions: Partial<Options>;
