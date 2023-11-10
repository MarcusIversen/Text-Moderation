FROM node:21
WORKDIR /app
COPY package*.json .
RUN npm i
COPY src ./src
COPY public ./public
COPY index.html ./index.html
EXPOSE 3000
CMD [ "npm" , "run" , "dev" ]
