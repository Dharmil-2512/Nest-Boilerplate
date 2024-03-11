FROM node:18

WORKDIR /app

COPY package.json /app

COPY . /app

ENV NODE_ENV=development

RUN npm install

RUN npm run build

CMD ["node", "dist/main.js"]