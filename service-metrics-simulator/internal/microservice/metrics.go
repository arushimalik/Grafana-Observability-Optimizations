package microservice

import (
	"math/rand/v2"
	"time"

	"github.com/rcrowley/go-metrics"
)

// MetricConfig describes a set of mock metrics that a microservice should emit.
type MetricConfig struct {
	Meters []RandomMeter `json:"meters"`
	Timers []RandomTimer `json:"timers"`
}

// UpdateAll calls Update for all metrics defined within this configuration.
func (c MetricConfig) UpdateAll(r metrics.Registry) {
	for _, m := range c.Meters {
		m.Update(r)
	}
	for _, t := range c.Timers {
		t.Update(r)
	}
}

// A RandomMeter is a Graphite meter that marks a random value between Low and
// High whenever Update is called.
type RandomMeter struct {
	Name string `json:"name"`
	Low  int64  `json:"low"`
	High int64  `json:"high"`
}

// Update marks a random value between Low and High for metric Name.
func (m RandomMeter) Update(r metrics.Registry) {
	val := m.Low + rand.Int64N(m.High-m.Low)
	meter := metrics.GetOrRegisterMeter("meter."+m.Name, r)
	meter.Mark(val)
}

// RandomTimer is a metrics.Timer that records an event that took between Low
// and High seconds every time Update is called.
type RandomTimer struct {
	Name string `json:"name"`
	Low  int64  `json:"low"`
	High int64  `json:"high"`
}

// Update causes timer Name to record that an event took between Low and High
// seconds to complete.
func (t RandomTimer) Update(r metrics.Registry) {
	val := t.Low + rand.Int64N(t.High-t.Low)
	timer := metrics.GetOrRegisterTimer("timer."+t.Name, r)
	timer.Update(time.Duration(val) * time.Second)
}
