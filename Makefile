lint:
	npx eslint .

test: 
	NODE_OPTIONS=--experimental-vm-modules npx jest

publish:
	npm publish --dry-run
