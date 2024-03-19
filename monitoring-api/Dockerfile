FROM node:20.11.0-bookworm-slim
WORKDIR /monitoring-api
EXPOSE 3001
COPY ./dist .
RUN npm install
ENTRYPOINT node --env-file=./google.env main.js