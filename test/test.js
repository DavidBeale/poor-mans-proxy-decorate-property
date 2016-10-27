'use strict';

// NOTE: Most Tests are in the parent project poor-mans-proxy

var decorateProperty = require('..');

/*jshint -W079 */
var expect = require('chai').expect;


describe('poor-mans-proxy-decorate-property', function() {

    it('should capture getting a property', function() {

        var test;

        var obj = {
            value: 5
        };

        var proxy = {};

        decorateProperty(proxy, obj, {
            get: function(target, prop) {
                test = prop;
                return target[prop];
            }
        }, 'value');

        expect(proxy.value).to.equal(5);
        expect(test).to.equal('value');

    });

    it('should capture setting a property', function() {

        var test;

        var obj = {
            value: 5
        };

        var proxy = {};

        decorateProperty(proxy, obj, {
            set: function(target, prop, value) {
                test = prop;
                return target[prop]= value;
            }
        }, 'value');

        proxy.value = 7;

        expect(obj.value).to.equal(7);
        expect(test).to.equal('value');

    });

});
