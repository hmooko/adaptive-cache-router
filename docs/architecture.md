# Architecture

## Goal

Route each read request to the cheapest backend that can satisfy its latency and freshness requirements.

## Candidate read paths

1. Caffeine local cache
2. Redis
3. PostgreSQL read replica
4. PostgreSQL primary

## Routing signals

The router may use:

- observed backend latency
- cache entry age
- request freshness budget
- Redis health
- PostgreSQL replica lag
- Kafka consumer lag
- queue/load indicators

## Initial policy

Begin with deterministic rules before introducing a scoring model.

Example:

1. If a local-cache entry is within the freshness budget, use it.
2. Otherwise, if Redis is healthy and its entry is within the freshness budget, use Redis.
3. Otherwise, if replica lag is acceptable, use the read replica.
4. Fall back to the primary.

This simple policy becomes the first adaptive baseline and keeps early experiments interpretable.
