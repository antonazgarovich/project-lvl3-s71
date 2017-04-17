o = '.'

install:
		npm install
run:
		npm run babel-node -- ./src/bin/page-loader.js $(o)

publish:
		npm publish

lint:
		npm run eslint .

test:
		npm test

test-watch:
		npm run test-watch
