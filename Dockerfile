FROM node:20.11.1 as builder

WORKDIR /app

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

RUN npm run build

FROM node:20.11.1

RUN mkdir -p /home/app && chown -R node:node /home/app
WORKDIR /home/app

# for health check purposes
RUN apt update && apt install -y curl

COPY --from=builder --chown=node:node /app/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /app/dist/ ./dist/

USER node

ENV PORT=8080
EXPOSE 8080

CMD ["node", "dist/index.js"]

