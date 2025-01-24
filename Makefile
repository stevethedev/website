build:
	@cd web && npm run build
	@cd api && cargo build

check:
	@npx prettier --check "!api/**/*" "!web/**/*" .
	@cd web && npm run check
	@cd api && cargo check

fix:
	@npx prettier --write "!api/**/*" "!web/**/*" .
	@cd web && npm run fix
	@cd api && cargo fmt

install:
	@cd web && npm ci
	@cd api && cargo build

schema:
	@node --trace-deprecation ./scripts/schema.js

serve:
	docker-compose up --build --watch

setup: install
	@git config core.hooksPath .githooks
	@npm install --no-save quicktype prettier

test:
	@cd web && npm test
	@cd api && cargo test

.PHONY: schema
