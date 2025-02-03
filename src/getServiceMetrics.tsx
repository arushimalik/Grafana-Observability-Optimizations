import { ServiceResponse, suffixSet } from './constants';

export async function getServiceMetrics(selectedService: string): Promise<{ flatList: string[]; tree: Record<string, any> }> {
  // This function will take in a selected service as a string and return 
  // a list of all metrics (the leaves of the service metrics tree) and a tree structure for the whole metrics tree

  try {
    console.log(`Selected service: ${selectedService}`);

    const response = await fetch(`http://localhost:9080/metrics/find?query=${selectedService}.*`);
    const services: ServiceResponse[] = await response.json();

    const flatList: string[] = [];
    const tree: Record<string, any> = {};

    // Function to build the tree and collect leaf metrics into the flat list
    const buildTree = async (service: ServiceResponse, treeNode: any) => {
      if (service.leaf) {
        // Add leaf to flatList and tree
        if (!suffixSet.has(`.${service.text}`)) {
          // if the leaf text is not in the suffix set:
          flatList.push(service.id);
          treeNode[service.text] = null; // Leaf nodes in the tree are null
        } 

      } else {
        // Create a new branch in the tree
        treeNode[service.text] = {};

        // Fetch children
        const childResponse = await fetch(`http://localhost:9080/metrics/find?query=${service.id}.*`);
        const children: ServiceResponse[] = await childResponse.json();

        if (children.length === 0) {
          // If no children, treat as a leaf
          flatList.push(service.id);
          treeNode[service.text] = null;
        } else {
          // Recursively process children
          await Promise.all(children.map((child) => buildTree(child, treeNode[service.text])));

          if (Object.keys(treeNode[service.text]).length === 0) {
            // check to see after we process all the children if any children remain. 
            // if no children remain, this node is a leaf so treat it as one.
            treeNode[service.text] = null;
            flatList.push(service.id);
          }
          
        }
      }
    };
    console.log(flatList);
    // Build the tree and flat list by processing each root service
    await Promise.all(services.map((service) => buildTree(service, tree)));

    console.log("Flat List:", flatList);
    console.log("Tree Structure:", tree);

    return { flatList, tree };
  } catch (error) {
    console.error(`Error fetching metrics for ${selectedService} from Graphite:`, error);
    return { flatList: [], tree: {} };
  }
}

export function printTree (tree: Record<string, any>, indent = 0): void {
  const indentation = "  ".repeat(indent); // Create indentation based on the depth of the node
  for (const [key, value] of Object.entries(tree)) {
    if (value === null) {
      // If it's a leaf node
      console.log(`${indentation}- ${key}`);
    } else {
      // If it's a branch
      console.log(`${indentation}+ ${key}`);
      printTree(value, indent + 1); // Recurse into the branch
    }
  }
};
