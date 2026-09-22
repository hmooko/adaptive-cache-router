# Adaptive Cache Router

An experimental backend system that dynamically selects a read path based on latency, freshness, and system health.

## Research Question

Can an adaptive read-routing policy reduce tail latency and stale reads compared with a conventional cache-aside architecture under changing load and failure conditions?

## Planned Architecture

```
                         VM8
                          k6
                           |
                    workload generation
                           |
                           v

        +--------------------------------------+
        |          System Under Test           |
        |                                      |
        |   VM1 Spring A       VM2 Spring B    |
        |   + Caffeine         + Caffeine      |
        |          \            /              |
        |           \          /               |
        |             VM3 Redis                |
        |                |                     |
        |          VM5 PostgreSQL              |
        |          Read Replica                |
        |                |                     |
        |          VM4 PostgreSQL              |
        |             Primary                  |
        |                |                     |
        |             VM6 Kafka                |
        |          cache invalidation          |
        +--------------------------------------+
                           |
                        metrics
                           |
                           v
                         VM7
              Prometheus + Grafana
```

The experimental environment is intentionally split into the **System Under Test** and separate **experiment tools**.

### System Under Test

| VM | Role | Initial Resource Budget |
|---|---|---:|
| VM1 | Spring Boot A + Caffeine | 1 CPU / 1.5 GB RAM |
| VM2 | Spring Boot B + Caffeine | 1 CPU / 1.5 GB RAM |
| VM3 | Redis | 1 CPU / 1 GB RAM |
| VM4 | PostgreSQL Primary | 1.5 CPU / 3 GB RAM |
| VM5 | PostgreSQL Read Replica | 1.5 CPU / 3 GB RAM |
| VM6 | Apache Kafka | 1 CPU / 2 GB RAM |

### Experiment Tools

| VM | Role | Initial Resource Budget |
|---|---|---:|
| VM7 | Prometheus + Grafana | 0.5 CPU / 2 GB RAM |
| VM8 | k6 load generator | 0.5 CPU / 2 GB RAM |

The resource budgets above are the initial target configuration. Before the final benchmark, actual CPU and memory usage will be measured and the limits may be adjusted while keeping all compared policies on the same fixed configuration.

## Why Monitoring and Load Generation Are Separate

The load generator is kept outside the System Under Test so that generating traffic does not consume CPU or memory from the application being benchmarked.

Prometheus and Grafana are also placed on a separate VM to reduce measurement interference with Redis, PostgreSQL, Kafka, and the application servers.

This separation makes it easier to attribute latency or throughput changes to the routing policy rather than to the benchmark tooling itself.

## Fault Injection

Network faults are injected on the dependency path rather than on the k6 VM.

Planned tools:

- Linux `tc netem`
- Toxiproxy when a proxy-based experiment is more convenient

Example scenarios:

- Redis +20 / +50 / +100 / +200 ms latency
- Redis packet loss
- PostgreSQL replica lag
- Kafka consumer lag
- dependency timeout
- hot-key traffic burst

This allows controlled and repeatable failure experiments even when all VMs are hosted by the same cloud provider and region.

## Read Path

Each application instance has its own Caffeine local cache. The Adaptive Router chooses among:

1. Caffeine local cache
2. Redis
3. PostgreSQL read replica
4. PostgreSQL primary

The router may use signals such as:

- request freshness budget
- cache entry age
- observed backend latency
- Redis health
- PostgreSQL replica lag
- Kafka consumer lag
- queue/load indicators

Kafka is used later in the project for asynchronous cache invalidation after data changes.

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
- Linux tc/netem
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
