# app

Spring Boot application for the adaptive cache-routing prototype.

Planned responsibilities:

- Product/read API
- Caffeine L1 cache
- Redis L2 cache
- PostgreSQL primary/read-replica access
- Routing-policy implementation
- Kafka cache-invalidation consumer
- Micrometer/OpenTelemetry instrumentation

The first implementation milestone should use only PostgreSQL + Redis. Add the remaining components incrementally so each experiment has a clear baseline.
