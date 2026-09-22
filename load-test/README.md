# load-test

k6 workload definitions live here.

Initial workload families:

1. steady read traffic
2. Zipfian hot-key traffic
3. sudden traffic burst
4. mixed reads/writes
5. freshness-sensitive requests
6. Redis latency degradation
7. replica-lag degradation

Every workload should record its parameters so the benchmark can be reproduced.
