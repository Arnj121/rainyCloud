FROM node:alpine

WORKDIR /app

COPY package*.json .

RUN npm install
COPY . .

EXPOSE 3000
EXPOSE 4000

CMD npm build && npm start