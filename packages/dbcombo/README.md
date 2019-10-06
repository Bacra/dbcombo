DBCombo
==================


[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][npm-url]
[![NPM License][license-image]][npm-url]


# Install
```
npm install dbcombo --save
```

# Useage

### Server in NodeJS

```
var DBCombo = require('dbcombo');
var expr = require('express');
expr().use(DBCombo({root: __dirname}));
```

### User in Browser

Use by Seajs plugin, See [DBComboClient](https://github.com/Bacra/node-dbcombo-client)


# Options

`root`
`enabledDBParser`
`enabledMultiParser`
`multiParser`
`dbParser`
`checker`
`dbFile`
`maxage`


## MultiFiles Options

`rootSyntax`
`fileSyntax`


## DBFiles Options

`dbreg`


## Checker Options

`limitFiles`
`limitExtname`
`enableMulitExtname`


## Combo Options

`root`
`fileStatCache`
`fileCache`
`separator`
`maxCacheFileSize`
`preReadFileIndex`


## DBFile Options

`dbCache`
`fileCache`


[npm-image]: https://img.shields.io/npm/v/dbcombo.svg
[downloads-image]: https://img.shields.io/npm/dm/dbcombo.svg
[npm-url]: https://www.npmjs.org/package/dbcombo
[license-image]: https://img.shields.io/npm/l/dbcombo.svg
