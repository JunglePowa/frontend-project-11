publish:
	npm publish --dry-run.
install:
	npm ci

build:
	npm run build

run:
	npm run serve

dev:
	npm run dev

lint:
	npx eslint .