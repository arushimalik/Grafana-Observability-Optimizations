import { Option, ServiceResponse } from './constants';

export async function getServiceMetrics(selectedService: Option): Promise<Option[]> {
  try {
    console.log(selectedService.value);
    const response = await fetch(`http://localhost:9080/metrics/find?query=${selectedService.value}.*`);
    const services: ServiceResponse[] = await response.json();
    console.log(`services:`);
    console.log(`TEST LOG:`);
    console.log(services);
    const formattedServices: Option[] = [];
    

    // Function to recursively fetch leaf metrics
    const fetchLeaves = async (service: ServiceResponse) => {
      if (service.leaf) {
        // If it's a leaf, add to formattedServices
        formattedServices.push({
          label: service.id,
          value: service.id,
        });
      } else {
        // Otherwise, fetch children
        const childResponse = await fetch(`http://localhost:9080/metrics/find?query=${service.id}.*`);
        const children: ServiceResponse[] = await childResponse.json();

        if (children.length === 0) {
          // If there are no children, add the service itself
          formattedServices.push({
            label: service.id,
            value: service.id,
          });
        } else {
          // Otherwise, process children
          await Promise.all(children.map(fetchLeaves));
        }
      }
    };

    // Process each service
    await Promise.all(services.map(fetchLeaves));

    const formattedMetrics = formattedServices.map((service) => ({
      label: service.label,
      value: service.label,
    }));
          // setAvailableServices(formattedServices);

    // setServiceMetrics(formattedMetrics);
    console.log(formattedMetrics);
    

    // ADDED COMPARE METRICS ~~~~~~~~
    // compareMetrics(formattedMetrics);
    console.log("change cool yay change1");
    return formattedMetrics;


  } catch (error) {
    console.error(`Error fetching metrics for ${selectedService} from Graphite:`, error);
    //setMetricError('Failed to load metrics');
   return [];
  }
}