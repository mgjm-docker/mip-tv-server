# server
The server side of [mip-tv](https://github.com/mip-tv).

Based on:
- NodeJS
- Cassandra
- MAXMIND GeoLite2


## Install
**WARNING** this project is not production ready... use at your own risk

To run this server you need docker and docker-compose.

docker-compose.yml
``` yml
version: '3'

services:
    mip-tv:
        image: mgjm/mip-tv-server:latest
        restart: unless-stopped
        volumes:
        - ./server:/server:ro
        ports:
        - '8080:8080'

    cassandra:
        image: cassandra:3
        restart: unless-stopped
        volumes:
        - ./cassandra:/var/lib/cassandra
```

Before you can use the server the cassandra database needs to be initalized with the commands in [cql/create-tables.cql](cql/create-tables.cql):
```
docker run --rm  -it --network <network_of_docker_compose> cassandra:3 cqlsh cassandra
cqlsh> // copy the commands from cql/create-tables.cql
```

The server listens to port 8080 and you should place a ssl enabled reverse proxy in front of the server (e.g. nginx with a letsencrypt certificate).
