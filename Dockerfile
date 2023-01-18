# Stage 1
FROM node:16-alpine as server

WORKDIR /app/server

RUN npm install -g npm@latest
RUN npm install pm2 -g

COPY package.json ./
COPY config ./config
COPY controllers ./controllers
COPY email ./email
COPY logs ./logs
COPY middleware ./middleware
COPY models ./models
COPY public ./public
COPY routes ./routes
COPY seeders ./seeders
COPY services ./services
COPY static ./static
COPY utils ./utils
COPY index.js ./
COPY .sequelizerc ./
COPY .env.development ./.env

RUN npm install

EXPOSE 5010

RUN chmod -R 777 /app/server
# RUN chmod -R 777 /var/www/almacen/server/logs
USER node

CMD [ "pm2-runtime", "npm", "--", "start" ]
