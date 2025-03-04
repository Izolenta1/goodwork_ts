FROM node:22-alpine

WORKDIR /app

EXPOSE 3000

CMD npm run start

COPY package.json package-lock.json /app

RUN npm install

COPY . /app

RUN npm run build