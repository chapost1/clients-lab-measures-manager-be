FROM node:18.5 as base

WORKDIR /usr/src/app

COPY package*.json ./

FROM base as test
RUN npm ci
COPY . .
CMD [ "npm", "test" ]

FROM base as prod
RUN npm ci --omit=dev
COPY . .
EXPOSE 8080
ENTRYPOINT [ "node", "./src/index.js" ]