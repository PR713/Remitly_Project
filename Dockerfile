FROM node:16

WORKDIR /app

COPY package*.json ./


RUN npm install --include=dev

COPY . .

RUN npx tsc

EXPOSE 8080

CMD ["node", "dist/server.js"]