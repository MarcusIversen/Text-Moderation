FROM node:20
WORKDIR /app
COPY package*.json .
RUN npm i
COPY src ./src
EXPOSE 3000
CMD [ "npm" , "start" ]
