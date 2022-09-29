# Node Version
FROM node:16-alpine

WORKDIR /usr/src/app

RUN npm install -g npm@8.19.2

COPY . .

RUN npm install

EXPOSE 5000

USER node

CMD [ "pm2-runtime", "npm", "--", "start" ]
