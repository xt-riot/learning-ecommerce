FROM node:latest

LABEL version="0.1"
LABEL description="Ecommerce app - backend docker image"
LABEL maintainer = ["karachristos@outlook.com"]

WORKDIR /server

COPY package*.json ./

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}
ARG SERVER_PORT
ENV SERVER_PORT=${SERVER_PORT}

RUN npm install

COPY . .

EXPOSE ${SERVER_PORT}

CMD ["node", "index.js"]