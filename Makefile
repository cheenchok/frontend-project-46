make lint:
	npx eslint .

make test: 
	NODE_OPTIONS=--experimental-vm-modules npx jest