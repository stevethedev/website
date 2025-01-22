build:
	@cd web && npm run build

check:
	@cd web && npm run check

fix:
	@cd web && npm run fix

install:
	@cd web && npm ci

serve:
	docker-compose up --build

setup: install
	@git config core.hooksPath .githooks

test:
	@cd web && npm test
