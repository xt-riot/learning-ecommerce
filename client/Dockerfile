FROM node:latest

LABEL version="0.1"
LABEL description="Ecommerce app - frontend docker image"
LABEL maintainer = ["auto47088@uniwa.gr"]

WORKDIR /client

COPY package*.json ./

RUN npm install --global --unsafe-perm exp

COPY . .

EXPOSE ${CLIENT_PORT}

CMD ["npm", "run", "dev"]