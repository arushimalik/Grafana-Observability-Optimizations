package simulator

import (
	"context"
	"log/slog"
	"os"
	"sync"

	"crowdstrikeclinic24/service-metrics-simulator/internal/cloud"
)

// Run starts the service metrics simulator. The simulator stops when the
// provided context is canceled. Run returns 1 if the simulator failed to start,
// 0 otherwise.
func Run(ctx context.Context) int {
	logger := slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{
		AddSource: true,
	}))

	simulatorConfig, err := loadConfig()
	if err != nil {
		logger.Error("failed to load simulator config", "error", err)
		return 1
	}

	logger.Info("loaded simulator config",
		"microservices", len(simulatorConfig.Microservices),
		"clouds", len(simulatorConfig.Clouds))

	var clouds []*cloud.Cloud
	for _, cloudCfg := range simulatorConfig.Clouds {
		c, err := cloud.New(cloudCfg, logger)
		if err != nil {
			logger.Error("failed to set up cloud", "name", cloudCfg.Name,
				"error", err, "graphiteEndpoint", cloudCfg.GraphiteEndpoint)
			continue // skip clouds that fail setup
		}

		for _, serviceCfg := range simulatorConfig.Microservices {
			c.Deploy(serviceCfg)
		}

		clouds = append(clouds, c)
	}

	if len(clouds) == 0 {
		logger.Error("no valid cloud configurations; exiting simulator")
		return 1
	}

	logger.Info("finished initializing clouds", "clouds", len(clouds))

	// Start each cloud in a goroutine, then wait for all goroutines to finish.
	var wg sync.WaitGroup
	for _, c := range clouds {
		// This seemingly pointless assignment is necessary in Go versions before 1.22.
		// See https://go.dev/doc/faq#closures_and_goroutines if you're curious.
		c := c
		wg.Add(1)
		go func() {
			defer wg.Done()

			c.Run(ctx)
		}()
	}

	wg.Wait()
	return 0
}
