# server
The server side of things

Based on:
- NodeJS
- Cassandra
- MAXMIND GeoLite2


## Install
**WARNING** this project is not production ready... use at your own risk

```
git clone https://github.com/mip-tv/server.git
cd server
npm install
```

docker-compose.yml
```
version: '3'

services:
    mip-tv:
        image: node:9
        restart: unless-stopped
        command: ['node', '/server']
        volumes:
        - ./server:/server:ro

    cassandra:
        image: cassandra:3
        restart: unless-stopped
        volumes:
        - ./cassandra:/var/lib/cassandra
```

Before you can use the server the cassandra database needs to be initalized with the commands in [cql/create-tables.cql]():
```
docker run --rm  -it --network <network_of_docker_compose> cassandra:3 cqlsh cassandra
```
