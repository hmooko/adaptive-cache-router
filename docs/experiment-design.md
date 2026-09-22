# Experiment Design

## Primary research question

Can adaptive read routing reduce tail latency and stale-read violations compared with fixed cache-aside routing under changing load and failure conditions?

## Baselines

- PostgreSQL primary only
- Redis cache-aside
- fixed local-cache -> Redis -> DB routing
- latency-aware routing
- freshness-aware routing

## Proposed treatment

Adaptive routing using both performance and freshness signals.

## Independent variables

- request rate
- key popularity/skew
- Redis latency
- Redis packet loss
- cache TTL
- read-replica lag
- Kafka consumer lag
- freshness budget
- read/write ratio

## Dependent variables

- p50/p95/p99/p99.9 latency
- throughput
- stale-read ratio
- freshness-SLO violation rate
- availability/error rate
- backend QPS
- CPU/memory/network utilization

## Methodology notes

Run a warm-up period before measurement. Repeat each condition multiple times, report variance/confidence intervals where practical, and keep VM resource limits and software versions fixed across compared policies.
