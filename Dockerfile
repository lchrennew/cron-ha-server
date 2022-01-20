FROM node:17.2.0-alpine3.12
ENV ROOT=/app/
WORKDIR $ROOT
COPY package.json .env ${ROOT}
COPY src ${ROOT}src
RUN ["npm", "i"]

CMD ["npx", "nodemon", "src/index.js"]
