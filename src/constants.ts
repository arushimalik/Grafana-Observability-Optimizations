import pluginJson from './plugin.json';

export const PLUGIN_BASE_URL = `/a/${pluginJson.id}`;

export enum ROUTES {
  One = 'one',
  Two = 'two',
  Three = 'three',
  Four = 'four',
  Unused = 'unused'
}

export type Option = {
  label: string;
  value: string;
};
export type ServiceResponse = {
  text: string;
  [key: string]: any;
};
export type DashboardResponse = {
  title: string;
  uid: string;
  [key: string]: any;
};
export type MetricComparison = {
  usedMetrics: string[];
  unusedMetrics: string[];
};
export type MetricNode = {
  name: string;
  fullPath: string;
  children: MetricNode[];
  isLeaf: boolean;
};