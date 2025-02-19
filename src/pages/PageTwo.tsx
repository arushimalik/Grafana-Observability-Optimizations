import React, { useState, useEffect } from "react";
import { css } from "@emotion/css";
import { GrafanaTheme2 } from "@grafana/data";
import { useStyles2, Select, Checkbox, Button } from "@grafana/ui";
import { PluginPage, getBackendSrv } from "@grafana/runtime";
import { VscChevronDown, VscChevronRight } from "react-icons/vsc";
import { fetchAvailableServices } from "../utils/page_utils";

type MetricNode = {
  name: string;
  fullPath: string;
  children: MetricNode[];
  isLeaf: boolean;
};

type GraphType = { label: string; value: string };

const TimeSeriesGraphStyleOptions: GraphType[] = [
  { label: "Line", value: "line" },
  { label: "Bar", value: "bars" },
  { label: "Point", value: "points" },
];

function DashboardAssistant() {
  const styles = useStyles2(getStyles);

<<<<<<< HEAD
  // State definitions
  const [selectedService, setSelectedService] = useState<GraphType | null>(null);
  const [availableServices, setAvailableServices] = useState<GraphType[]>([]);
  const [addedGraphs, setAddedGraphs] = useState<
    { metrics: string[]; graphType: GraphType }[]
  >([]);
  const [selectedGraphType, setSelectedGraphType] = useState<GraphType>({
    label: "Line",
    value: "line",
  });
=======
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
>>>>>>> e725c86bf88fae2356ccb7ad4ff0a741b3e01aaa
  const [metricsTree, setMetricsTree] = useState<MetricNode[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [serviceError, setServiceError] = useState<string | null>(null);
  const [selectedMetrics, setSelectedMetrics] = useState<Set<string>>(new Set());
  const [selectedVisTypes, setSelectedVisTypes] = useState<Record<string, VisualizationType>>({}); // map from metric (leaf) id to the chosen visualization type
  const [creatingDashboard, setCreatingDashboard] = useState(false);
  const [addingGraph, setAddingGraph] = useState(false);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [graphError, setGraphError] = useState<string | null>(null);
  const [graphiteDatasourceUid, setGraphiteDatasourceUid] = useState<string | null>(
    null
  );
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

<<<<<<< HEAD
  // Fetch available services and datasource UID on mount
=======
>>>>>>> e725c86bf88fae2356ccb7ad4ff0a741b3e01aaa
  useEffect(() => {
    const loadServices = async () => {
      setLoadingServices(true);
      const services = await fetchAvailableServices();
<<<<<<< HEAD
=======
      console.log("Setting available services:", services);
>>>>>>> e725c86bf88fae2356ccb7ad4ff0a741b3e01aaa
      setAvailableServices(services);
      setLoadingServices(false);
    };

    loadServices();
<<<<<<< HEAD
    fetchGraphiteDatasourceUid();
  }, []);

=======
    fetchGraphiteDatasourceUid(); // unique to PageTwo
  }, []);

  // Fetches the Graphite datasource UID from Grafana.
>>>>>>> e725c86bf88fae2356ccb7ad4ff0a741b3e01aaa
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

  // Fetch metrics tree when a service is selected
  useEffect(() => {
    if (selectedService) {
      getServiceMetrics();
    }
  }, [selectedService]);

  const getServiceMetrics = async () => {
    if (!selectedService) return;
    setServiceError(null);

    try {
      const response = await fetch(
        `http://localhost:9080/metrics/find?query=${selectedService.value}.*`
      );
      const services = await response.json();

      const buildTree = async (service: any): Promise<MetricNode> => {
        const node: MetricNode = {
          name: service.text,
          fullPath: service.id,
          children: [],
          isLeaf: service.leaf || false,
        };

        if (!service.leaf) {
          const childResponse = await fetch(
            `http://localhost:9080/metrics/find?query=${service.id}.*`
          );
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

  // Helpers for tree rendering
  const getAllLeafKeys = (node: MetricNode): string[] =>
    node.isLeaf ? [node.fullPath] : node.children.flatMap(getAllLeafKeys);

<<<<<<< HEAD
=======
  // Helper: Determines a node's selection status.
  // Returns "none", "partial", or "full"
>>>>>>> e725c86bf88fae2356ccb7ad4ff0a741b3e01aaa
  const getNodeSelectionStatus = (node: MetricNode): "none" | "partial" | "full" => {
    if (node.isLeaf) return selectedMetrics.has(node.fullPath) ? "full" : "none";
    const leaves = getAllLeafKeys(node);
    const selectedCount = leaves.filter((leaf) => selectedMetrics.has(leaf)).length;
    return selectedCount === 0 ? "none" : selectedCount === leaves.length ? "full" : "partial";
  };

<<<<<<< HEAD
  const toggleNodeSelection = (node: MetricNode) => {
    setSelectedMetrics((prev) => {
      const newSelection = new Set(prev);
      const leaves = getAllLeafKeys(node);
      const anySelected = leaves.some((leaf) => newSelection.has(leaf));
      leaves.forEach((leaf) =>
        anySelected ? newSelection.delete(leaf) : newSelection.add(leaf)
      );
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

  const renderTree = (nodes: MetricNode[]): JSX.Element[] =>
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
=======
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
>>>>>>> e725c86bf88fae2356ccb7ad4ff0a741b3e01aaa
        </div>
        {node.children.length > 0 && expandedNodes.has(node.fullPath) && (
          <div className={styles.childNodes}>{renderTree(node.children)}</div>
        )}
      </div>
    ));

<<<<<<< HEAD
  // Graph addition and removal logic
  const addGraph = async () => {
=======
  // Creates a new dashboard using the selected metrics and visualization types.
  const createDashboard = async () => {
>>>>>>> e725c86bf88fae2356ccb7ad4ff0a741b3e01aaa
    if (selectedMetrics.size === 0 || !graphiteDatasourceUid) {
      setDashboardError("Please select at least one metric and ensure the datasource is available.");
      return;
    }

    setAddingGraph(true);
    setGraphError(null);

    try {
      const selectedMetricsArray = [...selectedMetrics];
      setAddedGraphs((prevGraphs) => [
        { metrics: selectedMetricsArray, graphType: selectedGraphType },
        ...prevGraphs,
      ]);
      console.log(addedGraphs);
    } catch {
      setGraphError("Failed to add graph");
    } finally {
      setAddingGraph(false);
    }
  };

  const removeMetricFromGraph = (graphIndex: number, metricToRemove: string) => {
    setAddedGraphs((prevGraphs) =>
      prevGraphs.map((graph, index) =>
        index === graphIndex
          ? { ...graph, metrics: graph.metrics.filter((m) => m !== metricToRemove) }
          : graph
      )
    );
  };

  // Dashboard creation logic
  const createDashboard = async () => {
    if (addedGraphs.length === 0 || !graphiteDatasourceUid) {
      setDashboardError("Please add at least one graph and ensure the datasource is available.");
      return;
    }

    setCreatingDashboard(true);
    setDashboardError(null);

    const panels = addedGraphs.map((graph, index) => ({
      title: `Graph ${index + 1}`,
      type: "timeseries",
      datasource: { type: "graphite", uid: graphiteDatasourceUid },
      targets: graph.metrics.map((metric) => ({
        target: metric,
        refId: `A${index}${metric}`,
      })),
      id: index + 1,
      gridPos: { h: 8, w: 12, x: (index % 2) * 12, y: Math.floor(index / 2) * 8 },
      fieldConfig: {
        defaults: { custom: { drawStyle: graph.graphType.value } },
      },
    }));

<<<<<<< HEAD
=======
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

>>>>>>> e725c86bf88fae2356ccb7ad4ff0a741b3e01aaa
    const newDashboard = {
      dashboard: {
        title: `${selectedService?.label} Metrics Dashboard`,
        panels,
      },
      folderId: 0,
      overwrite: false,
    };

    try {
      await getBackendSrv().post("/api/dashboards/db", newDashboard);
      alert(`Dashboard "${newDashboard.dashboard.title}" created successfully!`);
    } catch (error) {
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

        {/* Graph Type Selection */}
        <div className={styles.marginTop}>
          <h4>Select Graph Type:</h4>
          <Select
            options={TimeSeriesGraphStyleOptions}
            value={selectedGraphType}
            onChange={setSelectedGraphType}
            placeholder="Select Graph Type"
          />
          {serviceError && <div className={styles.error}>{serviceError}</div>}
        </div>

        {/* Graph Creation Button */}
        <div className={styles.marginTop}>
          <Button onClick={addGraph} disabled={addingGraph}>
            {addingGraph ? "Creating Graph..." : "Add Graph"}
          </Button>
          {graphError && <div className={styles.error}>{graphError}</div>}
        </div>
      </div>

      {/* Display Graphs Setup */}
      <div className={styles.marginTop}>
        {addedGraphs.length > 0 && (
          <div>
            {addedGraphs.map((graph, graphIndex) => (
              <div key={graphIndex} className={styles.graphDetail}>
                <h5>
                  Graph {graphIndex + 1}: Type {graph.graphType.label}
                </h5>
                <div className={styles.metricsContainer}>
                  {graph.metrics.map((metric, metricIndex) => (
                    <div key={metricIndex} className={styles.metricBox}>
                      <span>{metric}</span>
                      <button
                        className={styles.removeMetricButton}
                        onClick={() => removeMetricFromGraph(graphIndex, metric)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {/* Dashboard Creation Button */}
            <div className={styles.marginTop}>
              <Button onClick={createDashboard} disabled={creatingDashboard}>
                {creatingDashboard ? "Creating Dashboard..." : "Create Dashboard"}
              </Button>
              {dashboardError && <div className={styles.error}>{dashboardError}</div>}
            </div>
          </div>
        )}
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
<<<<<<< HEAD
  createdGraphsContainer: css`
    margin-top: ${theme.spacing(3)};
  `,
  graphDetail: css`
    margin-bottom: ${theme.spacing(2)};
    padding: ${theme.spacing(2)};
    border: 1px solid ${theme.colors.border.weak};
    border-radius: ${theme.shape.borderRadius()};
    background-color: ${theme.colors.background.secondary};
  `,
  metricsContainer: css`
    display: flex;
    flex-wrap: wrap;
    gap: ${theme.spacing(0.5)};
    margin-top: ${theme.spacing(0.5)};
  `,
  metricBox: css`
    display: flex;
    align-items: center;
    background-color: ${theme.colors.background.primary};
    padding: ${theme.spacing(0)} ${theme.spacing(0.5)};
    margin-right: ${theme.spacing(0.5)};
    border-radius: ${theme.shape.borderRadius()};
    font-size: 0.9em;
  `,
  removeMetricButton: css`
    background: transparent;
    border: none;
    margin-left: ${theme.spacing(0.25)};
    cursor: pointer;
    font-weight: bold;
    color: ${theme.colors.error.text};

    &:hover {
      color: ${theme.colors.error.border};
    }
=======
  visSelect: css`
    margin-left: ${theme.spacing(1)};
    width: 150px;
>>>>>>> e725c86bf88fae2356ccb7ad4ff0a741b3e01aaa
  `,
});
