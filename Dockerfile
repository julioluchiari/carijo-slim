FROM node:20.11.1-alpine as builder

WORKDIR /app

COPY --chown=node:node package*.json ./

ENV HUSKY=0
RUN npm install --omit=dev

COPY --chown=node:node . .

FROM node:20.11.1-alpine

RUN mkdir -p /home/app && chown -R node:node /home/app
WORKDIR /home/app

# for health check purposes
RUN apk add curl

COPY --from=builder --chown=node:node /app/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /app/src/ ./src/

USER node

ENV PORT=8080
EXPOSE 8080

CMD ["node", "src/index.js"]
