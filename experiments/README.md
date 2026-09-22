# experiments

Each experiment should be reproducible and self-contained.

Suggested layout:

```
experiments/
  001-cache-aside-baseline/
    README.md
    config/
    scripts/
    summary.csv
  002-redis-latency/
  003-replica-lag/
  004-kafka-consumer-lag/
```

For every experiment, record:

- hypothesis
- hardware/VM allocation
- software versions
- workload parameters
- fault-injection parameters
- baseline policy
- treatment policy
- number of repetitions
- raw-data location
- summarized metrics
- plots
- interpretation
- limitations
