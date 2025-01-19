build: setup check
	@echo No build

check: setup
	@echo No checks

setup: setup.prepare

setup.prepare:
	@git config core.hooksPath .githooks

test: setup
	@echo No tests
