FROM node:23-bullseye

WORKDIR /app

RUN mkdir -p /app/build /app/db && \
    chown -R node:node /app/build /app/db

COPY --chown=node:node package.json package-lock.json ./
COPY --chown=node:node tsconfig.json ./

RUN npm ci

USER node

COPY --chown=node:node . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "preview"]