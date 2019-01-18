FROM node:10
WORKDIR /athena
COPY package.json yarn.lock ./
RUN yarn install

FROM node:10-alpine
WORKDIR /athena
COPY --from=0 /athena/node_modules /athena/node_modules
COPY . .
RUN yarn build
EXPOSE 6250
ENTRYPOINT [ "bin/cli.js" ]
