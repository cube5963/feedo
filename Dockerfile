FROM node:22.17

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG BACKEND_JWT_SECRET
ENV BACKEND_JWT_SECRET=${JWT_SECRET}

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]