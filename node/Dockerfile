FROM node:12

ENV DEBUG="users:*"
ENV PORT="3333"
ENV REST_LISTEN="0.0.0.0"

RUN mkdir -p /app
COPY package.json *.mjs *.js /app/
WORKDIR /app
RUN apt-get update -y  \
    && apt-get -y install curl python build-essential git ca-certificates  \
    && npm install --unsafe-perm

CMD npm run start
