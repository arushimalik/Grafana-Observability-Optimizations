import React, { useState, useEffect } from 'react';
import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { LinkButton, useStyles2, Select } from '@grafana/ui';
import { prefixRoute } from '../utils/utils.routing';
import { testIds } from '../components/testIds';
import { PluginPage, getBackendSrv } from '@grafana/runtime';
import { getServiceMetrics } from 'getServiceMetrics';
import { ROUTES, Option, ServiceResponse, DashboardResponse, MetricComparison, suffixSet } from '../constants';

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
      console.log(`Unused Metrics Array ${usedMetricsArray}`);

      let usedMetricsArrayString = new Array();
      usedMetricsArray = formatMetricsBySuffix(usedMetricsArray);
      usedMetricsArray.forEach((metric) => {usedMetricsArrayString.push(metric.label)});



      let unusedMetrics:Set<string> = new Set();
      availableMetrics.forEach((availableMetric) => {
        if (usedMetricsArrayString.map(metric => dupeCheck(metric, availableMetric))) { // availableMetric is not in usedMetricsArray
          unusedMetrics.add(availableMetric)
          console.log(`${availableMetric} is unused`);
        }
      })

      

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

  const dupeCheck = (metric1: String, metric2: String): boolean => {
    // will return true if metric1 and metric2 match (metric1 is a duplicate)
    
    // let verify:boolean = false;
    // check if the string literals match
    if (metric1 === metric2) {
      return true;
    }

    // check if they are regular expressions and match
    try {
      // Compile metric1 as a regex to match against metric2
      const regex1 = new RegExp(`^${metric1}$`);
      const regex2 = new RegExp(`^${metric2}$`);

      // Use match to compare both directions
      console.log(`regular expression matching result ${metric2.match(regex1) !== null && metric1.match(regex2) !== null}`);
      return metric2.match(regex1) !== null && metric1.match(regex2) !== null;
    } catch (error) {
      // If there's an error compiling the regex, they aren't valid regex
      console.log("ERROR with regex metric matching");
      return false;
    }

    // return verify;
  }

  return (
    <PluginPage>
      <div data-testid={testIds.pageOne.container}>
        <h3>This is page one.</h3>

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
  `,
  error: css`
    color: ${theme.colors.error.text};
    margin-top: ${theme.spacing(1)};
  `,
});
