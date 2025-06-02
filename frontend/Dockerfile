# frontend/Dockerfile

# Stage 1: Build React App
FROM node:18-alpine AS build
WORKDIR /usr/src/app/frontend

COPY package*.json ./
RUN npm install

COPY . ./
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Supprimer le contenu par défaut de Nginx
RUN rm -rf ./*

# Copier les fichiers buildés du stage précédent
COPY --from=build /usr/src/app/frontend/build .

# Copier la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]