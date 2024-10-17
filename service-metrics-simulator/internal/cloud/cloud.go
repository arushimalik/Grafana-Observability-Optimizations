// Package cloud provides simulated clouds that will emit mock metrics to a
// Graphite instance.
package cloud

import (
	"context"
	"fmt"
	"log/slog"
	"net"
	"sync"
	"time"

	graphite "github.com/cyberdelia/go-metrics-graphite"
	"github.com/rcrowley/go-metrics"

	"crowdstrikeclinic24/service-metrics-simulator/internal/microservice"
)

const (
	// Default time interval for flushing metrics from memory to Graphite.
	defaultFlushInterval = 10 * time.Second
	// Default time interval for updating metrics within memory.
	defaultMetricUpdateInterval = 1 * time.Second
)

// Config defines the static configuration for a cloud.
type Config struct {
	Name             string `json:"name"`
	GraphiteEndpoint string `json:"graphiteEndpoint"`
}

// A Cloud represents an isolated instance of our cloud architecture, including
// all microservices, databases, and related infrastructure. The metrics for
// each cloud are sent to a cloud-specific instance of Graphite, then each
// Graphite instance is configured as a data source for our global instance of
// Grafana. We can make metrics from multiple clouds available in a dashboard by
// setting the data source as a variable, but it is difficult to view metrics
// from different clouds _at the same time_.
type Cloud struct {
	cfg Config

	// In-memory registry of all simulated metrics for this cloud.
	registry      metrics.Registry
	graphiteAddr  *net.TCPAddr
	microservices []*microservice.Microservice

	logger *slog.Logger
}

// New creates a new Cloud instance from a static configuration. An error is
// returned if the graphite address cannot be parsed to a valid TCP address.
func New(cfg Config, logger *slog.Logger) (*Cloud, error) {
	addr, err := net.ResolveTCPAddr("tcp", cfg.GraphiteEndpoint)
	if err != nil {
		return nil, fmt.Errorf("parsing graphite endpoint: %v", err)
	}

	return &Cloud{
		cfg:           cfg,
		registry:      metrics.NewRegistry(),
		graphiteAddr:  addr,
		microservices: nil, // microservices must be deployed using Cloud.Deploy
		logger:        logger.With("cloud", cfg.Name),
	}, nil
}

// Deploy adds an instance of a microservice to this cloud.
func (c *Cloud) Deploy(cfg microservice.Config) {
	instance := &microservice.Microservice{
		Config: cfg,
		// All metrics for this microservice will be prefixed with "<name>."
		Registry: metrics.NewPrefixedChildRegistry(c.registry, cfg.Name+"."),
	}

	c.microservices = append(c.microservices, instance)
}

// Run starts the metric update and flush loops. This function blocks until the
// provided context is canceled.
func (c *Cloud) Run(ctx context.Context) {
	defer c.flushMetrics()

	c.logger.Info("starting cloud")

	var wg sync.WaitGroup

	wg.Add(1)
	go func() {
		defer wg.Done()
		c.runMetricUpdater(ctx)
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		c.runMetricFlusher(ctx)
	}()

	wg.Wait()
}

func (c *Cloud) runMetricUpdater(ctx context.Context) {
	c.logger.Info("starting metric updater")
	t := time.NewTicker(defaultMetricUpdateInterval)
	for {
		select {
		case <-t.C:
			c.updateMetrics()
		case <-ctx.Done():
			c.logger.Info("stopping metric updater")
			t.Stop()
			return
		}
	}
}

func (c *Cloud) updateMetrics() {
	for _, m := range c.microservices {
		m.Update()
	}
}

func (c *Cloud) runMetricFlusher(ctx context.Context) {
	c.logger.Info("starting metric flusher")
	t := time.NewTicker(defaultFlushInterval)
	for {
		select {
		case <-t.C:
			c.flushMetrics()
		case <-ctx.Done():
			c.logger.Info("stopping metric flusher")
			t.Stop()
			return
		}
	}
}

func (c *Cloud) flushMetrics() {
	cfg := graphite.Config{
		Addr:          c.graphiteAddr,
		Registry:      c.registry,
		FlushInterval: defaultFlushInterval,
		DurationUnit:  time.Nanosecond,
		Prefix:        "",
		Percentiles:   []float64{0.5, 0.75, 0.95, 0.99, 0.999},
	}

	err := graphite.Once(cfg)
	if err != nil {
		c.logger.Error("failed to flush metrics to graphite",
			"graphiteEndpoint", c.cfg.GraphiteEndpoint, "error", err)
		return
	}

	c.logger.Info("flushed metrics")
}
