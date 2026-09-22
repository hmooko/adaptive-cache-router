# Adaptive Cache Router

An experimental backend system that dynamically selects a read path based on latency, freshness, and system health.

## Research Question

Can an adaptive read-routing policy reduce tail latency and stale reads compared with a conventional cache-aside architecture under changing load and failure conditions?

## Planned Architecture

```
Client / k6
     |
     v
Spring Boot API
     |
     v
Adaptive Router
 |       |          |             |
 v       v          v             v
Caffeine Redis  PostgreSQL     PostgreSQL
(L1)     (L2)   Read Replica    Primary

                 +
               Kafka
        (cache invalidation)

Observability:
Micrometer -> Prometheus -> Grafana
Tracing:
OpenTelemetry
Fault injection:
Toxiproxy / tc netem
```

## Initial Stack

- Java 21
- Spring Boot
- PostgreSQL
- Redis
- Caffeine
- Apache Kafka
- Micrometer
- Prometheus
- Grafana
- OpenTelemetry
- k6
- Docker / Docker Compose
- Toxiproxy

## Development Roadmap

1. Build a basic Spring Boot + PostgreSQL API.
2. Add Redis cache-aside.
3. Add Caffeine local cache.
4. Add PostgreSQL read replica and measure replication lag.
5. Implement the adaptive read router.
6. Add controlled load tests with k6.
7. Add Kafka-based asynchronous cache invalidation.
8. Inject latency, failures, and consumer lag.
9. Compare baseline policies with the adaptive policy.
10. Record reproducible experiment results.

## Evaluation Metrics

- p50 / p95 / p99 / p99.9 latency
- throughput
- stale-read ratio
- SLO violation rate
- Redis / Caffeine hit ratio
- PostgreSQL QPS
- replica lag
- Kafka consumer lag
- CPU / memory / network utilization

## Repository Layout

```
app/          Spring Boot application
infra/        Docker and infrastructure configuration
monitoring/   Prometheus / Grafana configuration
load-test/    k6 workloads
experiments/  Reproducible experiment definitions and results
docs/         Architecture and research notes
```

## Status

Early research prototype.
