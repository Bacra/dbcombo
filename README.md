DBComboClient
==================


[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Appveyor Status][appveyor-image]][appveyor-url]
[![Coveralls][coveralls-image]][coveralls-url]
[![NPM License][license-image]][npm-url]


# Install
```
npm install dbcombo-client --save
```

# Useage

NodeJS
```
var DBComboClient = require('dbcombo-client');
console.log(DBComboClient.stringify([0, 31, 92, 93, 94]));
// print Y31000000Y1Y1
```

Browser for Seajs
```
<script src="node_modules/dbcombo-client/dist/seajs-plugin.js"></script>
```



[npm-image]: http://img.shields.io/npm/v/dbcombo-client.svg
[downloads-image]: http://img.shields.io/npm/dm/dbcombo-client.svg
[npm-url]: https://www.npmjs.org/package/dbcombo-client
[travis-image]: http://img.shields.io/travis/Bacra/node-dbcombo-client/master.svg?label=linux
[travis-url]: https://travis-ci.org/Bacra/node-dbcombo-client
[appveyor-image]: https://img.shields.io/appveyor/ci/Bacra/node-dbcombo-client/master.svg?label=windows
[appveyor-url]: https://ci.appveyor.com/project/Bacra/node-dbcombo-client
[coveralls-image]: https://img.shields.io/coveralls/Bacra/node-dbcombo-client.svg
[coveralls-url]: https://coveralls.io/github/Bacra/node-dbcombo-client
[license-image]: http://img.shields.io/npm/l/dbcombo-client.svg
