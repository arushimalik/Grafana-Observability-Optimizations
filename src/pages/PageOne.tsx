import React, { useState, useEffect } from 'react';
import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { useStyles2, Select, Button } from '@grafana/ui';
import { testIds } from '../components/testIds';
import { PluginPage, getBackendSrv } from '@grafana/runtime';

import { getServiceMetrics, printTree } from 'getServiceMetrics';
import { Option, DashboardResponse, MetricComparison, suffixSet } from '../constants';
import { fetchAvailableServices } from "../utils/page_utils";

import { VscChevronDown, VscChevronRight, VscIndent } from "react-icons/vsc";

function PageOne() {
  const styles = useStyles2(getStyles);

  // State for selected options and available options
  const [selectedService, setSelectedService] = useState<Option | null>(null);
  const [selectedDashboard, setSelectedDashboard] = useState<Option | null>(null);
  const [availableServices, setAvailableServices] = useState<Option[]>([]);
  const [availableDashboards, setAvailableDashboards] = useState<Option[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingDashboards, setLoadingDashboards] = useState(false);
  const [serviceError,] = useState<string | null>(null);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [metricComparison, setMetricComparison] = useState<MetricComparison | null>(null);
  // New state for tracking expanded nodes
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadServices = async () => {
      setLoadingServices(true);
      const services = await fetchAvailableServices();
      console.log("Setting available services:", services);
      setAvailableServices(services);
      setLoadingServices(false);
    };
  
    loadServices();
    fetchAvailableDashboards(); // unique to pageOne
  }, [selectedService]);

  const fetchAvailableDashboards = async () => {
    setLoadingDashboards(true);
    setDashboardError(null);
    try {
      const dashboards: DashboardResponse[] = await getBackendSrv().get('/api/search');
      const formattedDashboards = dashboards.map((dash) => ({
        label: dash.title,
        value: dash.uid,
      }));
      setAvailableDashboards(formattedDashboards);
    } catch (error) {
      console.error('Error fetching dashboards:', error);
      setDashboardError('Failed to load dashboards');
    } finally {
      setLoadingDashboards(false);
    }
  };

  async function getUsedMetrics() {
    if (!selectedService || !selectedDashboard ) {
      console.error("Required selections or formatted metrics are missing.");
      return;
    }
    // Fetch the selected dashboard data to get metrics
    const dashboard = await getBackendSrv().get(`/api/dashboards/uid/${selectedDashboard.value}`);
    const dashboardPanels = dashboard.dashboard.panels || [];

    let usedMetricsSet: Set<string> = new Set();

    dashboardPanels.forEach((panel: any) => {
      if (panel.targets && Array.isArray(panel.targets)) {
        panel.targets.forEach((target: any) => {
          if (target.target) {
            let targetMetric = target.target;
    
            // Regular expression to match any function at the start, followed by a metric name
            const functionRegex = /^[a-zA-Z0-9_]+\((.*?)\)$/;
    
            // If the target metric starts with a function, remove it and retain the metric name
            const match = targetMetric.match(functionRegex);
            if (match) {
              // Extract the part inside the parentheses (the actual metric name)
              targetMetric = match[1];
            }
    
            // Use regex to check if the target metric belongs to the selected service
            const serviceRegex = new RegExp(`(^|[^a-zA-Z0-9_])${selectedService.value}([^a-zA-Z0-9_]|$)`);
            if (serviceRegex.test(targetMetric)) {
              usedMetricsSet.add(targetMetric);  // Add the metric without the function wrapper
            }
          }
        });
      }
    });
    
    // Compare available metrics with the used metrics
    let usedMetricsArray = Array.from(usedMetricsSet);
    usedMetricsArray = removeRedundantSuffixes(usedMetricsArray);

    console.log(`used Metrics Array ${usedMetricsArray}`);
    return usedMetricsArray;
  }

  async function compareMetrics(formattedMetrics: string[], metricTree: Record<string, any>): Promise<void> {
    if (!selectedService || !selectedDashboard || !formattedMetrics) {
      console.error("Required selections or formatted metrics are missing.");
      return;
    }
  
    try {
      // Fetch available metrics
      const availableMetrics = formattedMetrics;
      console.log("Available Metrics:", availableMetrics);
  
      // Fetch used metrics
      let usedMetrics = await getUsedMetrics();
      if (!usedMetrics) {
        usedMetrics = [];
      }

      console.log(`Used Metrics ${usedMetrics}`);

      let unusedMetrics:string[] = new Array();

      
      // Helper function to check if a metric matches any of the used metrics (with wildcard support)
      const matchesUsedMetric = (metric: string, usedMetrics: string[]): boolean => {
        return usedMetrics.some((usedMetric) => {
          try {
            const regexPattern = `^${usedMetric.replace(/\./g, '\\.').replace(/\*/g, '.*')}$`;
            const regex = new RegExp(regexPattern);
            console.log(`Tested regex pattern ${regexPattern} on ${metric}, ${regex.test(metric)}`);
            return regex.test(metric);
          } catch (error) {
            console.error("Invalid regex in used metric:", usedMetric, error);
            return false;
          }
        });
      };

      // Recursive function to traverse the metric tree
      const traverseTree = (node: Record<string, any>, currentPath: string) => {
        for (const key in node) {
          const newPath = currentPath ? `${currentPath}.${key}` : key;

          if (node[key] === null) {
            // It's a leaf node
            if (!matchesUsedMetric(newPath, usedMetrics)) {
              unusedMetrics.push(newPath);
            }
          } else {
            // It's a branch; recurse into it
            traverseTree(node[key], newPath);
          }
        }
      };

      // Start traversing from the root of the metric tree
      traverseTree(metricTree, selectedService.value);

      console.log("Unused Metrics:", unusedMetrics);
  
      // Set the comparison result
      setMetricComparison({
        usedMetrics: usedMetrics,
        unusedMetrics: unusedMetrics,
      });
    } catch (error) {
      console.error("Error comparing metrics:", error);
    }
  };


  // Trigger comparison when both service and dashboard are selected
  useEffect(() => {
    const fetchAndCompareMetrics = async () => {
      if (selectedService && selectedDashboard) {
        try {
          const result = await getServiceMetrics(selectedService.label); // Fetch formatted metrics
          const formattedMetrics = result.flatList;

          const treeMetrics:Record<string, any> = result.tree
          printTree(treeMetrics);

          await compareMetrics(formattedMetrics, treeMetrics); // Compare metrics

        } catch (error) {
          console.error('Error in fetching or comparing metrics:', error);
        }
      }
    };
    fetchAndCompareMetrics();
  }, [selectedService, selectedDashboard]);

  const removeRedundantSuffixes = (metrics: string[]): string[] => {
    // removes redundant suffixes from metric names
    const groupedMetrics = new Set<string>();

    metrics.forEach((label) => {
      for (let suffix of suffixSet) {
        if (label.endsWith(suffix)) {
          const prefix = label.slice(0, label.length - suffix.length);
          if (!groupedMetrics.has(prefix)) {
            groupedMetrics.add(prefix);
          }
          break; // Only match one suffix
        }
      }
    });

    // Build new Option objects with formatted labels
    const formattedMetrics: string[] = [];
    groupedMetrics.forEach((prefix) => {
      formattedMetrics.push(prefix);
    });
    return formattedMetrics;
  };
  
  // take in a flat list of metrics and format them as a tree structure
  const formatAsTree = (metrics: string[]): Record<string, any> => {
    const tree: Record<string, any> = {};
  
    metrics.forEach((metric) => {
      const parts = metric.split('.');
      let currentLevel = tree;
  
      parts.forEach((part, index) => {
        if (!currentLevel[part]) {
          currentLevel[part] = index === parts.length - 1 ? null : {};
        }
        currentLevel = currentLevel[part];
      });
    });
  
    return tree;
  };
  
  // Functions for expand/collapse functionality
  const toggleExpand = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      newSet.has(nodeId) ? newSet.delete(nodeId) : newSet.add(nodeId);
      return newSet;
    });
  };

  // Helper functions to get all node paths across both trees
  const getAllNodePaths = () => {
    if (!metricComparison) return [];
    
    const usedMetricsTree = formatAsTree(metricComparison.usedMetrics);
    const unusedMetricsTree = formatAsTree(metricComparison.unusedMetrics);
    
    return [
      ...getNodePaths(usedMetricsTree),
      ...getNodePaths(unusedMetricsTree)
    ];
  };
  
  const getNodePaths = (node: Record<string, any>, currentPath: string = ''): string[] => {
    let allPaths: string[] = [];
    
    for (const key in node) {
      const newPath = currentPath ? `${currentPath}.${key}` : key;
      
      if (node[key] !== null && typeof node[key] === 'object') {
        // This is a branch node, add it to paths and continue traversing
        allPaths.push(newPath);
        allPaths = [...allPaths, ...getNodePaths(node[key], newPath)];
      }
    }
    
    return allPaths;
  };

  // Single expand/collapse function that affects both trees
  const toggleAllNodes = () => {
    const allPaths = getAllNodePaths();
    const allExpanded = areAllNodesExpanded();
    
    if (allExpanded) {
      // Collapse all
      setExpandedNodes(new Set());
    } else {
      // Expand all
      setExpandedNodes(new Set(allPaths));
    }
  };

  // Check if all nodes are expanded
  const areAllNodesExpanded = () => {
    const allPaths = getAllNodePaths();
    return allPaths.length > 0 && allPaths.every(path => expandedNodes.has(path));
  };

  // Tree node component
  const TreeNode = ({ 
    nodePath,
    label, 
    children,
    isExpanded,
    onToggle
  }: { 
    nodePath: string;
    label: string; 
    children?: React.ReactNode;
    isExpanded: boolean;
    onToggle: (nodePath: string) => void;
  }) => {
    return (
      <div className={styles.treeNode}>
        <div className={styles.nodeHeader} onClick={() => children && onToggle(nodePath)}>
          {children ? (
            <span className={styles.expandIcon}>
              {isExpanded ? <VscChevronDown /> : <VscChevronRight />}
            </span>
          ) : (
            <span className={styles.indentIcon}><VscIndent /></span>
          )}
          <span>{label}</span>
        </div>
        {isExpanded && children && <div className={styles.childNodes}>{children}</div>}
      </div>
    );
  };

  // Tree component
  const Tree = ({ data, basePath = '' }: { data: Record<string, any>; basePath?: string }) => {
    const renderTree = (node: Record<string, any>, currentPath: string = basePath): React.ReactNode => {
      return Object.keys(node).map((key) => {
        const nodePath = currentPath ? `${currentPath}.${key}` : key;
        const isExpanded = expandedNodes.has(nodePath);
        
        return (
          <TreeNode 
            key={nodePath} 
            label={key} 
            nodePath={nodePath}
            isExpanded={isExpanded}
            onToggle={toggleExpand}
          >
            {node[key] !== null && typeof node[key] === 'object' 
              ? renderTree(node[key], nodePath) 
              : null}
          </TreeNode>
        );
      });
    };
  
    return <div>{renderTree(data)}</div>;
  };

  return (
    <PluginPage>
      <div data-testid={testIds.pageOne.container}>
        <div className={styles.marginTop}>
          <Select
            options={availableServices}
            value={selectedService}
            onChange={setSelectedService}
            placeholder="Select Service"
            isLoading={loadingServices}
          />
          {serviceError && <div className={styles.error}>{serviceError}</div>}
        </div>

        <div className={styles.marginTop}>
          <Select
            options={availableDashboards}
            value={selectedDashboard}
            onChange={setSelectedDashboard}
            placeholder="Select Dashboard"
            isLoading={loadingDashboards}
          />
          {dashboardError && <div className={styles.error}>{dashboardError}</div>}
        </div>

        {metricComparison && (
          <div className={styles.metricComparison}>
            {/* Single expand/collapse button for both trees */}
            <div className={styles.expandCollapseContainer}>
              <Button
                size="sm"
                variant="secondary"
                onClick={toggleAllNodes}
                className={styles.expandCollapseButton}
              >
                {areAllNodesExpanded() ? "Collapse All" : "Expand All"}
              </Button>
            </div>
            
            <div className={`${styles.metricsColumns} ${styles.responsive}`}>
              <div className={styles.metricsColumn}>
                <h4><strong>Used Metrics:</strong></h4>
                <p>{metricComparison.usedMetrics.length} metrics</p>
                <div>
                  {metricComparison.usedMetrics && metricComparison.usedMetrics.length > 0 ? (
                    <Tree data={formatAsTree(metricComparison.usedMetrics)} />
                  ) : (
                    <p>No used metrics.</p>
                  )}
                </div>
              </div>
              <div className={styles.metricsColumn}>
                <h4><strong>Unused Metrics:</strong></h4>
                <p>{metricComparison.unusedMetrics.length} metrics</p>
                <div>
                  {metricComparison.unusedMetrics && metricComparison.unusedMetrics.length > 0 ? (
                    <Tree data={formatAsTree(metricComparison.unusedMetrics)} />
                  ) : (
                    <p>No unused metrics.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PluginPage>
  );
}

export default PageOne;

// Styles - updated to include the tree-related styles
const getStyles = (theme: GrafanaTheme2) => ({
  marginTop: css`
    margin-top: ${theme.spacing(2)};
  `,
  error: css`
    color: ${theme.colors.error.text};
    margin-top: ${theme.spacing(1)};
  `,
  metricComparison: css`
    margin-top: ${theme.spacing(1)};
  `,
  metricsColumns: css`
    display: flex;
    gap: ${theme.spacing(4)};
    align-items: flex-start;
    justify-content: space-between;
  `,
  metricsColumn: css`
    margin-top: ${theme.spacing(1)};
    flex: 1;
    min-width: 200px;
  `,
  responsive: css`
    @media (max-width: 768px) {
      flex-direction: column;
    }
  `,
  // Tree-related styles
  treeNode: css`
    margin-left: ${theme.spacing(1)};
  `,
  nodeHeader: css`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: ${theme.spacing(0.5)} 0;
  `,
  expandIcon: css`
    margin-right: ${theme.spacing(1)};
    display: flex;
  `,
  indentIcon: css`
    margin-right: ${theme.spacing(1)};
    display: flex;
    opacity: 0.5;
  `,
  childNodes: css`
    margin-left: ${theme.spacing(2)};
  `,
  expandCollapseContainer: css`
    margin-bottom: ${theme.spacing(1)};
  `,
  expandCollapseButton: css`
    margin-top: 15px;
    margin-left: 0;
  `,
});