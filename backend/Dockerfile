# backend/Dockerfile

# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /usr/src/app/backend

COPY package*.json ./
# Installe uniquement les dépendances de production
RUN npm ci --omit=dev

COPY . .

# Stage 2: Production
FROM node:18-alpine
WORKDIR /usr/src/app/backend

# Copier les node_modules et le code source du stage précédent
COPY --from=builder /usr/src/app/backend/node_modules ./node_modules
COPY --from=builder /usr/src/app/backend/server.js ./server.js

EXPOSE 5001
CMD [ "node", "server.js" ]