import React, { useState, useEffect } from 'react';
import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { LinkButton, useStyles2, Select } from '@grafana/ui';
import { prefixRoute } from '../utils/utils.routing';
import { testIds } from '../components/testIds';
import { PluginPage, getBackendSrv } from '@grafana/runtime';
import { getServiceMetrics, printTree } from 'getServiceMetrics';
import { ROUTES, Option, ServiceResponse, DashboardResponse, MetricComparison, suffixSet } from '../constants';

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
  const [serviceError, setServiceError] = useState<string | null>(null);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [metricComparison, setMetricComparison] = useState<MetricComparison | null>(null);

  useEffect(() => {
    fetchAvailableServices();
    fetchAvailableDashboards();
  }, []);
  

  const fetchAvailableServices = async () => {
    setLoadingServices(true);
    setServiceError(null);
    try {
      const response = await fetch('http://localhost:9080/metrics/find?query=*'); // TODO: THIS SHOULD NOT BE HARDCODED. FIX THIS.
      const services: ServiceResponse[] = await response.json();
      const formattedServices = services.map((service) => ({
        label: service.text,
        value: service.text,
      }));
      setAvailableServices(formattedServices);
    } catch (error) {
      console.error('Error fetching services from Graphite:', error);
      setServiceError('Failed to load services');
    } finally {
      setLoadingServices(false);
    }
  };

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
  

  // Tree Node Component in React (for rendering expandable lists)
  const TreeNode = ({ label, children }: { label: string; children?: React.ReactNode }) => {
    const [isExpanded, setIsExpanded] = useState(false);
  
    const toggleExpansion = () => {
      setIsExpanded(!isExpanded);
    };
  
    return (
      <div style={{ marginLeft: '20px' }}>
        <div
          onClick={toggleExpansion}
          style={{ cursor: 'pointer', fontWeight: children ? 'bold' : 'normal' }}
        >
          {children ? (isExpanded ? <VscChevronDown /> : <VscChevronRight />) : <VscIndent />} {label}
        </div>
        {isExpanded && children && <div>{children}</div>}
      </div>
    );
  };
  const Tree = ({ data }: { data: Record<string, any> }) => {
    const renderTree = (node: Record<string, any>): React.ReactNode => {
      return Object.keys(node).map((key) => (
        <TreeNode key={key} label={key}>
          {node[key] !== null && typeof node[key] === 'object' ? renderTree(node[key]) : null}
        </TreeNode>
      ));
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
          <div className={styles.marginTop}>

            {/* <h4>Metric Comparison:</h4> */}
            <div id="one">
              <h4><strong>Used Metrics:</strong></h4>
              <p>{metricComparison.usedMetrics.length} metrics</p>
              <ul>
                {metricComparison.usedMetrics && metricComparison.usedMetrics.length > 0 ? (
                  <Tree data={formatAsTree(metricComparison.usedMetrics)} />
                ) : (
                  <p>No used metrics.</p>
                )}
              </ul>
            </div>
            <div id="halfpage">
              <h4><strong>Unused Metrics:</strong></h4>
              <p>{metricComparison.unusedMetrics.length} metrics</p>
              <ul>
                {metricComparison.unusedMetrics && metricComparison.unusedMetrics.length > 0 ? (
                  <Tree data={formatAsTree(metricComparison.unusedMetrics)} />
                ) : (
                  <p>No unused metrics.</p>
                )}
              </ul>
            </div>
          </div>
        )}

        <div className={styles.marginTop}>
          <LinkButton data-testid={testIds.pageOne.navigateToFour} href={prefixRoute(ROUTES.Four)}>
            Full-width page example
          </LinkButton>
        </div>
      </div>
    </PluginPage>
  );
}

export default PageOne;

// Styles
const getStyles = (theme: GrafanaTheme2) => ({
  marginTop: css`
    margin-top: ${theme.spacing(2)};
    align="center"
  `,
  error: css`
    color: ${theme.colors.error.text};
    margin-top: ${theme.spacing(1)};
  `,
  one: css`
    display: inline-block;
    width: 400px;
    height:300px;
    border: 2px solid red;
  `
});
