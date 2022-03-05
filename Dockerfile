FROM node:14-alpine

ENV NODE_PATH /node_modules
ENV PATH="${NODE_PATH}/.bin:${PATH}"
ENV NODE_ENV=development

WORKDIR /portal

COPY --chown=node:node package.json yarn.lock ./

RUN yarn install && \
  mv node_modules ..

EXPOSE 5368

EXPOSE 3000

CMD ["yarn", "start:dev"]
