DBComboClient
==================

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][npm-url]
[![NPM License][license-image]][npm-url]


# Install

```shell
npm install dbcombo-client --save
```

# Useage

### In NodeJS

```javascript
var DBComboClient = require('dbcombo-client');
console.log(DBComboClient.stringify([0, 31, 93, 92, 94]));
console.log(DBComboClient.parse('Y31000000Y1Y1'));

// Y31000000Y1Y1
// [0, 31, 92, 93, 94]
```

### Browser for Seajs

```html
<script src="node_modules/dbcombo-client/dist/seajs-plugin.js"></script>
```

Seajs Config

```javascript
seajs.config(
{
    DBComboFileIndex: {},    // uri => {index, deps, file}
    DBComboFile: 'https://www.example.com/db.js',    // dbfile uri, append merge key width it
    DBComboFileExtname: '_db',    // ext dbfile uri, default "_db", set false to ignore
                        // Append extname for `db.js`.
                        // Do not use `db.js` directly for combo uri.
                        // A file can not be an folder and file simultaneously.

    DBComboExcludes: function(uri){return false},    // RegExp / Function
    DBComboDelayRequest: true,    // delay request for merge more deps
    DBComboDelayRequestMaxUri: 30,    // not merge when over max length
});
```

Combo Uri Exapmle

```url
https://www.example.com/db.js_db/Yg0W21X/W35X/W35X/W35X/W35X/V.js
```

Url parse server power by [DBCombo](https://github.com/Bacra/dbcombo/tree/master/packages/dbcombo)


[npm-image]: https://img.shields.io/npm/v/dbcombo-client.svg
[downloads-image]: https://img.shields.io/npm/dm/dbcombo-client.svg
[npm-url]: https://www.npmjs.org/package/dbcombo-client
[license-image]: https://img.shields.io/npm/l/dbcombo-client.svg
