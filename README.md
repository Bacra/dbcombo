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

### In NodeJS

```
var DBComboClient = require('dbcombo-client');
console.log(DBComboClient.stringify([0, 31, 93, 92, 94]));
console.log(DBComboClient.parse('Y31000000Y1Y1'));

// Y31000000Y1Y1
// [0, 31, 92, 93, 94]
```

### Browser for Seajs

```
<script src="node_modules/dbcombo-client/dist/seajs-plugin.js"></script>
```

Seajs Config

```
seajs.config(
{
	DBComboFileIndex: {},		// uri => index
	DBComboFile: 'http://www.example.com/db.js',		// dbfile uri
	DBComboExcludes: function(uri){return false}		// RegExp / Function
});
```

Combo Uri Exapmle

```
http://www.example.com/db.js/Yg0W21X/W35X/W35X/W35X/W35X.js
```

Url parse server power by [DBCombo](https://github.com/Bacra/node-dbcombo)


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
