import React, { useState, useEffect } from "react";
import { css } from "@emotion/css";
import { GrafanaTheme2 } from "@grafana/data";
import { useStyles2, Select, Checkbox, Button, Input } from "@grafana/ui";
import { PluginPage, getBackendSrv } from "@grafana/runtime";
import { VscChevronDown, VscChevronRight } from "react-icons/vsc";
import { fetchAvailableServices } from "../utils/page_utils";

function DashboardAssistant() {
  const styles = useStyles2(getStyles);
  const TimeSeriesGraphStyleOptions = [
    { label: "Line", value: "line" },
    { label: "Bar", value: "bars" },
    { label: "Point", value: "points" },
  ]
  type MetricNode = {
    name: string;
    fullPath: string;
    children: MetricNode[];
    isLeaf: boolean;
  };

  const [selectedService, setSelectedService] = useState<{ label: string; value: string } | null>(null);
  const [availableServices, setAvailableServices] = useState<{ label: string; value: string }[]>([]);
  const [metricsTree, setMetricsTree] = useState<MetricNode[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [serviceError, setServiceError] = useState<string | null>(null);
  const [selectedMetrics, setSelectedMetrics] = useState<Set<string>>(new Set());
  const [metricGraphSettings, setMetricGraphSettings] = useState<Record<string, { type: string; group: string }>>({});
  const [creatingDashboard, setCreatingDashboard] = useState(false);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [graphiteDatasourceUid, setGraphiteDatasourceUid] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedForBulkEdit, setSelectedForBulkEdit] = useState<Set<string>>(new Set());


  useEffect(() => {
    const loadServices = async () => {
      setLoadingServices(true);
      const services = await fetchAvailableServices();
      setAvailableServices(services);
      setLoadingServices(false);
    };

    loadServices();
    fetchGraphiteDatasourceUid();
  }, []);

  const fetchGraphiteDatasourceUid = async () => {
    try {
      const datasources = await getBackendSrv().get("/api/datasources");
      const graphiteDatasource = datasources.find((ds: any) => ds.type === "graphite");
      if (graphiteDatasource) {
        setGraphiteDatasourceUid(graphiteDatasource.uid);
      } else {
        setDashboardError("Graphite datasource not found");
      }
    } catch (error) {
      setDashboardError("Failed to fetch datasource UID");
    }
  };

  useEffect(() => {
    if (selectedService) {
      getServiceMetrics();
    }
  }, [selectedService]);

  const getServiceMetrics = async () => {
    if (!selectedService) return;

    setServiceError(null);
    try {
      const response = await fetch(`http://localhost:9080/metrics/find?query=${selectedService.value}.*`);
      const services = await response.json();

      const buildTree = async (service: any): Promise<MetricNode> => {
        const node: MetricNode = {
          name: service.text,
          fullPath: service.id,
          children: [],
          isLeaf: service.leaf || false,
        };

        if (!service.leaf) {
          const childResponse = await fetch(`http://localhost:9080/metrics/find?query=${service.id}.*`);
          const children = await childResponse.json();
          node.children = await Promise.all(children.map(buildTree));
        }
        return node;
      };

      const tree = await Promise.all(services.map(buildTree));
      setMetricsTree(tree);
    } catch (error) {
      setServiceError("Failed to load metrics");
    }
  };

  const getAllLeafKeys = (node: MetricNode): string[] => {
    if (node.isLeaf) return [node.fullPath];
    return node.children.flatMap(getAllLeafKeys);
  };

  const getNodeSelectionStatus = (node: MetricNode): "none" | "partial" | "full" => {
    if (node.isLeaf) return selectedMetrics.has(node.fullPath) ? "full" : "none";
    const leaves = getAllLeafKeys(node);
    const selectedCount = leaves.filter((leaf) => selectedMetrics.has(leaf)).length;
    return selectedCount === 0 ? "none" : selectedCount === leaves.length ? "full" : "partial";
  };

  const toggleNodeSelection = (node: MetricNode) => {
    setSelectedMetrics((prev) => {
      const newSelection = new Set(prev);
      const leaves = getAllLeafKeys(node);
      const anySelected = leaves.some((leaf) => newSelection.has(leaf));
      leaves.forEach((leaf) => (anySelected ? newSelection.delete(leaf) : newSelection.add(leaf)));
      return newSelection;
    });
  };

  const toggleExpand = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      newSet.has(nodeId) ? newSet.delete(nodeId) : newSet.add(nodeId);
      return newSet;
    });
  };

  const renderTree = (nodes: MetricNode[]) =>
    nodes.map((node) => (
      <div key={node.fullPath} className={styles.treeNode}>
        <div className={styles.nodeHeader}>
          {node.children.length > 0 && (
            <span onClick={() => toggleExpand(node.fullPath)} className={styles.expandIcon}>
              {expandedNodes.has(node.fullPath) ? <VscChevronDown /> : <VscChevronRight />}
            </span>
          )}
          <Checkbox
            label={node.name}
            checked={getNodeSelectionStatus(node) === "full"}
            indeterminate={getNodeSelectionStatus(node) === "partial"}
            onChange={() => toggleNodeSelection(node)}
          />
        </div>
        {node.children.length > 0 && expandedNodes.has(node.fullPath) && <div className={styles.childNodes}>{renderTree(node.children)}</div>}
      </div>
    ));

  const createDashboard = async () => {
    if (selectedMetrics.size === 0 || !graphiteDatasourceUid) {
      setDashboardError("Please select at least one metric and ensure the datasource is available.");
      return;
    }

    setCreatingDashboard(true);
    setDashboardError(null);

    const selectedMetricsArray = [...selectedMetrics];
    const groupedMetrics: Record<string, string[]> = {};
    selectedMetricsArray.forEach((metric) => {
      const group = metricGraphSettings[metric]?.group || metric;
      groupedMetrics[group] = groupedMetrics[group] || [];
      groupedMetrics[group].push(metric);
    });

    const panels = Object.entries(groupedMetrics).map(([group, metrics], index) => ({
      title: group,
      type: "timeseries",
      datasource: { type: "graphite", uid: graphiteDatasourceUid },
      targets: metrics.map((metric) => ({ target: metric, refId: `A${index}${metric}` })),
      id: index + 1,
      gridPos: { h: 8, w: 12, x: (index % 2) * 12, y: Math.floor(index / 2) * 8 },
      fieldConfig: {
        defaults: { custom: { drawStyle: metricGraphSettings[metrics[0]]?.type || "line" } },
      },
    }));

    const newDashboard = { dashboard: { title: `${selectedService?.label} Metrics Dashboard`, panels }, folderId: 0, overwrite: false };

    try {
      await getBackendSrv().post("/api/dashboards/db", newDashboard);
      alert(`Dashboard "${newDashboard.dashboard.title}" created successfully!`);
    } catch {
      setDashboardError("Failed to create dashboard");
    } finally {
      setCreatingDashboard(false);
    }
  };

  return (
    <PluginPage>
      <div>
        <h3>Select metrics below to add them to your new dashboard.</h3>

        {/* Service Selection */}
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

        {/* Metrics Tree */}
        {metricsTree.length > 0 && (
          <div className={styles.marginTop}>
            <h4>Select Metrics to Include in Dashboard:</h4>
            <div>{renderTree(metricsTree)}</div>
          </div>
        )}

        {/* Selected Metrics Section */}
        {selectedForBulkEdit.size > 0 && (
        <div className={styles.bulkActions}>
          {/* Bulk Change Chart Style */}
          <h4>Change Selected Metrics</h4>
          <Select
            options={TimeSeriesGraphStyleOptions}
            placeholder="Change Chart Style"
            onChange={(selected) => {
              setMetricGraphSettings((prev) => {
                const updatedSettings = { ...prev };
                selectedForBulkEdit.forEach((metric) => {
                  updatedSettings[metric] = { ...updatedSettings[metric], type: selected.value??"" };
                });
                return updatedSettings;
              });
            }}
          />

          {/* Bulk Grouping Input */}
          <Input
            placeholder="Enter Group ID"
            onBlur={(event) => {
              const groupValue = event.target.value.trim(); // Ensure trimmed input
              setMetricGraphSettings((prev) => {
                const updatedSettings = { ...prev };
                selectedForBulkEdit.forEach((metric) => {
                  updatedSettings[metric] = {
                    ...updatedSettings[metric],
                    group: groupValue, // Always assign a string, even if empty
                  };
                });
                return updatedSettings;
              });
            }}
          />


          {/* Clear Selection Button */}
          <Button
            variant="secondary"
            onClick={() => setSelectedForBulkEdit(new Set())}
          >
            Clear Selection
          </Button>
        </div>
      )}

        {selectedMetrics.size > 0 && (
          <div className={styles.selectedMetricsContainer}>
            <h4>Configure Selected Metrics:</h4>
            {Array.from(selectedMetrics).map((metric) => (
              <div key={metric} className={styles.metricRow}>
                <span className={styles.metricName}>{metric}</span>

                {/* Graph Type Selection */}
                <Select
                  options={TimeSeriesGraphStyleOptions}
                  value={metricGraphSettings[metric]?.type || "line"}
                  onChange={(selected) =>
                    setMetricGraphSettings((prev:string) => ({
                      ...prev,
                      [metric]: { ...prev[metric], type: selected.value??"" },
                    }))
                  }
                />

                {/* Grouping Input */}
                <Input
                  placeholder="Group ID (optional)"
                  value={metricGraphSettings[metric]?.group || ""}
                  onChange={(event) =>
                    setMetricGraphSettings((prev) => ({
                      ...prev,
                      [metric]: { ...prev[metric], group: event.target.value || null },
                    }))
                  }
                />
                <p>Select</p>
                <Checkbox
                  checked={selectedForBulkEdit.has(metric)}
                  onChange={() => {
                    setSelectedForBulkEdit((prev) => {
                      const newSelection = new Set(prev);
                      newSelection.has(metric) ? newSelection.delete(metric) : newSelection.add(metric);
                      return newSelection;
                    });
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Dashboard Creation */}
        <div className={styles.marginTop}>
          <Button onClick={createDashboard} disabled={creatingDashboard}>
            {creatingDashboard ? "Creating Dashboard..." : "Create Dashboard"}
          </Button>
          {dashboardError && <div className={styles.error}>{dashboardError}</div>}
        </div>
      </div>
    </PluginPage>
  );
}

export default DashboardAssistant;

const getStyles = (theme: GrafanaTheme2) => ({
  marginTop: css`
    margin-top: ${theme.spacing(2)};
  `,
  error: css`
    color: ${theme.colors.error.text};
    margin-top: ${theme.spacing(1)};
  `,
  treeNode: css`
    margin-left: ${theme.spacing(3)};
  `,
  nodeHeader: css`
    display: flex;
    align-items: center;
  `,
  expandIcon: css`
    cursor: pointer;
    margin-right: ${theme.spacing(1)};
  `,
  childNodes: css`
    margin-left: ${theme.spacing(3)};
  `,
  selectedMetricsContainer: css`
    margin-top: ${theme.spacing(3)};
    padding: ${theme.spacing(2)};
    border: 1px solid ${theme.colors.border.weak};
    border-radius: ${theme.shape.borderRadius()};
    background-color: ${theme.colors.background.secondary};
  `,
  metricRow: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${theme.spacing(1)} 0;
  `,
  metricName: css`
    flex-grow: 1;
    margin-right: ${theme.spacing(2)};
  `,
  bulkActions: css`
    margin-top: ${theme.spacing(3)};
    padding: ${theme.spacing(2)};
    border: 1px solid ${theme.colors.border.weak};
    border-radius: ${theme.shape.borderRadius()};
    background-color: ${theme.colors.background.secondary};
  `,
});
