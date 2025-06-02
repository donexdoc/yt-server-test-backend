FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk add --no-cache curl && npm install

COPY . .

EXPOSE 3000 

CMD [ "node", "main.js" ]   