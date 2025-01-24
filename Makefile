build: setup schema install
	@cd web && npm run build
	@cd api && cargo build

check: setup schema install
	@npx prettier --check "!api/**/*" "!web/**/*" .
	@cd web && npm run check
	@cd api && cargo check

fix: setup schema
	@npx prettier --write "!api/**/*" "!web/**/*" .
	@cd web && npm run fix
	@cd api && cargo fmt

install: setup
	@cd web && npm install
	@cd api && cargo build

schema: setup
	@node --trace-deprecation ./scripts/schema.js

serve: setup schema install
	docker-compose up --build --watch

setup:
	@git config core.hooksPath .githooks
	@npm install --no-save quicktype prettier

test: setup schema install
	@cd web && npm test
	@cd api && cargo test

.PHONY: schema
