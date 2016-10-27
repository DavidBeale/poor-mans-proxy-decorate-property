# poor-mans-proxy-decorate-property [![Build Status](https://travis-ci.org/bealearts/poor-mans-proxy-decorate-property.svg)](https://travis-ci.org/bealearts/poor-mans-proxy-decorate-property) [![npm version](https://badge.fury.io/js/poor-mans-proxy-decorate-property.svg)](http://badge.fury.io/js/poor-mans-proxy-decorate-property)

Decorate an Object's property for Proxy interception


## Install
```shell
npm install poor-mans-proxy-decorate-property --save
```


## Usage
```js
var decorateProperty = require('poor-mans-proxy-decorate-property');

var target = {
	name: 'Obj'
};

var proxy = {};

decorateProperty(proxy, target, {
	get: function(target, prop, receiver) {
		console.log(prop, 'accessed');
		return target[prop];
	}
}, 'name');

console.log(proxy.name);

// : name accessed
// : Obj

```

## Test

```shell
npm install
npm test
```
