# Stage 1
FROM node:16-alpine as server
WORKDIR /usr/src/app
RUN npm install -g npm@8.19.2
RUN npm install pm2 -g
COPY . .
# RUN mv .env.development .env
RUN npm install
EXPOSE 5000
RUN chmod -R 777 /usr/src/app
# RUN chmod -R 777 /var/www/almacen/server/logs
USER node

CMD [ "pm2-runtime", "npm", "--", "start" ]
