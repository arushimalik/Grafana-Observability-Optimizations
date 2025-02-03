import React, { useState, useEffect } from "react";
import { css } from "@emotion/css";
import { GrafanaTheme2 } from "@grafana/data";
import { useStyles2, Select, Checkbox, Button } from "@grafana/ui";
import { PluginPage, getBackendSrv } from "@grafana/runtime";
import { VscChevronDown, VscChevronRight } from "react-icons/vsc";
import { fetchAvailableServices } from "../utils/page_utils";

function DashboardAssistant() {
  const styles = useStyles2(getStyles);

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
  // Returns "none", "partial", or "full".
  const getNodeSelectionStatus = (node: MetricNode): "none" | "partial" | "full" => {
    if (node.isLeaf) return selectedMetrics.has(node.fullPath) ? "full" : "none";
    const leaves = getAllLeafKeys(node);
    const selectedCount = leaves.filter((leaf) => selectedMetrics.has(leaf)).length;
    if (selectedCount === 0) return "none";
    if (selectedCount === leaves.length) return "full";
    return "partial";
  };

  // Toggles selection for both leaves and parent nodes.
  const toggleNodeSelection = (node: MetricNode) => {
    setSelectedMetrics((prev) => {
      const newSelection = new Set(prev);
      const leaves = getAllLeafKeys(node);
      // If any descendant is selected, then deselect all; otherwise, select them all.
      const anySelected = leaves.some((leaf) => newSelection.has(leaf));
      leaves.forEach((leaf) => {
        if (anySelected) {
          newSelection.delete(leaf);
        } else {
          newSelection.add(leaf);
        }
      });
      return newSelection;
    });
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
          </div>
          {hasChildren && isExpanded && <div className={styles.childNodes}>{renderTree(node.children)}</div>}
        </div>
      );
    });
  };

  // Creates a new dashboard using the selected metrics.
  const createDashboard = async () => {
    if (selectedMetrics.size === 0 || !graphiteDatasourceUid) {
      setDashboardError("Please select at least one metric and ensure the datasource is available.");
      return;
    }

    setCreatingDashboard(true);
    setDashboardError(null);

    // Convert the Set to an array.
    const selectedMetricsArray = [...selectedMetrics];

    // Construct the dashboard JSON.
    const newDashboard = {
      dashboard: {
        title: `${selectedService?.label} Metrics Dashboard`,
        panels: selectedMetricsArray.map((metric, index) => ({
          title: metric,
          type: "timeseries",
          datasource: {
            type: "graphite",
            uid: graphiteDatasourceUid,
          },
          targets: [{ target: metric, refId: "A" }],
          id: index + 1,
          gridPos: { h: 8, w: 12, x: (index % 2) * 12, y: Math.floor(index / 2) * 8 },
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
        })),
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
});
