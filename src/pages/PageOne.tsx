import React, { useState, useEffect } from 'react';
import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { LinkButton, useStyles2, Select } from '@grafana/ui';
import { prefixRoute } from '../utils/utils.routing';
import { ROUTES } from '../constants';
import { testIds } from '../components/testIds';
import { PluginPage, getBackendSrv } from '@grafana/runtime';

type Option = {
  label: string;
  value: string;
};

type ServiceResponse = {
  text: string;
  [key: string]: any;
};

type DashboardResponse = {
  title: string;
  uid: string;
  [key: string]: any;
};

type MetricComparison = {
  usedMetrics: string[];
  unusedMetrics: string[];
};

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

  const compareMetrics = async () => {
    if (!selectedService || !selectedDashboard) {
      return;
    }
  
    try {
      // Fetch the metrics for the selected service
      const serviceMetricsResponse = await fetch(`http://localhost:9080/metrics/find?query=${selectedService.value}.*`);
      const serviceMetrics = await serviceMetricsResponse.json();
      const availableMetrics = serviceMetrics.map((metric: any) => metric.text);
  
      // Fetch the selected dashboard data to get metrics
      const dashboard = await getBackendSrv().get(`/api/dashboards/uid/${selectedDashboard.value}`);
      const dashboardPanels = dashboard.dashboard.panels || [];
  
      let usedMetrics: string[] = [];
      dashboardPanels.forEach((panel: any) => {
        if (panel.targets && Array.isArray(panel.targets)) {
          panel.targets.forEach((target: any) => {
            if (target.target) {
              const targetMetric = target.target;
  
              // Use regex to check if the target metric belongs to the selected service
              const serviceRegex = new RegExp(`(^|[^a-zA-Z0-9_])${selectedService.value}[^a-zA-Z0-9_]`);
              if (serviceRegex.test(targetMetric)) {
                usedMetrics.push(targetMetric);  // Metric used in the dashboard panel
              }
            }
          });
        }
      });
  
      // Compare available metrics with the used metrics
      const unusedMetrics = availableMetrics.filter((metric) => !usedMetrics.includes(metric));
  
      // Set the comparison result
      setMetricComparison({
        usedMetrics,
        unusedMetrics,
      });
  
    } catch (error) {
      console.error('Error comparing metrics:', error);
    }
  };
  

  // Trigger comparison when both service and dashboard are selected
  useEffect(() => {
    if (selectedService && selectedDashboard) {
      compareMetrics();
    }
  }, [selectedService, selectedDashboard]);

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
