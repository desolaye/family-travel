FROM node:23-bullseye

WORKDIR /app

RUN mkdir -p /app/db && chown node:node /app/db

COPY package.json package-lock.json ./
COPY tsconfig.json ./

RUN npm ci && npm rebuild better-sqlite3

USER node
COPY --chown=node:node . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "preview"]