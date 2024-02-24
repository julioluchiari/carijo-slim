PORT=9999

.PHONY: start

install:
	npm install

start:
	npm start

docker-up:
	docker compose up -d

docker-down:
	docker compose down

docker-restart: docker-down docker-up
