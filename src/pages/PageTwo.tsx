import React, { useState, useEffect } from "react";
import { css } from "@emotion/css";
import { GrafanaTheme2 } from "@grafana/data";
import { useStyles2, Select, Checkbox, Button } from "@grafana/ui";
import { PluginPage, getBackendSrv } from "@grafana/runtime";
import { VscChevronDown, VscChevronRight } from "react-icons/vsc";
import { fetchAvailableServices } from "../utils/page_utils";

function DashboardAssistant() {
  const styles = useStyles2(getStyles);

  type VisualizationType = "timeseries" | "barchart";

  // A tree node representing a metric
  type MetricNode = {
    name: string;
    fullPath: string;
    children: MetricNode[];
    isLeaf: boolean;
  };

  // State variables
  const [selectedService, setSelectedService] = useState<{ label: string; value: string } | null>(null);
  const [availableServices, setAvailableServices] = useState<{ label: string; value: string }[]>([]);
  const [metricsTree, setMetricsTree] = useState<MetricNode[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [serviceError, setServiceError] = useState<string | null>(null);
  const [selectedMetrics, setSelectedMetrics] = useState<Set<string>>(new Set());
  const [selectedVisTypes, setSelectedVisTypes] = useState<Record<string, VisualizationType>>({}); // map from metric (leaf) id to the chosen visualization type
  const [creatingDashboard, setCreatingDashboard] = useState(false);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [graphiteDatasourceUid, setGraphiteDatasourceUid] = useState<string | null>(null);
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
    fetchGraphiteDatasourceUid(); // unique to PageTwo
  }, []);

  // Fetches the Graphite datasource UID from Grafana.
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
      console.error("Error fetching datasources:", error);
      setDashboardError("Failed to fetch datasource UID");
    }
  };

  // When a service is selected, fetch its metrics and build the tree.
  useEffect(() => {
    if (selectedService) {
      getServiceMetrics();
    }
  }, [selectedService]);

  // Recursively builds the tree of metrics.
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
      console.error("Error fetching service metrics:", error);
      setServiceError("Failed to load metrics");
    }
  };

  // Helper: Recursively returns an array of all leaf metric keys for a given node.
  const getAllLeafKeys = (node: MetricNode): string[] => {
    if (node.isLeaf) return [node.fullPath];
    return node.children.flatMap(getAllLeafKeys);
  };

  // Helper: Determines a node's selection status.
  // Returns "none", "partial", or "full"
  const getNodeSelectionStatus = (node: MetricNode): "none" | "partial" | "full" => {
    if (node.isLeaf) return selectedMetrics.has(node.fullPath) ? "full" : "none";
    const leaves = getAllLeafKeys(node);
    const selectedCount = leaves.filter((leaf) => selectedMetrics.has(leaf)).length;
    if (selectedCount === 0) return "none";
    if (selectedCount === leaves.length) return "full";
    return "partial";
  };

  // Toggles selection for both leaves and parent nodes;
  // Also updates the selectedVisTypes mapping: on selection, add a default ("timeseries") and on deselection, remove the mapping.
  const toggleNodeSelection = (node: MetricNode) => {
    const leaves = getAllLeafKeys(node);
    const anySelected = leaves.some((leaf) => selectedMetrics.has(leaf));

    if (anySelected) {
      // Deselect: remove from selectedMetrics and remove their visualization types.
      setSelectedMetrics((prev) => {
        const newSet = new Set(prev);
        leaves.forEach((leaf) => newSet.delete(leaf));
        return newSet;
      });
      setSelectedVisTypes((prev) => {
        const newMapping = { ...prev };
        leaves.forEach((leaf) => {
          delete newMapping[leaf];
        });
        return newMapping;
      });
    } else {
      // Select: add to selectedMetrics and set default visualization type ("timeseries") if not set.
      setSelectedMetrics((prev) => {
        const newSet = new Set(prev);
        leaves.forEach((leaf) => newSet.add(leaf));
        return newSet;
      });
      setSelectedVisTypes((prev) => {
        const newMapping = { ...prev };
        leaves.forEach((leaf) => {
          if (!newMapping[leaf]) {
            newMapping[leaf] = "timeseries";
          }
        });
        return newMapping;
      });
    }
  };

  // Handler: update the visualization type for a given metric.
  const handleVisTypeChange = (metricId: string, visType: VisualizationType) => {
    setSelectedVisTypes((prev) => ({
      ...prev,
      [metricId]: visType,
    }));
  };

  // Options for visualization type selection.
  const visOptions = [
    { label: "Timeseries", value: "timeseries" },
    { label: "Barchart", value: "barchart" },
  ];

  // Renders the metrics tree recursively.
  const renderTree = (nodes: MetricNode[]) => {
    return nodes.map((node) => {
      const isExpanded = expandedNodes.has(node.fullPath);
      const hasChildren = node.children.length > 0;
      const status = getNodeSelectionStatus(node);

      return (
        <div key={node.fullPath} className={styles.treeNode}>
          <div className={styles.nodeHeader}>
            {hasChildren && (
              <span onClick={() => toggleExpand(node.fullPath)} className={styles.expandIcon}>
                {isExpanded ? <VscChevronDown /> : <VscChevronRight />}
              </span>
            )}
            <Checkbox
              label={node.name}
              checked={status === "full"}
              indeterminate={status === "partial"}
              onChange={() => toggleNodeSelection(node)}
            />
            {/* If this is a leaf (ie a metric) and it’s selected, render the visualization type selector */}
            {node.isLeaf && selectedMetrics.has(node.fullPath) && (
              <div className={styles.visSelect}>
                <Select
                  options={visOptions}
                  value={visOptions.find(
                    (opt) => opt.value === (selectedVisTypes[node.fullPath] || "timeseries")
                  )}
                  onChange={(option) =>
                    handleVisTypeChange(node.fullPath, option.value as VisualizationType)
                  }
                  width={150}
                />
              </div>
            )}
          </div>
          {hasChildren && isExpanded && <div className={styles.childNodes}>{renderTree(node.children)}</div>}
        </div>
      );
    });
  };

  // Creates a new dashboard using the selected metrics and visualization types.
  const createDashboard = async () => {
    if (selectedMetrics.size === 0 || !graphiteDatasourceUid) {
      setDashboardError("Please select at least one metric and ensure the datasource is available.");
      return;
    }

    setCreatingDashboard(true);
    setDashboardError(null);

    // Convert the Set to an array.
    const selectedMetricsArray = [...selectedMetrics];

    // Construct panels based on each metric’s chosen visualization type.
    const panels = selectedMetricsArray.map((metric, index) => {
      // Get the visualization type (default to timeseries if not set)
      const visType = selectedVisTypes[metric] || "timeseries";
      const gridPos = { h: 8, w: 12, x: (index % 2) * 12, y: Math.floor(index / 2) * 8 };

      if (visType === "barchart") {
        return {
          title: metric,
          type: "barchart", // assuming "barchart" is a valid panel type
          datasource: {
            type: "graphite",
            uid: graphiteDatasourceUid,
          },
          targets: [{ target: metric, refId: "A" }],
          id: index + 1,
          gridPos,
          options: {
            // barchart-specific options (if needed) can be added here
          },
        };
      } else {
        return {
          title: metric,
          type: "timeseries",
          datasource: {
            type: "graphite",
            uid: graphiteDatasourceUid,
          },
          targets: [{ target: metric, refId: "A" }],
          id: index + 1,
          gridPos,
          fieldConfig: {
            defaults: {
              custom: {
                drawStyle: "line",
                lineInterpolation: "linear",
                showPoints: "auto",
                lineWidth: 1,
                fillOpacity: 0,
                gradientMode: "none",
              },
              color: {
                mode: "palette-classic",
              },
              thresholds: {
                mode: "absolute",
                steps: [
                  { color: "green", value: null },
                  { color: "red", value: 80 },
                ],
              },
            },
            overrides: [],
          },
          options: {
            tooltip: { mode: "single", sort: "none" },
            legend: { showLegend: true, displayMode: "list", placement: "bottom" },
          },
        };
      }
    });

    const newDashboard = {
      dashboard: {
        title: `${selectedService?.label} Metrics Dashboard`,
        panels,
      },
      folderId: 0,
      overwrite: false,
    };

    try {
      const response = await getBackendSrv().post("/api/dashboards/db", newDashboard);
      console.log("Dashboard created:", response);
      alert(`Dashboard "${newDashboard.dashboard.title}" created successfully!`);
    } catch (error) {
      console.error("Error creating dashboard:", error);
      setDashboardError("Failed to create dashboard");
    } finally {
      setCreatingDashboard(false);
    }
  };

  // Toggles the expansion of a node (for showing/hiding its children).
  const toggleExpand = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  return (
    <PluginPage>
      <div>
        <h3>Dashboard Assistant</h3>
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

        {metricsTree.length > 0 && (
          <div className={styles.marginTop}>
            <h4>Select Metrics to Include in Dashboard:</h4>
            <div>{renderTree(metricsTree)}</div>
          </div>
        )}

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
  visSelect: css`
    margin-left: ${theme.spacing(1)};
    width: 150px;
  `,
});
