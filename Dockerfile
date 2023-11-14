FROM node:alpine

WORKDIR /usr/src/app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 5000

VOLUME [ "/app/node_modules" ]

CMD [ "npm", "run", "start"]
