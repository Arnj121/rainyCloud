FROM node:alpine

WORKDIR /app

COPY package*.json .

RUN npm install
COPY . .

EXPOSE 3000
EXPOSE 4000
RUN node initIP <oldip> <newip>
CMD npm run build && npm start