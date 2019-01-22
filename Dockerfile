FROM node:10
WORKDIR /athena
COPY package.json yarn.lock ./
RUN yarn install --silent
COPY . .
RUN yarn build
RUN rm -rf node_modules && \
        yarn install --production --silent

FROM node:10-alpine
WORKDIR /athena
COPY --from=0 /athena .
EXPOSE 6250
ENV NODE_ENV production
ENTRYPOINT [ "bin/standalone.js" ]
