FROM node:18-alpine3.17 AS builder

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

# hosting 

FROM nginx:1.22.1-alpine AS production

WORKDIR /usr/share/nginx/html

RUN rm -rf *

COPY --from=builder /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

ENTRYPOINT ["nginx", "-g", "daemon off;"]