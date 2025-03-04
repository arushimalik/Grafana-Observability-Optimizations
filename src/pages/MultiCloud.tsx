import React, { useState, useEffect } from 'react';
import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { useStyles2, Select, Button } from '@grafana/ui';
import { PluginPage, getBackendSrv } from '@grafana/runtime';

function DashboardSetupPage() {
  const styles = useStyles2(getStyles);

  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedDashboard, setSelectedDashboard] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [availableDashboards, setAvailableDashboards] = useState([]);
  const [availableMetrics, setAvailableMetrics] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboards();
  }, []);

  const fetchDashboards = async () => {
    setLoading(true);
    setError(null);
    try {
      const dashboards = await getBackendSrv().get('/api/search');
      setAvailableDashboards(dashboards.map(d => ({ label: d.title, value: d.uid })));
    } catch (error) {
      setError('Failed to load dashboards');
    } finally {
      setLoading(false);
    }
  };

  const fetchMetricsAndServices = async () => {
    if (!selectedDashboard && !selectedMetric) return;
    setLoading(true);
    try {
      if (selectedDashboard) {
        const dashboard = await getBackendSrv().get(`/api/dashboards/uid/${selectedDashboard.value}`);
        const services = extractServicesFromDashboard(dashboard);
        setAvailableServices(services);
      } else if (selectedMetric) {
        const services = await getServicesForMetric(selectedMetric);
        setAvailableServices(services);
      }
    } catch (error) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PluginPage>
      <div className={styles.container}>
        <h3>Set Up Your Dashboard</h3>
        <Select
          options={[{ label: 'Existing Dashboard', value: 'existing' }, { label: 'New Dashboard', value: 'new' }]}
          value={selectedOption}
          onChange={setSelectedOption}
          placeholder="Choose an option"
        />

        {selectedOption?.value === 'existing' && (
          <Select
            options={availableDashboards}
            value={selectedDashboard}
            onChange={setSelectedDashboard}
            placeholder="Select Dashboard"
            isLoading={loading}
          />
        )}

        {selectedOption?.value === 'new' && (
          <Select
            options={availableMetrics}
            value={selectedMetric}
            onChange={setSelectedMetric}
            placeholder="Select Metric"
            isLoading={loading}
          />
        )}

        {availableServices.length > 0 && (
          <Select
            options={availableServices}
            value={selectedServices}
            onChange={setSelectedServices}
            placeholder="Select Services"
            isMulti
          />
        )}

        <Button onClick={fetchMetricsAndServices} disabled={loading}>Confirm Selection</Button>
        {error && <div className={styles.error}>{error}</div>}
      </div>
    </PluginPage>
  );
}

const getStyles = (theme: GrafanaTheme2) => ({
  container: css`
    margin-top: ${theme.spacing(2)};
  `,
  error: css`
    color: ${theme.colors.error.text};
    margin-top: ${theme.spacing(1)};
  `,
});

export default DashboardSetupPage;
