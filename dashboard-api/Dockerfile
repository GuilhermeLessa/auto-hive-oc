FROM node:20.11.0-bookworm-slim
WORKDIR /dashboard-api
EXPOSE 3000
COPY ./dist .
RUN npm install
ENTRYPOINT node --env-file=./google.env main.js