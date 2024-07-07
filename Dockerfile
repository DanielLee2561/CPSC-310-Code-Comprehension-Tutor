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

COPY server/index.js ./

WORKDIR /usr/app/server/routes/
COPY server/routes/ollama.js ./
COPY server/routes/questions.js ./
COPY server/routes/users.js ./

WORKDIR /usr/app/server/data/
COPY server/data/user.json ./
COPY server/data/question.json ./

WORKDIR /usr/app/server/


ENV NODE_ENV=production

EXPOSE 5000

CMD [ "node", "index.js"]
