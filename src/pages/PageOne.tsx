import React, { useState, useEffect } from 'react';
import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import {useStyles2, Select } from '@grafana/ui';
import { testIds } from '../components/testIds';
import { PluginPage, getBackendSrv } from '@grafana/runtime';
import { getServiceMetrics } from 'getServiceMetrics';
import {Option, ServiceResponse, DashboardResponse, MetricComparison, suffixSet } from '../constants';

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


  async function compareMetrics(formattedMetrics: Option[]): Promise<void> {
    if (!selectedService || !selectedDashboard || !formattedMetrics) {
      return;
    }
  
    try {
      // Fetch the metrics for the selected service
      const availableMetrics:Array<string> = formattedMetrics.map((metric: any) => metric.label);

      console.log("availableMetrics (in compareMetrics): ", availableMetrics);
  
      // Fetch the selected dashboard data to get metrics
      const dashboard = await getBackendSrv().get(`/api/dashboards/uid/${selectedDashboard.value}`);
      const dashboardPanels = dashboard.dashboard.panels || [];
  
      let usedMetricsSet: Set<Option> = new Set();

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
                usedMetricsSet.add({label: targetMetric, value: targetMetric});  // Add the metric without the function wrapper
              }
            }
          });
        }
      });
      
      // Compare available metrics with the used metrics
      let usedMetricsArray = Array.from(usedMetricsSet);
      let usedMetricsArrayString = new Array();
      usedMetricsArray = formatMetricsBySuffix(usedMetricsArray);
      usedMetricsArray.forEach((metric) => {usedMetricsArrayString.push(metric.label)});

      let unusedMetrics:Set<string> = new Set();
      availableMetrics.forEach((availableMetric) => {
        if (!usedMetricsArray.some(metric => metric.label === availableMetric)) { // availableMetric is not in usedMetricsArray
          unusedMetrics.add(availableMetric)
        }
      })

      console.log("unusedMetrics:", unusedMetrics)

      const unusedMetricsArray = Array.from(unusedMetrics);

      // Set the comparison result
      setMetricComparison({
        usedMetrics: usedMetricsArrayString,
        unusedMetrics: unusedMetricsArray, // Convert Set to Array
      });
    } catch (error) {
      console.error('Error comparing metrics:', error);
    }
  };


  // Trigger comparison when both service and dashboard are selected
  useEffect(() => {
    const fetchAndCompareMetrics = async () => {
      if (selectedService && selectedDashboard) {
        try {
          const formattedMetrics = await getServiceMetrics(selectedService.value); // Fetch formatted metrics
          const processedMetrics = formatMetricsBySuffix(formattedMetrics); //Process and format the metrics
          await compareMetrics(processedMetrics); // Compare metrics

        } catch (error) {
          console.error('Error in fetching or comparing metrics:', error);
        }
      }
    };
    fetchAndCompareMetrics();
  }, [selectedService, selectedDashboard]);

  const formatMetricsBySuffix = (metrics: Option[]): Option[] => {
    // Initialize map for prefix if not exists
    // maps each metric (minus the suffix) to a frequency map of suffix occurances
    const groupedMetrics = new Set<string>();

    // Step 1: Group metrics by prefix and count suffix occurrences
    metrics.forEach((option) => {
      const label = option.label;
      for (let suffix of suffixSet) {
        if (label.endsWith(suffix)) {
          const prefix = label.slice(0, label.length - suffix.length);

          
          if (!groupedMetrics.has(prefix)) {
            groupedMetrics.add(prefix);
          }

          // const suffixCountMap = groupedMetrics.get(prefix)!;
          // const currentCount = suffixCountMap.get(suffix) || 0;
          // suffixCountMap.set(suffix, currentCount + 1);
          break; // Only match one suffix
        }
      }
    });

    // Step 2: Build new Option objects with formatted labels
    const formattedOptions: Option[] = [];
    groupedMetrics.forEach((prefix) => {
      // let labelWithSuffixes = prefix;
      // suffixCountMap.forEach((count, suffix) => {
      //   labelWithSuffixes += ` ${suffix}(${count})`;
      // });
      formattedOptions.push({ label: prefix , value: prefix});
    });
    return formattedOptions;
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
            <h4>Metric Comparison:</h4>
            <div>
              <strong>Used Metrics:</strong>
              <ul>
                {metricComparison.usedMetrics.map((metric) => (
                  <li key={metric}>{metric}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong>Unused Metrics:</strong>
              <ul>
                {metricComparison.unusedMetrics.map((metric) => (
                  <li key={metric}>{metric}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className={styles.marginTop}>

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
  `,
  error: css`
    color: ${theme.colors.error.text};
    margin-top: ${theme.spacing(1)};
  `,
});
