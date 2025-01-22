build:
	@cd web && npm run build
	@cd api && cargo build

check:
	@cd web && npm run check
	@cd api && cargo check

fix:
	@cd web && npm run fix
	@cd api && cargo fmt

install:
	@cd web && npm ci
	@cd api && cargo build

serve:
	docker-compose up --build

setup: install
	@git config core.hooksPath .githooks

test:
	@cd web && npm test
	@cd api && cargo test
