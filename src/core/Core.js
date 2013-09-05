/** TODO */

(function() {
    'use strict';

    this.Milk = {
        version: '%version%',
        build: '%build%',
        polyfill: false
    };

    /** Window object */
    var window = this;

    /** Document object */
    var document = this.document;

    document.window = window;

    if (!document.html) {
        document.html = document.documentElement;
    }

    if (!document.head) {
        document.head = document.getElementsByTagName('head')[0];
    }

    /** Native objects */
    var Function = this.Function, Array = this.Array, Object = this.Object,
        String = this.String, Date = this.Date, RegExp = this.RegExp,
        Number = this.Number, Boolean = this.Boolean, Error = this.Error,
        Math = this.Math;

    /*------------------------------------ Functions ------------------------------------*/

    /**
     * Determines the item type and returns it as a string.
     *
     * @param {*} item
     * @returns {String}
     */
    function typeOf(item) {
        var type = (typeof item);

        if (item === null || type === 'undefined') {
            return 'null';

        } else if (item.$family) {
            return item.$family();

        } else if (item.nodeName) {
            if (item.nodeType === 1) {
                return 'element';

            } else if (item.nodeType === 3) {
                return (/\S/.test(item.nodeValue)) ? 'textnode' : 'whitespace';
            }
        } else if (typeof item.length === 'number') {
            if ('callee' in item) {
                return 'arguments';

            } else if ('item' in item) {
                return 'collection';
            }
        }

        return type;
    }

    /**
     * Verify that item is an instance of a specific object.
     * Will take into account extended and implemented classes.
     *
     * @param {Object} item
     * @param {Object} object
     * @returns {boolean}
     */
    function instanceOf(item, object) {
        if (typeOf(item) === 'null') {
            return false;
        }

        if (object.prototype.isPrototypeOf(item)) {
            return true;
        }

        var constructor = item.constructor || item.prototype.constructor;

        while (constructor) {
            if (constructor === object) {
                return true;
            }

            constructor = constructor.parent;
        }

        return (item instanceof object);
    }

    /**
     * Converts a hexadecimal value (either an array or hash) into an array of RGB values.
     *
     * @param {String|Array} hex
     * @returns {Array}
     */
    function hexToRgb(hex) {
        var type = typeOf(hex);

        if (type === 'string') {
            var match = hex.match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})$/);

            if (match) {
                hex = match.splice(1);
            } else {
                return null;
            }
        } else if (type !== 'array') {
            return null;
        }

        if (hex.length !== 3) {
            return null;
        }

        return hex.map(function(value) {
            if (value.length === 1) {
                value += value;
            }

            return parseInt(value, 16);
        });
    }

    /**
     * Converts an array of RGB values into an array of hex values or a hexcode.
     *
     * @param {Array} rgb
     * @param {boolean} toCode - Return as a hexcode #xxxxxx
     * @returns {Array|String}
     */
    function rgbToHex(rgb, toCode) {
        if (rgb.length < 3) {
            return null;
        }

        // If an alpha value is passed
        if (rgb.length === 4 && rgb[3] === 0 && toCode) {
            return 'transparent';
        }

        var hex = [];

        for (var i = 0; i < 3; i++){
            var bit = (rgb[i] - 0).toString(16);

            hex.push((bit.length === 1) ? '0' + bit : bit);
        }

        if (toCode) {
            return '#' + hex.join('');
        }

        return hex;
    }

    this.typeOf = typeOf;
    this.instanceOf = instanceOf;
    this.hexToRgb = hexToRgb;
    this.rgbToHex = rgbToHex;

    /*------------------------------------ Overloading ------------------------------------*/

    /**
     * Allows a function that accepts a key value argument `fn(key, value)`,
     * to also accept an object of key value pairs `fn(values)`.
     *
     * @param {boolean} forceObject - Forces the key to always be an object
     * @returns {Function}
     */
    Function.prototype.overloadSetter = function(forceObject) {
        var self = this;

        return function(a, b) {
            if (!a) {
                return this;
            }

            // Loop over an object of key values
            if (forceObject || typeof a !== 'string') {
                for (var k in a) {
                    self.call(this, k, a[k]);
                }

            // Standard key value argument call
            } else {
                self.call(this, a, b);
            }

            return this;
        };
    };

    /**
     * Allows a function that accepts a single key `fn(key)`,
     * to also accept an array of keys `fn(keys)`.
     *
     * @param {boolean} forceArray - Forces the key to always be an array
     * @returns {Function}
     */
    Function.prototype.overloadGetter = function(forceArray) {
        var self = this;

        return function(a) {
            var args, result = {};

            if (typeof a !== 'string') {
                args = a;

            } else if (arguments.length > 1) {
                args = arguments;

            } else if (forceArray) {
                args = [a];
            }

            // Return an object of key values
            if (args) {
                for (var i = 0, l = args.length; i < l; i++) {
                    result[args[i]] = self.call(this, args[i]);
                }

            // Or a single value
            } else {
                result = self.call(this, a);
            }

            return result;
        };
    };

    /**
     * Extends the object with new properties or methods,
     * but will not alter the prototype.
     *
     * @type {Function}
     * @param {String} key
     * @param {*} {value}
     * @returns {self}
     */
    Function.prototype.extend = function(key, value) {
        this[key] = value;

        return this;
    }.overloadSetter();

    /**
     * Extends the object's prototype with new properties or methods.
     *
     * @type {Function}
     * @param {String} key
     * @param {*} {value}
     * @returns {self}
     */
    Function.prototype.implement = function(key, value) {
        this.prototype[key] = value;

        return this;
    }.overloadSetter();

    /**
     * Extends the object's prototype with new properties or methods only if it does not already exist.
     *
     * @type {Function}
     * @param {String} key
     * @param {*} {value}
     * @returns {self}
     */
    Function.prototype.polyfill = function(key, value) {
        if (!this.prototype[key]) {
            this.implement(key, value);
        }

        return this;
    }.overloadSetter();

    /*------------------------------------ Types ------------------------------------*/

    /**
     * Creates a new global type class and provides an interface for types to implement.
     * Provides support for comparing objects (types), grouping by family, and permitting inheritance.
     *
     * @param {String} name
     * @param {Object} [object] - Some types don't have built-in natives
     * @returns {Object}
     */
    function Type(name, object) {
        if (name) {
            var lowerName = name.toLowerCase();

            // Add an is*() function to the global Type object
            Type['is' + name] = function(item) {
                return (typeOf(item) === lowerName);
            };

            // Store the family so it can be reflected
            if (object) {
                object.prototype.$family = (function() {
                    return function() {
                        if (name === 'Number') {
                            // Fix issues with NaN
                            return isFinite(this) ? 'number' : 'null';
                        }

                        return lowerName;
                    };
                })();
            }
        }

        if (!object) {
            return null;
        }

        object.extend(this);

        return object;
    }

    /**
     * Static function for verifying that a type object is enumerable.
     *
     * @param {*} item
     * @returns {boolean}
     */
    Type.isEnumerable = function(item) {
        return (item && typeof item.length === 'number' && Object.prototype.toString.call(item) !== '[object Function]');
    };

    this.Type = Type;

    /**
     * Works like `Function.implement()` but only used to set methods.
     * Also takes into account hidden and protected methods by aborting the implement process.
     *
     * @param {String} name
     * @param {Function} method
     * @returns {self}
     */
    function implement(name, method) {
        if (method && method.$hidden) {
            return this;
        }

        // Fetch internal object hooks or create them
        var hooks = this.$hooks || [],
            hook;

        // Loops through the hooked functions and mirror functionality
        for (var i = 0, l = hooks.length; i < l; i++) {
            hook = hooks[i];

            if (typeOf(hook) === 'type') {
                implement.call(hook, name, method);
            } else {
                hook.call(this, name, method);
            }
        }

        var previous = this.prototype[name];

        if (!previous || !previous.$protected) {
            this.prototype[name] = method;
        }

        if (!this[name] && typeof method === 'function') {
            extend.call(this, name, function(item) {
                return method.apply(item, slice.call(arguments, 1));
            });
        }

        return this;
    }

    /**
     * Works like `Function.extend()` but only used to set methods.
     * Also takes into account hidden and protected methods by aborting the extend process.
     *
     * @param {String} name
     * @param {Function} method
     * @returns {self}
     */
    function extend(name, method) {
        if (method && method.$hidden) {
            return this;
        }

        var previous = this[name];

        if (!previous || !previous.$protected) {
            this[name] = method;
        }

        return this;
    }

    /**
     * Define an alias for an existing method by providing the method name.
     *
     * @param {String} name
     * @param {String} existing
     * @returns {self}
     */
    function alias(name, existing) {
        if (!this.prototype[name] && this.prototype[existing]) {
            implement.call(this, name, this.prototype[existing]);
        }

        return this;
    }

    /**
     * Defines a function hook to mirror to other types.
     *
     * @param {Function} hook
     * @returns {self}
     */
    function mirror(hook) {
        if (!this.$hooks) {
            this.$hooks = [];
        }

        this.$hooks.push(hook);

        return this;
    }

    // Add these methods to the prototype
    Type.implement({
        implement: implement.overloadSetter(),
        extend: extend.overloadSetter(),
        polyfill: Function.prototype.polyfill,
        alias: alias.overloadSetter(),
        mirror: mirror
    });

    // Create the base type using itself
    new Type('Type', Type);

    // Create DOM types
    this.Window = new Type('Window', function(){});
    this.Document = new Type('Document', function(){});

    // Create native types
    new Type('String', String);
    new Type('Array', Array);
    new Type('Number', Number);
    new Type('Function', Function);
    new Type('RegExp', RegExp);
    new Type('Date', Date);
    new Type('Boolean', Boolean);
    new Type('Error', Error);

    // Create object-less types
    new Type('Object');
    new Type('WhiteSpace');
    new Type('TextNode');
    new Type('Collection');
    new Type('Arguments');
    new Type('Math');

    // Mirror functions to the window and doc objects
    Window.mirror(function(name, method){
        window[name] = method;
    });

    Document.mirror(function(name, method){
        document[name] = method;
    });

    /*------------------------------------ Inherit ------------------------------------*/

    // Extend native objects if lodash or underscore exist
    var vendor = this._ || this.lodash || this.underscore || null;

    if (vendor) {
        var mapping = [
            [
                [Array],
                ['compact', 'difference', 'drop', 'findIndex', 'first', 'flatten', 'filter', 'head', 'indexOf', 'initial', 'intersection', 'last', 'lastIndexOf', 'map', 'range', 'rest', 'sortedIndex', 'tail', 'take', 'union', 'uniq', 'unique', 'unzip', 'without', 'zip', 'zipObject']
            ], [
                [Array, Object, String],
                ['all', 'any', 'at', 'collect', 'contains', 'countBy', 'detect', 'each', 'every', 'find', 'findWhere', 'foldl', 'foldr', 'forEach', 'groupBy', 'inject', 'invoke', 'max', 'min', 'pluck', 'reduce', 'reduceRight', 'reject', 'select', 'shuffle', 'size', 'some', 'sortBy', 'toArray', 'where']
            ], [
                [Function],
                ['bind', 'compose', 'createCallback', 'debounce', 'defer', 'delay', 'memoize', 'once', 'partial', 'partialRight', 'throttle']
            ], [
                [Object],
                ['assign', 'defaults', 'extend', 'findKey', 'forIn', 'forOwn', 'functions', 'has', 'invert', 'keys', 'merge', 'methods', 'omit', 'pairs', 'pick', 'transform', 'values']
            ], [
                [String],
                ['escape', 'unescape', 'template']
            ], [
                [Number],
                ['times']
            ], [
                [Array, Object, String, Number],
                ['isEmpty', 'isEqual', 'isUndefined', 'isNull', 'toString', 'valueOf', 'clone']
            ]
        ];

        // Loop over each mapping and extend the native prototypes
        var a, b, c, map, proto, func, slice = Array.prototype.slice;

        for (a = 0; (map = mapping[a]); a++) {
            for (b = 0; (proto = map[0][b]); b++) {
                for (c = 0; (func = map[1][c]); c++) {
                    if (!vendor[func]) {
                        continue;
                    }

                    // Skip if the function already exists
                    // We don't wont to cause collisions with built-ins or user defined
                    if (proto[func] || proto.prototype[func]) {
                        continue;
                    }

                    // Objects can only use static methods
                    // Applying to the prototype disrupts object literals
                    if (proto === Object) {
                        proto[func] = vendor[func];
                        continue;
                    }

                    // Extend the prototype by calling lodash in a closure
                    // Prepend the "this" value to the beginning of the arguments
                    // This should allow for method chaining
                    proto.implement(func, (function(func) {
                        return function() {
                            var args = slice.call(arguments) || [];
                                args.unshift(this);

                            return vendor[func].apply(this, args);
                        };
                    }(func)));
                }
            }
        }
    }

    /*------------------------------------ Functions ------------------------------------*/

    /**
     * Convert the passed value to a function if it is not one.
     *
     * @param {*} item
     * @returns {Function}
     */
    Function.from = function(item) {
        return (typeof item === 'function') ? item : function() {
            return item;
        };
    };

    Function.implement({

        /**
         * Hide a function from being being overwritten in the prototype.
         *
         * @returns {Function}
         */
        hide: function() {
            this.$hidden = true;

            return this;
        },

        /**
         * Protect a function from being called publicly.
         * Can only be called within the class or object itself.
         *
         * @returns {Function}
         */
        protect: function() {
            this.$protected = true;

            return this;
        },

        /**
         * Return all the direct method names for this current object.
         *
         * @returns {Array}
         */
        methods: function() {
            var methods = [], self = this;

            Object.getOwnPropertyNames(this).forEach(function(prop) {
                if (typeof self[prop] === 'function') {
                    methods.push(prop);
                }
            });

            return methods.sort();
        },

        /**
         * Return all the direct property names for this current object.
         *
         * @returns {Array}
         */
        properties: function() {
            var props = [], self = this;

            Object.getOwnPropertyNames(this).forEach(function(prop) {
                if (typeof self[prop] !== 'function') {
                    props.push(prop);
                }
            });

            return props.sort();
        }
    });

    /*------------------------------------ Arrays ------------------------------------*/

    /**
     * Convert the passed value to an array if it is not one.
     *
     * @param {*} item
     * @returns {Array}
     */
    Array.from = function(item) {
        if (!item) {
            return [];
        }

        var type = typeOf(item);

        if (type !== 'string' && Type.isEnumerable(item)) {
            return (type === 'array') ? item : Array.prototype.slice.call(item);
        }

        return [item];
    };

    /*------------------------------------ Numbers ------------------------------------*/

    /**
     * Convert the passed value to a number if it is not one.
     *
     * @param {*} item
     * @returns {Number}
     */
    Number.from = function(item) {
        var number = parseFloat(item);

        return isFinite(number) ? number : null;
    };

    /**
     * Generate a random number between the minimum and maximum boundaries.
     *
     * @param {Number} min
     * @param {Number} max
     * @returns {Number}
     */
    Number.random = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    // Apply Math functions to the Number type
    ['abs', 'acos', 'asin', 'atan', 'atan2', 'ceil', 'cos', 'exp', 'floor', 'log', 'max', 'min', 'pow', 'sin', 'sqrt', 'tan'].forEach(function(method) {
        if (!Number[method]) {
            Number.implement(method, function() {
                return Math[method].apply(null, [this].concat(Array.from(arguments)));
            });
        }
    });

    /*------------------------------------ Strings ------------------------------------*/

    /**
     * Convert the passed value to a string if it is not one.
     *
     * @param {*} item
     * @returns {String}
     */
    String.from = function(item) {
        return item + '';
    };

    /*------------------------------------ Objects ------------------------------------*/

    // Set manually since Object doesn't inherit from Function
    Object.extend = extend.overloadSetter();

    /**
     * Works exactly like `Type.alias` except it doesn't modify the prototype.
     *
     * @type {Function}
     * @param {String} name
     * @param {String} existing
     */
    Object.alias = function(name, existing) {
        if (!this[name] && this[existing]) {
            this.extend(name, this[existing]);
        }
    }.overloadSetter();

    /**
     * Works exactly like `Type.polyfill` except it doesn't modify the prototype.
     *
     * @type {Function}
     * @param {String} name
     * @param {Function} value
     */
    Object.polyfill = function(key, value) {
        if (!this[key]) {
            this.extend(key, value);
        }
    }.overloadSetter();

}).call(this);
