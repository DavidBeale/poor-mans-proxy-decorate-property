
'use strict';

module.exports = function decorateProperty(proxy, target, handler, prop) {
    var meta = getPropertyMeta(target, prop);

    var writable = meta.writable;
    delete meta.writable;

    var hasValue = (meta.value !== undefined);
    var hasFunctionValue = hasValue && (typeof(meta.value) === 'function');

    // Get Handler
    if (handler && handler.get && typeof handler.get === 'function') {
        if (hasValue) {
            delete meta.value;

            meta.get = function() {
                var result = handler.get.call(handler, target, prop, this);

                if (!writable && result !== target[prop]) {
                    throw new TypeError('\'get\' on proxy: property \'' + prop + '\' is a read-only and non-configurable data property on the proxy target but the proxy did not return its actual value (expected \'' + target[prop] + '\' but got \'' + result + '\')');
                }

                return result;
            };
        }
    } else if (hasValue && !hasFunctionValue) {
        delete meta.value;

        meta.get = function() {
            return target[prop];
        };
    }

    // Set Handler
    if (handler && handler.set && typeof handler.set === 'function') {
        if (hasValue && !hasFunctionValue) {
            delete meta.value;

            meta.set = function(value) {
                handler.set.call(handler, target, prop, value, this);
            };
        }
    } else if (hasValue && !hasFunctionValue) {
        delete meta.value;

        if (writable) {
            meta.set = function(value) {
                target[prop] = value;
            };
        } else {
            meta.set = function(value) {
                throw new TypeError('\'set\' on proxy: property \'' + prop + '\' is a read-only and non-configurable data property on the proxy target');
            };
        }
    }

    Object.defineProperty(proxy, prop, meta);
};



function getPropertyMeta(target, prop) {
    var meta = Object.getOwnPropertyDescriptor(target, prop);

    if (meta) {
        return meta;
    }

    var proto = Object.getPrototypeOf(target);

    if (proto) {
        return getPropertyMeta(proto, prop);
    }

    return {};
}
