FROM node:18

WORKDIR /app

copy . .
EXPOSE 4000
RUN npm install

CMD node app
