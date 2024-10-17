package simulator

import (
	"encoding/json"
	"fmt"
	"os"

	"crowdstrikeclinic24/service-metrics-simulator/internal/cloud"
	"crowdstrikeclinic24/service-metrics-simulator/internal/microservice"
)

const defaultConfigPath = "/app/config/example-config.json"

// Config represents the configuration for the simulator, including details
// about all simulated clouds.
type Config struct {
	Clouds        []cloud.Config        `json:"clouds"`
	Microservices []microservice.Config `json:"microservices"`
}

// loadConfig reads the JSON configuration file with path given by environment
// variable SIMULATOR_CONFIG_PATH. If the environment variable is not defined,
// fall back to a default path.
func loadConfig() (Config, error) {
	path := os.Getenv("SIMULATOR_CONFIG_PATH")
	if path == "" {
		path = defaultConfigPath
	}

	file, err := os.Open(path)
	if err != nil {
		return Config{}, fmt.Errorf("opening configuration file: %v", err)
	}

	var cfg Config
	dec := json.NewDecoder(file)
	if err := dec.Decode(&cfg); err != nil {
		return Config{}, fmt.Errorf("decoding simulator config json: %v", err)
	}

	return cfg, nil
}
