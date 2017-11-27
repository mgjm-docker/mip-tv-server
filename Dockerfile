FROM node

RUN mkdir -p /mip-tv/server
WORKDIR /mip-tv/server
RUN useradd -d /mip-tv mip-tv

ADD cql cql
ADD geoip geoip
ADD lib lib
ADD package.json .
ADD index.js .
ADD LICENSE .
ADD package-lock.json .
ADD test test

RUN ls
RUN ls ..

RUN chown -R mip-tv /mip-tv

USER mip-tv

RUN npm install

CMD node index.js
