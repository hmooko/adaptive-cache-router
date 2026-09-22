# app

Spring Boot application for the adaptive cache-routing prototype.

## Phase 1: PostgreSQL Primary Baseline

The first runnable baseline intentionally contains no Redis, Caffeine, Kafka, read replica, or adaptive router.

```
Client / k6 -> Spring Boot -> PostgreSQL Primary
```

Implemented endpoint:

```
GET /products/{productId}
```

Example response:

```json
{
  "id": 123,
  "name": "Product 123",
  "price": 13300,
  "updatedAt": "2026-09-23T00:00:00Z",
  "version": 0
}
```

The database is initialized by Flyway and seeded with 10,000 products.

## Requirements

- Java 21
- Gradle 8.14+ or Gradle 9.x
- PostgreSQL 18 for the supplied local/Phase-1 compose file

## Local Run

From the repository root:

```bash
docker compose -f infra/docker-compose.phase1.yml up -d
cd app
gradle bootRun
```

Then verify:

```bash
curl http://localhost:8080/products/123
curl http://localhost:8080/actuator/health
curl http://localhost:8080/actuator/prometheus
```

## VM1 -> VM4 Run

VM4 hosts PostgreSQL Primary. VM1 hosts the Spring application.

On VM4, start PostgreSQL using the Phase-1 compose file or an equivalent PostgreSQL installation.

On VM1:

```bash
export DB_URL=jdbc:postgresql://<VM4_PRIVATE_IP>:5432/adaptive_cache
export DB_USERNAME=<db-user>
export DB_PASSWORD=<db-password>

cd app
gradle bootRun
```

Do not use the example development password for the cloud VM. Store the real password outside Git.

## Configuration

Supported environment variables:

| Variable | Default | Purpose |
|---|---|---|
| `DB_URL` | `jdbc:postgresql://localhost:5432/adaptive_cache` | PostgreSQL JDBC URL |
| `DB_USERNAME` | `adaptive` | Database user |
| `DB_PASSWORD` | `adaptive` | Local development password |
| `DB_POOL_SIZE` | `10` | Hikari maximum pool size |
| `DB_MIN_IDLE` | `2` | Hikari minimum idle connections |
| `SERVER_PORT` | `8080` | HTTP port |

## Phase 1 Metrics

Actuator exposes:

- `/actuator/health`
- `/actuator/metrics`
- `/actuator/prometheus`

The PostgreSQL-only benchmark is defined in:

```
../load-test/baseline-primary.js
../experiments/001-primary-only/
```

## Later Responsibilities

After the baseline is measured, this application will gradually add:

- Redis L2 cache
- Caffeine L1 cache
- PostgreSQL primary/read-replica routing
- adaptive routing policy
- Kafka cache-invalidation consumer
- Micrometer/OpenTelemetry instrumentation
