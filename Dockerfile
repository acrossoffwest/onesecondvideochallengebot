FROM node:18.0-alpine3.15

WORKDIR /var/www/html

ENV TELEGRAM_BOT_TOKEN=""
ENV S3_ACCESS_KEY_ID=""
ENV S3_SECRET_ACCESS_KEY=""
ENV S3_BUCKET=""
ENV S3_ENDPOINT=""

ENV DB_DIALECT="mysql"
ENV DB_HOST="localhost"
ENV DB_PORT="2206"
ENV DB_USERNAME="forge"
ENV DB_PASSWORD="forge"
ENV DB_DATABASE="forge"

RUN apk add ffmpeg

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]