FROM node:20-alpine3.21 AS base

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

USER node

EXPOSE 3000
ENV NODE_ENV=production
CMD [ "npm", "start" ]