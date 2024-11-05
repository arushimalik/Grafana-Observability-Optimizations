import React, { useState, useEffect } from 'react';

type ServiceResponse = {
  text: string;
  [key: string]: any;
};

type MetricNode = {
  name: string;
  fullPath: string;
  children: MetricNode[];
  isLeaf: boolean;
};

type Option = {
  label: string;
  value: string;
};

const [metricsTree, setMetricsTree] = useState<MetricNode[]>([]); // Nested tree structure for all metrics


// const getServiceMetrics = async () => {
//     if (!selectedService) {
//       return;
//     }
async function getServiceMetrics(selectedService: string): Promise<[MetricNode[], Option[]] | null>{
// Fetches all metrics for the selected service, including recursively loading child nodes
  
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
      // setServiceMetrics(formattedMetrics); // Flat list of leaves
      console.log(nestedMetricsTree)
      setMetricsTree(nestedMetricsTree); // Nested structure of all metrics

      const return_tuple = await new Promise<[MetricNode[], Option[]]>((resolve) => {
        setTimeout(() => {
          resolve([nestedMetricsTree, formattedMetrics])
        }, 1000);
      })

      return return_tuple;
  
    } catch (error) {
      console.error(`Error fetching metrics for ${selectedService} from Graphite:`, error);
      // setServiceError('Failed to load metrics');
    }
    return null;
  };

export default getServiceMetrics;