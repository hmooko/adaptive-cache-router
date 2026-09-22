# 001 - PostgreSQL Primary Only

## Purpose

Establish the baseline before introducing Redis, Caffeine, a read replica, Kafka, or adaptive routing.

## Request path

```
k6 -> Spring Boot -> PostgreSQL Primary
```

## Workload

Run the same workload at several request rates, for example:

- 100 requests/sec
- 500 requests/sec
- 1,000 requests/sec

Increase the rate only while the k6 load-generator VM itself is not saturated.

## Metrics to record

- request rate
- p50 latency
- p95 latency
- p99 latency
- error rate
- achieved throughput
- Spring CPU / memory
- PostgreSQL CPU / memory
- PostgreSQL query rate

## Reproducibility

Record before each run:

- commit SHA
- VM resource allocation
- Java version
- PostgreSQL version
- Spring Boot version
- k6 parameters
- test duration
- warm-up duration

This experiment becomes the control used by later cache and routing experiments.
