FROM node:21
WORKDIR /app
COPY package*.json .
RUN npm i
COPY src ./src
COPY .env ./.env
EXPOSE 3000
CMD [ "npm" , "start" ]
