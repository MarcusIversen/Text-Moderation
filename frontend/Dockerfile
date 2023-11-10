FROM node:20
WORKDIR /app
COPY package*.json .
RUN npm i
COPY src ./src
COPY public ./public


RUN ls -lla

EXPOSE 3000
CMD [ "npm" , "start" ]
