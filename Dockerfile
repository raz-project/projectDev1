FROM node:16-slim

WORKDIR /app

COPY package.json /app/
RUN npm install

COPY app.js /app/
COPY web /app/web

EXPOSE 80

CMD ["node", "app.js"]
