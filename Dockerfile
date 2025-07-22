FROM node:24-alpine

WORKDIR /app
COPY . /app/

RUN npm install

RUN npm run build

RUN npm install -g serve

EXPOSE 5001

CMD ["serve", "-s", "dist", "-l", "5001"]

