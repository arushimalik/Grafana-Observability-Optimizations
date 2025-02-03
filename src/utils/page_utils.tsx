import { ServiceResponse, Option } from "../constants";

export const fetchAvailableServices = async (): Promise<Option[]> => {
    try {
      console.log("Fetching available services...");
  
      const response = await fetch("http://localhost:9080/metrics/find?query=*");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const services: ServiceResponse[] = await response.json();
      console.log("Fetched services:", services);
  
      return services.map(service => ({
        label: service.text,
        value: service.text,
      }));
    } catch (error) {
      console.error("Error fetching services:", error);
      return [];
    }
  };
  