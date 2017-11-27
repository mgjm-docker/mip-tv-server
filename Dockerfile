FROM node:9

ADD . /mip-tv/server

WORKDIR /mip-tv/server

RUN npm install && \
	rm -r /root/.npm

USER nobody

EXPOSE 8080

CMD node .
