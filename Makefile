install:
	npm install

start:
	npm start

docker-stats:
	docker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"

docker-up:
	docker compose up -d

docker-down:
	docker compose down

docker-restart: docker-down docker-up

prd/docker-build:
	docker compose -f docker-compose.prd.yml build --no-cache

prd/docker-up:
	docker compose -f docker-compose.prd.yml up -d

prd/docker-down:
	docker compose -f docker-compose.prd.yml down

prd/docker-restart: prd/docker-down prd/docker-up

stress-test: prd/docker-restart
	sleep 5
	sh ./gatling/run.sh
