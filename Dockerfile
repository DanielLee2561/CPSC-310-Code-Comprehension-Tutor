FROM node:16 AS ui-build
 
WORKDIR /usr/app/client/
COPY client/package*.json ./
RUN npm install
COPY client/src/ ./src
COPY client/public/ ./public

RUN npm run build

FROM node:16 AS server-build

WORKDIR /usr/app/

COPY --from=ui-build /usr/app/client/build/ ./client/build
WORKDIR /usr/app/server/

COPY server/package*.json ./
RUN npm install

COPY server/server.js ./

WORKDIR /usr/app/server/data/
COPY server/data/users.json ./
COPY server/data/questions.json ./

WORKDIR /usr/app/server/


ENV NODE_ENV=production

EXPOSE 5000

CMD [ "node", "server.js"]
