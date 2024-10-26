FROM node:alpine

WORKDIR /app

COPY package*.json .
RUN npm install


EXPOSE
CMD node app