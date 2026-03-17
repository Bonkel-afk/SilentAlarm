FROM node:22-alpine

WORKDIR /app

# Abhängigkeiten zuerst (für besseres Layer-Caching)
COPY server/package*.json ./server/
RUN cd server && npm ci --omit=dev

# Quellcode kopieren (shared/ muss mit rein wegen relativer Imports)
COPY server/ ./server/
COPY shared/ ./shared/

WORKDIR /app/server

EXPOSE 3000

CMD ["npx", "ts-node", "src/app.ts"]
