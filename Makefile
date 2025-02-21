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

install: setup schema
	@cd web && npm install
	@cd api && cargo build

schema: setup
	@node ./scripts/schema.mjs

serve: setup schema install
	docker compose up --watch --build

rebuild\:%:
	docker compose up -d --no-deps --build $*

restart\:%:
	docker compose restart $*

setup:
	@git config core.hooksPath .githooks
	@npm init -f
	@npm install -D quicktype-core prettier ts-morph

update-sql-cache:
	@docker compose up --wait database
	@cd api && cargo sqlx prepare -D 'postgres://user:password@localhost/db'

test: setup schema install
	@cd web && npm test
	@cd api && cargo test

.PHONY: serve-rebuild
