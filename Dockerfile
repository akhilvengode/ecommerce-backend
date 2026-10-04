FROM node:24

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 5000

CMD ["node", "dist/server.js"]
