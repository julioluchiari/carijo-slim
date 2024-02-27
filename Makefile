help:
	@echo "install - install npm packages"
	@echo "start - start the server"
	@echo "lint - run prettier"
	@echo "lint-fix - run prettier and fix the issues"
	@echo "test-e2e - run the end to end tests"
	@echo "health - check the health of the server"
	@echo "docker-stats - check the stats of the docker containers"
	@echo "docker-up - start the docker containers"
	@echo "docker-down - stop the docker containers"
	@echo "docker-restart - run up and down for the docker containers"
	@echo "prd/docker-build - build the docker containers for production"
	@echo "prd/docker-up - start the docker containers for production"
	@echo "prd/docker-down - stop the docker containers for production"
	@echo "prd/docker-restart - run up and down for the docker containers for production"
	@echo "stress-test - run the stress test"

install:
	npm install

start:
	npm start

lint:
	npm run lint

lint-fix:
	npm run lint:fix

test-e2e: docker-restart
	npm run test

health:
	curl http://localhost:3000/health

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
