/** TODO */

(function() {
    'use strict';

    this.Milk = {
        version: '%version%',
        build: '%build%'
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
        Number = this.Number, Boolean = this.Boolean;

    /*------------------------------------ Vendors ------------------------------------*/

    /**
     * Mapping of functions in Milk that need to be required in vendors.
     * Will need to polyfill any missing functions.
     *
     * Argument Legend:
     *  a = array, f = function, b = scope bind, i = integer, s = string, o = object,
     *  k = key, v = value, ~ = boolean or random arg, . = repeating arg
     *
     *                          Lodash              Underscore          Sugar
     *  Array
     *      each(f, b)          each(a, f, b)       each(a, f, b)       each(f, ~, ~)
     *      forEach(f, b)       forEach(a, f, b)    forEach(a, f, b)    forEach(f, b)
     *      clone()             x                   x                   clone()                     !!!
     *      every(f, b)         every(a, f, b)      every(a, f, b)      every(f, b)
     *      filter(f, b)        filter(a, f, b)     filter(a, f, b)     filter(f, b)
     *      indexOf(v, i)       indexOf(a, v, i)    indexOf(a, v, ~)    indexOf(v, i)
     *      map(f, b)           map(a, f, b)        map(a, f, b)        map(f, b)
     *      some(f, b)          some(a, f, b)       some(a, f, b)       some(f, b)
     *      clean()             compact(a)          compact(a)          compact()
     *      invoke(s)           invoke(a, s, .)     invoke(a, s, .)     x
     *      associate(a)        object(a, a)        object(a, a)        zip(a)
     *      link(o)             x                   x                   x
     *      contains(v, i)      contains(a, v, i)   contains(a, v)      x
     *      append(a)           union(a, a)         union(a, a)         add(v)                      !!!
     *      getLast()           last()              last()              last(i)
     *      getRandom()         x                   x                   sample(i)
     *      include(v)          include(a, v, i)    include(a, v, i)    x                           !!!
     *      combine(a)          union(a, a)         union(a, a)         union(a)                    !!!
     *      erase(v)            x                   x                   remove()
     *      empty()             x                   x                   x
     *      flatten()           flatten(a, ~, f, b) flatten(a, ~)       flatten(i)                  !!!
     *      pick()              x                   x                   x
     *      hexToRgb()          x                   x                   x
     *      rgbToHex()          x                   x                   x
     *  Object
     *      each(o, f, b)       each(o, f, b)       each(o, f, b)       each(f, ~, ~)
     *      forEach(o, f, b)    forEach(o, f, b)    forEach(o, f, b)    forEach(f, b)
     *      clone(o)            clone(o)            clone(o)            clone(o, ~)
     *      merge(o, .)         merge(o, ., f, b)   x                   merge(o, o, ~, ~)           !!!
     *      append(o)           assign(o, o)        extend(o, o)        x
     *      subset(o, k)        pick(o, f, b)       pick(o, k*)         select(o, k)
     *      map(o, f, b)        map(o, f, b)        map(o, f, b)        map(f, b)
     *      filter(o, f, b)     filter(o, f, b)     filter(o, f, b)     filter(f, b)
     *      every(o, f, b)      every(o, f, b)      every(o, f, b)      every(f, b)
     *      some(o, f, b)       some(o, f, b)       some(o, f, b)       some(f, b)
     *      keys(o)             keys(o)             keys(o)             keys(o, f)
     *      values(o)           values(o)           values(o)           values(o, f)
     *      getLength(o)        size(o)             size(o)             size(o)
     *      keyOf(o, v)         findKey(o, f, b)    x                   x
     *      contains(o, v)      contains(o, v, i)   contains(o, v, i)   x
     *      toQueryString(o, ~) x                   x                   toQueryString(o, ~)
     *  Number
     *      random(min, max)    random(min, max)    random(min, max)    random(min, max)
     *      limit(min, max)     x                   x                   clamp(min, max)
     *      round(i)            x                   x                   round(i)
     *      times(f, b)         times(i, f, b)      times(i, f, b)      times(f)
     *      toFloat()           x                   x                   x
     *      toInt()             x                   x                   x
     *  Date
     *      now()               x                   x                   now()
     *  Function
     *      bind(b)             bind(f, b, .)       bind(f, b, .)       bind(b, .)
     *      pass(a, b)          compose(f, f)       compose(f, f)       x
     *      delay(i, b, a)      delay(f, i, ~)      delay(f, i, ~)      delay(i, .)                 !!!
     *      periodical(i, b, a) x                   x                   every(i, .)
     *      attempt(a, b)       x                   x                   x
     *  String
     *      contains(v, i)      contains(s, v, i)   contains(s, v, i)   has(v)
     *      test(r, p)          x                   x                   x
     *      trim()              x                   x                   x
     *      clean()             x                   x                   compact()
     *      camelCase()         x                   x                   camelize()
     *      hyphenate()         x                   x                   dasherize()
     *      capitalize()        x                   x                   capitalize()
     *      escapeRegExp()      x                   x                   escapeRegExp()
     *      toInt()             x                   x                   toNumber()
     *      toFloat()           x                   x                   toFloat()
     *      hexToRgb()          x                   x                   x
     *      rgbToHex()          x                   x                   x
     *      substitute()        x                   x                   assign(.)
     *      uniqueID()          uniqueId(s)         uniqueId(s)         x
     */

    /*------------------------------------ Functions ------------------------------------*/

    /**
     * Determines the item type and returns it as a string.
     *
     * @param {*} item
     * @returns {String}
     */
    function typeOf(item) {
        if (item === null) {
            return 'null';

        } else if (item.$family) {
            return item.$family;

        } else if (item.nodeName) {
            if (item.nodeType === 1) {
                return 'element';

            } else if (item.nodeType === 3) {
                return /\S/.test(item.nodeValue) ? 'textnode' : 'whitespace';
            }
        } else if (typeof item.length === 'number') {
            if ('callee' in item) {
                return 'arguments';

            } else if ('item' in item) {
                return 'collection';
            }
        }

        return (typeof item);
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
        if (!item) {
            return false;
        }

        if (object.prototype.isPrototypeOf(item)) {
            return true;
        }

        var constructor = item.$constructor || item.constructor;

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

            return value.toInt(16);
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

    Function.implement({

        /**
         * Hide a function from being visible.
         *
         * @returns {*}
         */
        hide: function() {
            this.$hidden = true;

            return this;
        },

        /**
         * Protect a function from being called publicly.
         * Can only be called within the class or object itself.
         *
         * @returns {*}
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

            return methods;
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

            return props;
        }
    });

    // Set for object since it doesn't extend function
    Object.extend = extend.overloadSetter();

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
                    if (name === 'Number') {
                        // Fix issues with NaN
                        return isFinite(this) ? 'number' : 'null';
                    }

                    return lowerName;
                })();
            }
        }

        if (!object) {
            return null;
        }

        object.extend(this);
        object.$constructor = Type;
        object.prototype.$constructor = object;

        return object;
    }

    this.Type = Type;

    /**
     * Static function for verifying that a type object is enumerable.
     *
     * @param {*} item
     * @returns {boolean}
     */
    Type.isEnumerable = function(item) {
        return (item && typeof item.length === 'number' && Object.prototype.toString.call(item) !== '[object Function]');
    };

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
        implement.call(this, name, this.prototype[existing]);

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

    // Create object-less types
    new Type('Object');
    new Type('WhiteSpace');
    new Type('TextNode');
    new Type('Collection');
    new Type('Arguments');

    // Mirror functions to the window and doc objects
    Window.mirror(function(name, method){
        window[name] = method;
    });

    Document.mirror(function(name, method){
        document[name] = method;
    });

    /*------------------------------------ Polyfills ------------------------------------*/

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
            return (type === 'array') ? item : Array.prototype.slice.call(item)
        }

        return [item];
    };

    Array.implement({

        clone: function() {
            var i = this.length, clone = new Array(i), value;

            while (i--) {
                value = this[0];

                switch (typeOf(value)) {
                    case 'array':
                        value = value.clone();
                    break;
                    case 'object':
                        value = Object.clone(value);
                    break;
                }

                clone[i] = value;
            }

            return clone;
        }

    });

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
     * Convert the passed value to a string if it is not one.
     *
     * @param {*} item
     * @returns {String}
     */
    String.from = function(item) {
        return item + '';
    };

    Object.extend({

        reset: function(object) {
            var key, value;

            for (key in object) {
                value = object[key];

                switch (typeOf(value)) {
                    case 'object':
                        var F = function() {};
                            F.prototype = value;

                        object[key] = Object.reset(new F());
                    break;
                    case 'array':
                        object[key] = value.clone();
                    break;
                }
            }

            return object;
        }

    });

    // Extend native objects if lodash or underscore exist
    var vendor = this._ || this.lodash || this.underscore || null;

    if (vendor) {
        var mapping = [
            [
                [Array],
                ['compact', 'difference', 'drop', 'findIndex', 'first', 'flatten', 'head', 'indexOf', 'initial', 'intersection', 'last', 'lastIndexOf', 'range', 'rest', 'sortedIndex', 'tail', 'take', 'union', 'uniq', 'unique', 'unzip', 'without', 'zip']
            ], [
                [Array, Object, String],
                ['all', 'any', 'at', 'collect', 'contains', 'countBy', 'detect', 'each', 'every', 'filter', 'find', 'findWhere', 'foldl', 'foldr', 'forEach', 'groupBy', 'include', 'inject', 'invoke', 'map', 'max', 'min', 'pluck', 'reduce', 'reduceRight', 'reject', 'select', 'shuffle', 'size', 'some', 'sortBy', 'toArray', 'where']
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
                ['isEmpty', 'isEqual', 'isUndefined', 'isNull', 'toString', 'valueOf']
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
                        }
                    }(func)));
                }
            }
        }
    }
}).call(this);
