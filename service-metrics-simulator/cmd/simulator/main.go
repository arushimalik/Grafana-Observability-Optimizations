// Package main is the entrypoint for the program. From the root of the Go
// module, the program can be run directly with `go run ./cmd/simulator` or
// compiled with `go build -o simulator ./cmd/simulator`.
package main

import (
	"context"
	"os"
	"os/signal"
	"syscall"

	"crowdstrikeclinic24/service-metrics-simulator/internal/simulator"
)

func main() {
	// The context `ctx` will be canceled (the channel ctx.Done() will be closed)
	// when the process receives an interrupt (sent by Ctrl+C) or a termination
	// signal (sent by `docker stop`).
	ctx, _ := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)

	// simulator.Run is a blocking call, but it will detect when the provided
	// context `ctx` is canceled. This allows us to shut down gracefully.
	exitCode := simulator.Run(ctx)
	os.Exit(exitCode)
}
