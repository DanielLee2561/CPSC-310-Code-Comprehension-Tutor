FROM node:18 AS ui-build

WORKDIR /usr/app/client/
COPY client/package*.json ./
RUN npm install
COPY client/src/ ./src
COPY client/public/ ./public

RUN npm run build

FROM node:18 AS server-build

WORKDIR /usr/app/

COPY --from=ui-build /usr/app/client/build/ ./client/build
WORKDIR /usr/app/server/

COPY server/package*.json ./
RUN npm install

COPY server/index.js ./

COPY server/routes/ ./routes/
COPY server/data/ ./data/
COPY server/functions/ ./functions/

WORKDIR /usr/app/test/
COPY test/package*.json ./
COPY test/alltest.test.js ./
COPY test/frontend.test.js ./
COPY test/questions.test.js ./
COPY test/users.test.js ./

WORKDIR /usr/app/server/

ENV NODE_ENV=production

EXPOSE 5000

CMD [ "node", "index.js"]