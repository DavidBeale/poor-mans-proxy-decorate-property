
module.exports = function decorateProperty(proxy, target, handler, prop) {
	var meta = getPropertyMeta(target, prop);

	delete meta.value;
	
	var writable = meta.writable;
	delete meta.writable;


	// Get Handler
	if (handler && handler.get && typeof handler.get === 'function') {
		meta.get = function() {
			var result = handler.get.call(handler, target, prop, this);
			
			if (!writable && result !== target[prop]) {
				throw new TypeError('\'get\' on proxy: property \'' + prop + '\' is a read-only and non-configurable data property on the proxy target but the proxy did not return its actual value (expected \'' + target[prop] + '\' but got \'' + result + '\')');
			}

			return result;
		};
	} else {
		meta.get = function() {
			return target[prop];
		};
	}

	
	if (handler && handler.set && typeof handler.set === 'function') {
		meta.set = function(value) {
			handler.set.call(handler, target, prop, value, this);
		};
	} else {
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
}



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