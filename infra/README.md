# infra

Infrastructure definitions for the experimental cluster.

Planned components:

- application instances
- Redis
- PostgreSQL primary
- PostgreSQL read replica
- Kafka
- Toxiproxy or Linux tc/netem fault injection

Start with Docker Compose locally. Move the final benchmark environment to separate cloud VMs so network behavior can be measured independently.
