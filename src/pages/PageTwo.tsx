import React, { useState, useEffect } from 'react';
import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { useStyles2, Select, Checkbox, Button } from '@grafana/ui';
import { testIds } from '../components/testIds';
import { PluginPage, getBackendSrv } from '@grafana/runtime';
import { ROUTES, Option, ServiceResponse, DashboardResponse, MetricComparison, suffixSet } from '../constants';


function PageTwo() {

	type MetricNode = {
		name: string;
		fullPath: string;
		children: MetricNode[];
		isLeaf: boolean;
	};

	const styles = useStyles2(getStyles);

	// State variables for managing selected options, available options, errors, etc.
	const [selectedService, setSelectedService] = useState<Option | null>(null);
	const [availableServices, setAvailableServices] = useState<Option[]>([]);
	const [serviceMetrics, setServiceMetrics] = useState<Option[]>([]);
	const [metricsTree, setMetricsTree] = useState<MetricNode[]>([]); // Nested tree structure for all metrics
	const [loadingServices, setLoadingServices] = useState(false);
	const [serviceError, setServiceError] = useState<string | null>(null);
	const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
	const [creatingDashboard, setCreatingDashboard] = useState(false);
	const [dashboardError, setDashboardError] = useState<string | null>(null);
	const [graphiteDatasourceUid, setGraphiteDatasourceUid] = useState<string | null>(null);

	useEffect(() => {
		fetchAvailableServices();  // Fetch list of services on component mount
		fetchGraphiteDatasourceUid();  // Fetch the Graphite datasource UID
	}, []);

	// Fetches available services from Graphite and formats them for display
	const fetchAvailableServices = async () => {
		setLoadingServices(true);
		setServiceError(null);
		try {
			const response = await fetch('http://localhost:9080/metrics/find?query=*'); // Update URL as needed
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

	// Fetches the UID for the Graphite datasource
	const fetchGraphiteDatasourceUid = async () => {
		try {
			const datasources = await getBackendSrv().get('/api/datasources');
			const graphiteDatasource = datasources.find((ds: any) => ds.type === 'graphite');
			if (graphiteDatasource) {
				setGraphiteDatasourceUid(graphiteDatasource.uid);
			} else {
				setDashboardError('Graphite datasource not found');
			}
		} catch (error) {
			console.error('Error fetching datasources:', error);
			setDashboardError('Failed to fetch datasource UID');
		}
	};

	// Fetches all metrics for the selected service, including recursively loading child nodes
	const getServiceMetrics = async () => {
		if (!selectedService) return;
	
		setServiceError(null);
	
		try {
			// Fetch top-level metrics for the selected service
			const response = await fetch(`http://localhost:9080/metrics/find?query=${selectedService.value}.*`);
			const services: ServiceResponse[] = await response.json();
	
			const formattedMetrics: Option[] = []; // Flat list of leaf metrics
			const nestedMetricsTree: MetricNode[] = []; // Nested tree structure for all metrics
	
			// Recursive function to build both the flat list of leaf metrics and the nested tree
			const buildTreeAndCollectLeaves = async (service: ServiceResponse): Promise<MetricNode> => {
				const node: MetricNode = {
					name: service.text,
					fullPath: service.id,
					children: [],
					isLeaf: service.leaf || false,
				};
	
				if (service.leaf) {
					// If it's a leaf, add it to the flat list
					formattedMetrics.push({ label: service.id, value: service.id });
				} else {
					// Fetch children and process them recursively
					const childResponse = await fetch(`http://localhost:9080/metrics/find?query=${service.id}.*`);
					const children: ServiceResponse[] = await childResponse.json();
					
					node.children = await Promise.all(children.map(buildTreeAndCollectLeaves));
				}
	
				return node;
			};
	
			// Process each root-level service and build the nested tree and flat leaf list
			nestedMetricsTree.push(...await Promise.all(services.map(buildTreeAndCollectLeaves)));
	
			// Update component state with both the flat list and nested tree
			setServiceMetrics(formattedMetrics); // Flat list of leaves
			console.log(nestedMetricsTree)
			setMetricsTree(nestedMetricsTree); // Nested structure of all metrics
	
		} catch (error) {
			console.error(`Error fetching metrics for ${selectedService.value} from Graphite:`, error);
			setServiceError('Failed to load metrics');
		}
	};
	

	// Toggles metric selection when a checkbox is clicked
	const handleMetricSelection = (metric: string) => {
		setSelectedMetrics((prevSelected) =>
			prevSelected.includes(metric) ? prevSelected.filter((m) => m !== metric) : [...prevSelected, metric]
		);
	};

	// Creates a new Grafana dashboard based on selected metrics and the Graphite datasource UID
	const createDashboard = async () => {
		if (selectedMetrics.length === 0 || !graphiteDatasourceUid) {
			setDashboardError('Please select at least one metric and ensure the datasource is available.');
			return;
		}
		
		setCreatingDashboard(true);
		setDashboardError(null);
		
		// Constructs the dashboard JSON configuration
		const newDashboard = {
			dashboard: {
				title: `${selectedService?.label} Metrics Dashboard`,
				panels: selectedMetrics.map((metric, index) => ({
					title: metric,
					type: 'timeseries',
					datasource: {
						type: 'graphite',
						uid: graphiteDatasourceUid, // Correct datasource UID
					},
					targets: [{ target: metric, refId: 'A' }],
					id: index + 1,
					gridPos: { h: 8, w: 12, x: (index % 2) * 12, y: Math.floor(index / 2) * 8 },
					fieldConfig: {
						defaults: {
							custom: {
								drawStyle: 'line',
								lineInterpolation: 'linear',
								showPoints: 'auto',
								lineWidth: 1,
								fillOpacity: 0,
								gradientMode: 'none',
							},
							color: {
								mode: 'palette-classic',
							},
							thresholds: {
								mode: 'absolute',
								steps: [
									{ color: 'green', value: null },
									{ color: 'red', value: 80 },
								],
							},
						},
						overrides: [],
					},
					options: {
						tooltip: { mode: 'single', sort: 'none' },
						legend: { showLegend: true, displayMode: 'list', placement: 'bottom' },
					},
				})),
			},
			folderId: 0,
			overwrite: false,
		};

		try {
			const response = await getBackendSrv().post('/api/dashboards/db', newDashboard);
			console.log('Dashboard created:', response);
			alert(`Dashboard "${newDashboard.dashboard.title}" created successfully!`);
		} catch (error) {
			console.error('Error creating dashboard:', error);
			setDashboardError('Failed to create dashboard');
		} finally {
			setCreatingDashboard(false);
		}
	};

	// Fetches metrics when a new service is selected
	useEffect(() => {
		if (selectedService) {
			getServiceMetrics();
		}
	}, [selectedService]);

	return (
		<PluginPage>
			<div data-testid={testIds.pageTwo.container}>

				{/* Dropdown to select service */}
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

				{/* List of metrics with checkboxes for selection */}
				{serviceMetrics.length > 0 && (
					<div className={styles.marginTop}>
						<h4>Select Metrics to Include in Dashboard:</h4>
						<div>
							{serviceMetrics.map((metric) => (
								<div key={metric.value}>
									<Checkbox
										label={metric.label}
										value={metric.value}
										onChange={() => handleMetricSelection(metric.value)}
										checked={selectedMetrics.includes(metric.value)}
									/>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Button to create dashboard with selected metrics */}
				<div className={styles.marginTop}>
					<Button onClick={createDashboard} disabled={creatingDashboard}>
						{creatingDashboard ? 'Creating Dashboard...' : 'Create Dashboard'}
					</Button>
					{dashboardError && <div className={styles.error}>{dashboardError}</div>}
				</div>
			</div>
		</PluginPage>
	);
}

export default PageTwo;

// Styling for components
const getStyles = (theme: GrafanaTheme2) => ({
	marginTop: css`
		margin-top: ${theme.spacing(2)};
	`,
	error: css`
		color: ${theme.colors.error.text};
		margin-top: ${theme.spacing(1)};
	`,
});