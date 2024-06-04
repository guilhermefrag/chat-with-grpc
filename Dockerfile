FROM node:21

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install pm2 -g

EXPOSE 8082 8083

CMD ["pm2-runtime", "start", "ecosystem.config.js"]
