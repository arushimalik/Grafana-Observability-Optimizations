import React, { useState, useEffect } from "react";
import { css, cx } from "@emotion/css";
import { GrafanaTheme2 } from "@grafana/data";
import { useStyles2, Select, Checkbox, Button } from "@grafana/ui";
import { PluginPage, getBackendSrv } from "@grafana/runtime";
import { VscChevronDown, VscChevronRight } from "react-icons/vsc";
import { fetchAvailableServices } from "../utils/page_utils";

// ----------------------
// Types & Interfaces
// ----------------------

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


type Transformation = {
  label: string;
  value: string;
  global: boolean; // true means combine all metrics in one query
  customQueryFunc?: (metrics: string[], constant?: number) => string; // optional custom function.
};

// ----------------------
// Custom Transformation Functions
// ----------------------

// example custom function
const derivativeAndMovingAverage = (metrics: string[]): string => {
  return `movingAverage(derivative(sumSeries(${metrics.join(",")})),5)`;
};

// ----------------------
// Transformation Options
// ----------------------

const transformationOptions: Transformation[] = [
  { label: "None", value: "none", global: false },
  { label: "Sum", value: "sumSeries", global: true },
  { label: "Average", value: "averageSeries", global: true },
  { label: "Max", value: "maxSeries", global: true },
  { label: "Min", value: "minSeries", global: true },
  { label: "Derivative", value: "derivative", global: false },
  { label: "Moving Average", value: "movingAverage", global: false },
  { label: "Integral", value: "integral", global: false },
  { label: "Hitcount", value: "hitcount", global: false },
  // example custom transformation
  { label: "Derivative & Moving Average", value: "derivativeAndMovingAverage", global: true, customQueryFunc: derivativeAndMovingAverage },
];

type AddedGraph = {
  metrics: string[];
  graphType: GraphType;
  transformation: Transformation;
};

// ----------------------
// DashboardAssistant component
// ----------------------

function DashboardAssistant() {
  const styles = useStyles2(getStyles);

  // State definitions
  const [selectedService, setSelectedService] = useState<GraphType | null>(null);
  const [availableServices, setAvailableServices] = useState<GraphType[]>([]);
  const [addedGraphs, setAddedGraphs] = useState<AddedGraph[]>([]);
  const [selectedGraphType, setSelectedGraphType] = useState<GraphType>({
    label: "Line",
    value: "line",
  });
  const [selectedTransformation, setSelectedTransformation] = useState<Transformation>(
    transformationOptions[0]
  );
  const [metricsTree, setMetricsTree] = useState<MetricNode[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [serviceError, setServiceError] = useState<string | null>(null);
  const [selectedMetrics, setSelectedMetrics] = useState<Set<string>>(new Set());
  const [creatingDashboard, setCreatingDashboard] = useState(false);
  const [addingGraph, setAddingGraph] = useState(false);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [graphError, setGraphError] = useState<string | null>(null);
  const [graphiteDatasourceUid, setGraphiteDatasourceUid] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [editingGraphIndex, setEditingGraphIndex] = useState<number | null>(null);

  // Fetch available services and datasource UID on mount
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

  // Functions to expand or collapse all nodes
  const getAllNodePaths = (nodes: MetricNode[]): string[] => {
    let allPaths: string[] = [];
    nodes.forEach((node) => {
      if (!node.isLeaf) {
        allPaths.push(node.fullPath);
        allPaths = [...allPaths, ...getAllNodePaths(node.children)];
      }
    });
    return allPaths;
  };

  const expandAllNodes = () => {
    const allPaths = getAllNodePaths(metricsTree);
    setExpandedNodes(new Set(allPaths));
  };

  const collapseAllNodes = () => {
    setExpandedNodes(new Set());
  };

  // Determine if all nodes are expanded
  const areAllNodesExpanded = () => {
    const allPaths = getAllNodePaths(metricsTree);
    return allPaths.length > 0 && allPaths.every((path) => expandedNodes.has(path));
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
        </div>
        {node.children.length > 0 && expandedNodes.has(node.fullPath) && (
          <div className={styles.childNodes}>{renderTree(node.children)}</div>
        )}
      </div>
    ));

  // Graph addition and removal logic
  const addGraph = async () => {
    if (selectedMetrics.size === 0 || !graphiteDatasourceUid) {
      setDashboardError(
        "Please select at least one metric and ensure the datasource is available."
      );
      return;
    }

    setAddingGraph(true);
    setGraphError(null);

    try {
      const selectedMetricsArray = [...selectedMetrics];
      // If in edit mode, update current graph instead of adding a new one
      if (editingGraphIndex !== null) {
        setAddedGraphs((prevGraphs) =>
          prevGraphs.map((graph, index) =>
            index === editingGraphIndex
              ? {
                  ...graph,
                  metrics: selectedMetricsArray,
                  graphType: selectedGraphType,
                  transformation: selectedTransformation,
                }
              : graph
          )
        );
        // Exit edit mode after saving
        setEditingGraphIndex(null);
      } else {
        setAddedGraphs((prevGraphs) => [
          {
            metrics: selectedMetricsArray,
            graphType: selectedGraphType,
            transformation: selectedTransformation,
          },
          ...prevGraphs,
        ]);
      }
    } catch {
      setGraphError("Failed to add graph");
    } finally {
      setAddingGraph(false);
      // Clear selected metrics after saving
      setSelectedMetrics(new Set());
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

  // Delete entire graph from the list
  const deleteGraph = (graphIndex: number) => {
    setAddedGraphs((prevGraphs) => prevGraphs.filter((_, index) => index !== graphIndex));
    // If the deleted graph was being edited then exit edit mode
    if (editingGraphIndex === graphIndex) {
      setEditingGraphIndex(null);
      setSelectedMetrics(new Set());
    }
  };

  // Handle edit: pre-load the graph's metrics, graph type, and transformation into the selectors
  const editGraph = (graphIndex: number) => {
    const graph = addedGraphs[graphIndex];
    setSelectedMetrics(new Set(graph.metrics));
    setSelectedGraphType(graph.graphType);
    setSelectedTransformation(graph.transformation);
    setEditingGraphIndex(graphIndex);
  };

  // Dashboard creation logic
  const createDashboard = async () => {
    if (addedGraphs.length === 0 || !graphiteDatasourceUid) {
      setDashboardError(
        "Please add at least one graph and ensure the datasource is available."
      );
      return;
    }

    setCreatingDashboard(true);
    setDashboardError(null);

    const panels = addedGraphs.map((graph, index) => {
      let targets = [];

      if (graph.transformation && graph.transformation.value !== "none") {
        // If a custom function is provided, use that to produce the Graphite query.
        if (graph.transformation.customQueryFunc) {
          const targetQuery = graph.transformation.customQueryFunc(graph.metrics);
          targets.push({
            target: targetQuery,
            refId: `A${index}0`,
          });
        } else if (graph.transformation.global) {
          // Combine all metrics into one query, ex. sumSeries(m1, m2, ...)
          const targetQuery = `${graph.transformation.value}(${graph.metrics.join(",")})`;
          targets.push({
            target: targetQuery,
            refId: `A${index}0`,
          });
        } else {
          // Apply the transformation to each metric individually, ex. derivative(metric)
          targets = graph.metrics.map((metric, mIndex) => ({
            target: `${graph.transformation.value}(${metric})`,
            refId: `A${index}${mIndex}`,
          }));
        }
      } else {
        // Case for no transformation; query each metric directly.
        targets = graph.metrics.map((metric, mIndex) => ({
          target: metric,
          refId: `A${index}${mIndex}`,
        }));
      }

      return {
        title: `Graph ${index + 1}`,
        type: "timeseries",
        datasource: { type: "graphite", uid: graphiteDatasourceUid },
        targets,
        id: index + 1,
        gridPos: { h: 8, w: 12, x: (index % 2) * 12, y: Math.floor(index / 2) * 8 },
        fieldConfig: {
          defaults: { custom: { drawStyle: graph.graphType.value } },
        },
      };
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
      await getBackendSrv().post("/api/dashboards/db", newDashboard);
      alert(`Dashboard "${newDashboard.dashboard.title}" created successfully!`);
    } catch (error) {
      setDashboardError("Failed to create dashboard");
    } finally {
      setCreatingDashboard(false);
    }
  };

  return (
    <PluginPage>
      <div
        className={cx(
          styles.selectorContainer,
          editingGraphIndex !== null && styles.editModeContainer
        )}
      >
        {/* Adapt header based on edit mode */}
        <h3>
          {editingGraphIndex !== null
            ? `Edit metrics for Graph ${editingGraphIndex + 1}`
            : "Select metrics to add to your new dashboard:"}
        </h3>

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
            {/* Expand/Collapse All Button */}
            <div className={styles.expandCollapseContainer}>
              <Button
                size="sm"
                variant="secondary"
                onClick={areAllNodesExpanded() ? collapseAllNodes : expandAllNodes}
                className={styles.expandCollapseButton}
              >
                {areAllNodesExpanded() ? "Collapse All" : "Expand All"}
              </Button>
            </div>
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

        {/* Data Transformation Dropdown */}
        <div className={styles.marginTop}>
          <h4>Select Data Transformation:</h4>
          <Select
            options={transformationOptions}
            value={selectedTransformation}
            onChange={(option: any) => setSelectedTransformation(option)}
            placeholder="Select Transformation"
          />
        </div>

        {/* Graph Creation / Save Edit Buttons */}
        <div className={styles.marginTop}>
          <div className={styles.editButtons}>
            <Button onClick={addGraph} disabled={addingGraph}>
              {addingGraph
                ? "Processing..."
                : editingGraphIndex !== null
                ? "Save Edit"
                : "Add Graph"}
            </Button>
            {editingGraphIndex !== null && (
              <Button
                variant="secondary"
                onClick={() => {
                  setEditingGraphIndex(null);
                  setSelectedMetrics(new Set());
                }}
              >
                Cancel Edit
              </Button>
            )}
          </div>
          {graphError && <div className={styles.error}>{graphError}</div>}
        </div>
      </div>

      {/* Display Graphs Setup */}
      <div className={styles.marginTop}>
        {addedGraphs.length > 0 && (
          <div>
            {addedGraphs.map((graph, graphIndex) => (
              <div key={graphIndex} className={styles.graphDetail}>
                <div className={styles.graphHeader}>
                  <h5>
                    Graph {graphIndex + 1}: Type {graph.graphType.label}{" "}
                    {graph.transformation &&
                      graph.transformation.value !== "none" && (
                        <>| Transformation: {graph.transformation.label}</>
                      )}
                  </h5>
                  <div className={styles.graphActions}>
                    <Button
                      size="xs"
                      variant="secondary"
                      onClick={() => editGraph(graphIndex)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="xs"
                      variant="destructive"
                      onClick={() => deleteGraph(graphIndex)}
                      className={styles.deleteButton}
                    >
                      ×
                    </Button>
                  </div>
                </div>
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

// ----------------------
// Styling
// ----------------------
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
  graphDetail: css`
    margin-bottom: ${theme.spacing(2)};
    padding: ${theme.spacing(2)};
    border: 1px solid ${theme.colors.border.weak};
    border-radius: ${theme.shape.borderRadius()};
    background-color: ${theme.colors.background.secondary};
  `,
  graphHeader: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
  graphActions: css`
    display: flex;
    gap: ${theme.spacing(1)};
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
  `,
  editButtons: css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1)};
    margin-top: ${theme.spacing(1)};
  `,
  selectorContainer: css`
    padding: ${theme.spacing(2)};
    transition: background-color 0.3s ease;
  `,
  editModeContainer: css`
    background-color: rgba(0, 123, 255, 0.3);
  `,
  deleteButton: css`
    background: transparent;
    border: none;
    color: ${theme.colors.error.text};
    font-size: 1.2em;
    line-height: 1;
    cursor: pointer;

    &:hover {
      color: ${theme.colors.error.border};
    }
  `,
  expandCollapseContainer: css`
    margin-bottom: ${theme.spacing(1)};
  `,
  expandCollapseButton: css`
    margin-left: 0;
  `,
});
