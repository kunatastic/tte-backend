FROM node:17-alpine

WORKDIR /usr

COPY package.json ./

COPY tsconfig.json ./

COPY src ./src

RUN yarn

RUN yarn build

EXPOSE 5000

CMD ["yarn","start"]
