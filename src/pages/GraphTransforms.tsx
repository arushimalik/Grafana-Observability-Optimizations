import React, { useState, useEffect } from "react";
import { css } from "@emotion/css";
import { GrafanaTheme2 } from "@grafana/data";
import { useStyles2, Select, Button, CodeEditor, Field } from "@grafana/ui";
import { PluginPage, getBackendSrv } from "@grafana/runtime";
import { VscChevronDown, VscChevronRight } from "react-icons/vsc";

type Panel = {
  id: number;
  title: string;
  targets: Array<{
    target: string;
    refId: string;
  }>;
};

type Transformation = {
  id: string;
  originalPanel: Panel;
  formula: string;
  transformedData: any;
};

function GraphTransformPage() {
  const styles = useStyles2(getStyles);

  // State variables
  const [selectedDashboard, setSelectedDashboard] = useState<any>(null);
  const [availableDashboards, setAvailableDashboards] = useState<any[]>([]);
  const [dashboardPanels, setDashboardPanels] = useState<Panel[]>([]);
  const [selectedPanel, setSelectedPanel] = useState<Panel | null>(null);
  const [transformationFormula, setTransformationFormula] = useState<string>("$value");
  const [transformations, setTransformations] = useState<Transformation[]>([]);
  const [loading, setLoading] = useState({
    dashboards: false,
    panels: false,
    transformation: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [expandedPanels, setExpandedPanels] = useState<Set<number>>(new Set());

  // Fetch available dashboards on mount
  useEffect(() => {
    const fetchDashboards = async () => {
      setLoading(prev => ({ ...prev, dashboards: true }));
      try {
        const response = await getBackendSrv().get('/api/search');
        const dashboards = response.map((dash: any) => ({
          label: dash.title,
          value: dash.uid,
        }));
        setAvailableDashboards(dashboards);
      } catch (error) {
        setError('Failed to load dashboards');
        console.error(error);
      } finally {
        setLoading(prev => ({ ...prev, dashboards: false }));
      }
    };
    
    fetchDashboards();
  }, []);

  // Fetch panels when dashboard is selected
  useEffect(() => {
    const fetchPanels = async () => {
      if (!selectedDashboard) {
        setDashboardPanels([]);
        return;
      }
      
      setLoading(prev => ({ ...prev, panels: true }));
      setError(null);
      try {
        const dashboard = await getBackendSrv().get(`/api/dashboards/uid/${selectedDashboard.value}`);
        setDashboardPanels(dashboard.dashboard.panels || []);
      } catch (error) {
        setError('Failed to load panels');
        console.error(error);
      } finally {
        setLoading(prev => ({ ...prev, panels: false }));
      }
    };
    
    fetchPanels();
  }, [selectedDashboard]);

  // Apply transformation to selected panel
  const applyTransformation = async () => {
    if (!selectedPanel || !transformationFormula) {
      setError('Please select a panel and enter a transformation formula');
      return;
    }

    setLoading(prev => ({ ...prev, transformation: true }));
    setError(null);

    try {
      // In a real implementation, you would fetch the actual panel data here
      // This is a simplified mock implementation
      const mockData = {
        series: [{
          name: 'Sample Data',
          fields: [
            {
              name: 'time',
              type: 'time',
              values: [Date.now() - 10000, Date.now() - 5000, Date.now()]
            },
            {
              name: 'value',
              type: 'number',
              values: [10, 20, 30]
            }
          ]
        }],
        state: 'Done',
        timeRange: { 
          from: new Date(Date.now() - 10000), 
          to: new Date() 
        }
      };

      // Apply the transformation
      const transformedData = transformData(mockData, transformationFormula);

      // Add to transformations list
      const newTransformation: Transformation = {
        id: Date.now().toString(),
        originalPanel: selectedPanel,
        formula: transformationFormula,
        transformedData
      };

      setTransformations(prev => [newTransformation, ...prev]);
      setSelectedPanel(null);
      setTransformationFormula('$value');
    } catch (error) {
      setError(`Failed to apply transformation: ${error instanceof Error ? error.message : String(error)}`);
      console.error(error);
    } finally {
      setLoading(prev => ({ ...prev, transformation: false }));
    }
  };

  // Transform the data using the provided formula
  const transformData = (data: any, formula: string): any => {
    if (!data?.series?.length) {
      return data;
    }

    return {
      ...data,
      series: data.series.map((series: any) => {
        if (!series.fields) {
          return series;
        }
        
        return {
          ...series,
          fields: series.fields.map((field: any) => {
            if (field.type !== 'number' || !field.values) {
              return field;
            }
            
            return {
              ...field,
              values: field.values.map((value: number) => {
                try {
                  // Replace $value with the actual value in the formula
                  const expr = formula.replace(/\$value/g, value.toString());
                  // WARNING: Using eval is dangerous in production!
                  // In a real app, use a proper expression evaluator
                  return eval(expr);
                } catch {
                  return value; // Return original if transformation fails
                }
              }),
            };
          }),
        };
      }),
    };
  };

  // Toggle panel expansion
  const togglePanelExpand = (panelId: number) => {
    setExpandedPanels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(panelId)) {
        newSet.delete(panelId);
      } else {
        newSet.add(panelId);
      }
      return newSet;
    });
  };

  // Render transformation results
  const renderTransformationResult = (transformation: Transformation) => {
    return (
      <div key={transformation.id} className={styles.transformationItem}>
        <div 
          className={styles.transformationHeader}
          onClick={() => togglePanelExpand(transformation.originalPanel.id)}
        >
          <span className={styles.expandIcon}>
            {expandedPanels.has(transformation.originalPanel.id) ? 
              <VscChevronDown /> : <VscChevronRight />}
          </span>
          <span className={styles.transformationTitle}>
            {transformation.originalPanel.title} → {transformation.formula}
          </span>
        </div>
        
        {expandedPanels.has(transformation.originalPanel.id) && (
          <div className={styles.transformationContent}>
            <div className={styles.dataPreview}>
              <h5>Original Data</h5>
              <pre>
                {JSON.stringify(transformation.originalPanel.targets, null, 2)}
              </pre>
            </div>
            <div className={styles.dataPreview}>
              <h5>Transformed Data</h5>
              <pre>
                {JSON.stringify(transformation.transformedData, null, 2)}
              </pre>
            </div>
            <Button 
              variant="secondary"
              onClick={() => {
                // Implement adding to dashboard
                alert('This would add the transformed panel to the dashboard');
              }}
            >
              Add to Dashboard
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <PluginPage>
      <div className={styles.container}>
        <h2>Graph Transformations</h2>
        <p>Apply mathematical transformations to existing dashboard panels</p>

        {/* Dashboard Selection */}
        <div className={styles.section}>
          <Field label="Select Dashboard">
            <Select
              options={availableDashboards}
              value={selectedDashboard}
              onChange={setSelectedDashboard}
              placeholder="Select Dashboard"
              isLoading={loading.dashboards}
            />
          </Field>
        </div>

        {/* Panel Selection */}
        {selectedDashboard && (
          <div className={styles.section}>
            <Field label="Select Panel to Transform">
              <Select
                options={dashboardPanels.map(panel => ({
                  label: panel.title || `Panel ${panel.id}`,
                  value: panel.id,
                }))}
                value={selectedPanel?.id || null}
                onChange={(id) => {
                  const panel = dashboardPanels.find(p => p.id === id);
                  setSelectedPanel(panel || null);
                }}
                placeholder="Select Panel"
                isLoading={loading.panels}
              />
            </Field>
          </div>
        )}

        {/* Transformation Formula */}
        {selectedPanel && (
          <div className={styles.section}>
            <Field label="Transformation Formula" description="Use $value to reference the original value">
              <CodeEditor
                language="javascript"
                value={transformationFormula}
                onBlur={(value) => setTransformationFormula(value)}
                onSave={(value) => setTransformationFormula(value)}
                showLineNumbers={false}
                height="100px"
                monacoOptions={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  quickSuggestions: false,
                }}
              />
            </Field>
            <div className={styles.formulaExamples}>
              Examples: 
              <code>$value * 2</code>, 
              <code>Math.sin($value)</code>, 
              <code>$value > 50 ? 1 : 0</code>
            </div>
            <Button 
              onClick={applyTransformation} 
              disabled={loading.transformation}
            >
              {loading.transformation ? 'Applying...' : 'Apply Transformation'}
            </Button>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        {/* Transformation Results */}
        {transformations.length > 0 && (
          <div className={styles.section}>
            <h3>Transformation Results</h3>
            <div className={styles.transformationsList}>
              {transformations.map(renderTransformationResult)}
            </div>
          </div>
        )}
      </div>
    </PluginPage>
  );
}

const getStyles = (theme: GrafanaTheme2) => ({
  container: css`
    padding: ${theme.spacing(3)};
  `,
  section: css`
    margin-bottom: ${theme.spacing(4)};
    padding: ${theme.spacing(3)};
    background: ${theme.colors.background.secondary};
    border-radius: ${theme.shape.borderRadius()};
  `,
  error: css`
    color: ${theme.colors.error.text};
    padding: ${theme.spacing(1, 2)};
    background: ${theme.colors.error.transparent};
    border-radius: ${theme.shape.borderRadius()};
    margin-bottom: ${theme.spacing(2)};
  `,
  formulaExamples: css`
    margin: ${theme.spacing(2, 0)};
    font-size: ${theme.typography.size.sm};
    color: ${theme.colors.text.secondary};
    
    code {
      margin: 0 ${theme.spacing(0.5)};
      padding: ${theme.spacing(0.25, 0.5)};
      background: ${theme.colors.background.canvas};
      border-radius: ${theme.shape.borderRadius()};
    }
  `,
  transformationsList: css`
    margin-top: ${theme.spacing(2)};
  `,
  transformationItem: css`
    margin-bottom: ${theme.spacing(2)};
    border: 1px solid ${theme.colors.border.weak};
    border-radius: ${theme.shape.borderRadius()};
  `,
  transformationHeader: css`
    padding: ${theme.spacing(2)};
    background: ${theme.colors.background.primary};
    cursor: pointer;
    display: flex;
    align-items: center;
  `,
  expandIcon: css`
    margin-right: ${theme.spacing(1)};
  `,
  transformationTitle: css`
    font-weight: ${theme.typography.fontWeightMedium};
  `,
  transformationContent: css`
    padding: ${theme.spacing(2)};
    background: ${theme.colors.background.canvas};
  `,
  dataPreview: css`
    margin-bottom: ${theme.spacing(2)};
    pre {
      background: ${theme.colors.background.secondary};
      padding: ${theme.spacing(1)};
      border-radius: ${theme.shape.borderRadius()};
      overflow-x: auto;
    }
  `,
});

export default GraphTransformPage;