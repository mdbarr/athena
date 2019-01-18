FROM node:10-alpine

WORKDIR /athena

COPY package.json yarn.lock ./

RUN yarn install && \
    yarn cache clean && \
    npm install -g forever

COPY . .

RUN yarn build

EXPOSE 6250

CMD [ "forever", "./server/athena.js" ]
