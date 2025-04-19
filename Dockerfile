FROM node:23-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY tsconfig.json ./
COPY . .

RUN npm ci && npm run build

EXPOSE 3000

CMD ["npm", "run", "preview"]
