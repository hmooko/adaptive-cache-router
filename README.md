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

### Experimental Cluster Resources

| VM | Role | CPU | RAM | Disk |
|---|---|---:|---:|---:|
| VM1 | Spring Boot A + Caffeine | 1 vCPU | 1536 MB | 12 GiB |
| VM2 | Spring Boot B + Caffeine | 1 vCPU | 1536 MB | 12 GiB |
| VM3 | Redis | 1 vCPU | 1024 MB | 10 GiB |
| VM4 | PostgreSQL Primary | 1 vCPU | 3072 MB | 22 GiB |
| VM5 | PostgreSQL Read Replica | 1 vCPU | 3072 MB | 22 GiB |
| VM6 | Apache Kafka | 1 vCPU | 2048 MB | 16 GiB |
| VM7 | Prometheus + Grafana | 1 vCPU | 2048 MB | 16 GiB |
| VM8 | k6 load generator | 1 vCPU | 2048 MB | 10 GiB |
| **Total** |  | **8 vCPU** | **16384 MB (16 GiB)** | **120 GiB** |

VM1 through VM6 form the **System Under Test**. VM7 and VM8 are separate experiment tools used for observation and load generation.

The final benchmark should keep this allocation fixed across all compared routing policies. CPU, memory, disk type, and VM placement should be recorded with every experiment so performance differences can be attributed to the routing policy rather than to infrastructure changes.

> **Storage constraint:** this 8-VM layout assumes the cloud provider allows disks smaller than 20 GiB. If the minimum disk size is 20 GiB per VM, 8 VMs would require 160 GiB and therefore exceed the 120 GiB storage quota. In that case, consolidate the topology into fewer VMs before running the final benchmark.

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

- [x] Build a basic Spring Boot + PostgreSQL API.
- [x] Add the PostgreSQL-only k6 baseline workload.
- [ ] Measure and record the Primary-only baseline.
- [ ] Add Redis cache-aside.
- [ ] Add Caffeine local cache.
- [ ] Add PostgreSQL read replica and measure replication lag.
- [ ] Implement the adaptive read router.
- [ ] Add Kafka-based asynchronous cache invalidation.
- [ ] Inject latency, failures, and consumer lag.
- [ ] Compare baseline policies with the adaptive policy.
- [ ] Record reproducible experiment results.

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

Phase 1 implemented: Spring Boot -> PostgreSQL Primary baseline.

Next step: deploy VM1/VM4, verify metrics, and record the first k6 benchmark before adding Redis.
