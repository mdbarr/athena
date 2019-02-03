FROM node:10
WORKDIR /athena
COPY package.json yarn.lock ./
RUN yarn --silent install
COPY . .
RUN yarn build
ENV NODE_ENV=production
RUN rm -rf node_modules && \
        yarn --silent install --production=true

FROM node:10-alpine
WORKDIR /athena
COPY --from=0 /athena .
EXPOSE 6250
ENV NODE_ENV=production
ENTRYPOINT [ "bin/standalone.js" ]
