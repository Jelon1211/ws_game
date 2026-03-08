FROM node:26

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 2567

CMD ["npm", "run", "start"]