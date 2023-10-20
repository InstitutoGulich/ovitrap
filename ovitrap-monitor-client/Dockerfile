FROM node:16.1.0-stretch-slim as build-stage
LABEL Author="Pablo Zader pzader@conae.gov.ar"
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.13.12-alpine as production-stage

RUN rm -rf /usr/share/nginx/html/*

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf:ro

COPY --from=build-stage /app/dist /usr/share/nginx/html

#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]
