build:
	@cd web && npm run build

check:
	@cd web && npm run check

fix:
	@cd web && npm run fix

install:
	@cd web && npm install

setup:
	@git config core.hooksPath .githooks

test:
	@cd web && npm test
