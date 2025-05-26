FROM node:lts-alpine AS builder

LABEL stage="builder"

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build


FROM node:lts-alpine AS production

LABEL stage="production"

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/prisma ./prisma

COPY --from=builder /usr/src/app/.env ./.env

COPY --from=builder /usr/src/app/dist ./dist

COPY --from=builder /usr/src/app/node_modules ./node_modules

EXPOSE 9000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]

