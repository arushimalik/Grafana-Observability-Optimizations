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


export const suffixSet: Set<string> = new Set([
  'count_ps',
  '75-percentile',
  'lower',
  'mean',
  '95-percentile',
  '50-percentile',
  '99-percentile',
  '999-percentile',
  'count',
  'fifteen-minute',
  'five-minute',
  'max',
  'mean',
  'mean-rate',
  'min',
  'one-minute',  
  'std-dev',
  'avgUpdateTime',
  'blacklistMatches',
  'committedPoints',
  'cpuUsage',
  'creates',
  'droppedCreates',
  'errors',
  'memUsage',
  'metricsReceived',
  'pointsPerUpdate',
  'updateOperations',
  'whitelistRejects',
  'cache.bulk_queries',
  'cache.overflow',
  'cache.queries',
  'cache.queues',
  'cache.size',
  'activeConnections'
]);