package microservice

import "github.com/rcrowley/go-metrics"

// Config represents the static, cloud-agnostic configuration of a microservice.
type Config struct {
	// Name is the name of this microservice. All metric names for this service will
	// start with the microservice name.
	Name string `json:"name"`
	// Metrics describes the set of mock metrics this microservice should emit. In
	// real life, these metrics would be defined and updated in the microservice
	// source code. Some of those metrics might be unhelpful and unused in Grafana
	// dashboards. We want to identify those unhelpful metrics so that we may remove
	// them.
	Metrics MetricConfig `json:"metrics"`
}

// Microservice represents an instance of a simulated microservice that can
// record service-specific metrics in a registry.
type Microservice struct {
	Config Config

	Registry metrics.Registry
}

// Update updates all metrics defined for this microservice.
func (m *Microservice) Update() {
	m.Config.Metrics.UpdateAll(m.Registry)
}
