FROM node:10
WORKDIR /athena
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build
RUN rm -rf node_modules && \
        yarn install --production

FROM node:10-alpine
WORKDIR /athena
COPY --from=0 /athena .
EXPOSE 6250
ENTRYPOINT [ "bin/standalone.js" ]
