FROM node:18-alpine AS base

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

RUN npm install

# Copy the rest of the application code
COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]