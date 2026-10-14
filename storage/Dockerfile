FROM node:22.23.3-alpine3.24

WORKDIR /app

RUN apk add --no-cache curl

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

EXPOSE 5123

CMD ["node", "server.js"]
