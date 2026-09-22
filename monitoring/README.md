# monitoring

Observability configuration.

Planned stack:

- Micrometer
- Prometheus
- Grafana
- OpenTelemetry

Important metrics:

- HTTP p50/p95/p99/p99.9 latency
- route decision count by backend
- Redis/Caffeine hit ratio
- stale-read count and ratio
- PostgreSQL query latency/QPS
- replica lag
- Kafka consumer lag
- CPU, memory, disk, and network utilization
