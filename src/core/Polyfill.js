// TODO

(function() {
    this.Milk.polyfill = true;

    /**
     * Mapping of functions in Milk that need to be required in vendors.
     * Will need to polyfill any missing functions.
     * EMS5 methods are not being reproduced as it will use built-ins.
     *
     * Argument Legend:
     *  a = array, f = function, b = scope bind, i = integer, s = string, o = object,
     *  k = key, v = value, ~ = boolean or random arg, . = repeating arg
     *
     *                          Lodash              Underscore          Sugar
     *  Array
     *      clone()             clone(a)            clone(a)            clone()
     *      clean()             compact(a)          compact(a)          compact()
     *      invoke(s)           invoke(a, s, .)     invoke(a, s, .)     x
     *      associate(a)        object(a, a)        object(a, a)        zip(a)
     *      link(o)             x                   x                   x
     *      contains(v, i)      contains(a, v, i)   contains(a, v)      x
     *      append(a)           union(a, a)         union(a, a)         add(v)
     *      getLast()           last()              last()              last(i)
     *      getRandom()         x                   x                   sample(i)
     *      include(v)          include(a, v, i)    include(a, v, i)    x
     *      combine(a)          union(a, a)         union(a, a)         union(a)
     *      erase(v)            x                   x                   remove()
     *      empty()             x                   x                   x
     *      flatten()           flatten(a, ~, f, b) flatten(a, ~)       flatten(i)
     *      pick()              x                   x                   x
     *      hexToRgb()          x                   x                   x
     *      rgbToHex()          x                   x                   x
     *  Object
     *      clone(o)            clone(o)            clone(o)            clone(o, ~)
     *      merge(o, .)         merge(o, ., f, b)   x                   merge(o, o, ~, ~)
     *      append(o)           assign(o, o)        extend(o, o)        x
     *      subset(o, k)        pick(o, f, b)       pick(o, k*)         select(o, k)
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
     *  Function
     *      bind(b)             bind(f, b, .)       bind(f, b, .)       bind(b, .)
     *      pass(a, b)          x                   x                   x
     *      delay(i, b, a)      delay(f, i, ~)      delay(f, i, ~)      delay(i, .)
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

    Function.polyfill({

        /**
         * Returns a closure with arguments and bind scope for a existing function.
         *
         * @param {Array} args
         * @param {Object} bind
         * @returns {Function}
         */
        pass: function(args, bind) {
            var self = this;

            if (args !== null) {
                args = Array.from(args);
            }

            return function() {
                return self.apply(bind, args || arguments);
            };
        },

        /**
         * Execute the function after specific milliseconds.
         * Can optionally accept arguments and scope binding.
         *
         * @param {Number} delay
         * @param {Object} bind
         * @param {Array} args
         * @returns {Object}
         */
        delay: function(delay, bind, args) {
            return setTimeout(this.pass((!args ? [] : args), bind), delay);
        },

        /**
         * Execute the function every specific millisecond interval.
         *
         * @param {Number} periodical
         * @param {Object} bind
         * @param {Array} args
         * @returns {Object}
         */
        periodical: function(periodical, bind, args) {
            return setInterval(this.pass((!args ? [] : args), bind), periodical);
        }

    });

    /*------------------------------------ Arrays ------------------------------------*/

    Array.polyfill({

        /**
         * Associate the current array with an array of keys to return a literal object.
         *
         * @param {Array} keys
         * @returns {Object}
         */
        associate: function(keys) {
            var obj = {}, length = Math.min(this.length, keys.length);

            for (var i = 0; i < length; i++) {
                obj[keys[i]] = this[i];
            }

            return obj;
        },

        /**
         * Return the average of the values sum.
         *
         * @returns {Number}
         */
        average: function() {
            return this.length ? (this.sum() / this.length) : 0;
        },

        /**
         * Remove all null and undefined values.
         *
         * @returns {Array}
         */
        clean: function() {
            return this.filter(function(item) {
                return (typeOf(item) !== 'null');
            });
        },

        /**
         * Empty the array and reset the length.
         *
         * @returns {Array}
         */
        empty: function() {
            this.length = 0;

            return this;
        },

        /**
         * Remove all values that strict equal the passed in value.
         *
         * @param {*} item
         * @returns {Array}
         */
        erase: function(item) {
            for (var i = this.length; i--;) {
                if (this[i] === item) {
                    this.splice(i, 1);
                }
            }

            return this;
        },

        /**
         * Return a random value from the array.
         *
         * @returns {*}
         */
        getRandom: function() {
            return this.length ? this[Number.random(0, this.length - 1)] : null;
        },

        /**
         * Insert a value into the array if it does not already exist.
         *
         * @param {*} item
         * @returns {Array}
         */
        include: function(item) {
            if (!this.contains(item)) {
                this.push(item);
            }

            return this;
        },

        /**
         * Return the first non-null value in the array.
         * If none are found, return null.
         *
         * @returns {*}
         */
        pick: function() {
            for (var i = 0, l = this.length; i < l; i++) {
                if (this[i] !== null) {
                    return this[i];
                }
            }

            return null;
        },

        /**
         * Return the sum of all values in the array.
         *
         * @returns {Number}
         */
        sum: function() {
            var result = 0, l = this.length;

            if (l) {
                while (l--) {
                    result += this[l];
                }
            }

            return result;
        }

    });

    // Legacy and compatibility
    Array.alias({
        append: 'union',
        getLast: 'last',
        combine: 'union'
    });

    /*------------------------------------ Numbers ------------------------------------*/

    Number.polyfill({

        /**
         * Limit the number between a minimum and maximum boundary.
         *
         * @param {Number} min
         * @param {Number} max
         * @returns {Number}
         */
        limit: function(min, max) {
            return Math.min(max, Math.max(min, this));
        },

        /**
         * Round the number using a precision.
         *
         * @param {Number} precision
         * @returns {Number}
         */
        round: function(precision) {
            precision = Math.pow(10, precision || 0).toFixed(precision < 0 ? -precision : 0);

            return Math.round(this * precision) / precision;
        },

        /**
         * Trigger a function to execute equal to the size of the number.
         *
         * @param {Function} fn
         * @param {Function} bind
         * @returns {Number}
         */
        times: function(fn, bind) {
            for (var i = 0; i < this; i++) {
                fn.call(bind, i, this);
            }

            return this;
        },

        /**
         * Convert the number to a float.
         *
         * @returns {Number}
         */
        toFloat: function() {
            return parseFloat(this);
        },

        /**
         * Convert the float or number to a number using the defined base.
         *
         * @param {Number} base
         * @returns {Number}
         */
        toInt: function(base) {
            return parseInt(this, base || 10);
        }

    });

    // Legacy and compatibility
    Number.alias({
        limit: 'clamp'
    });

    /*------------------------------------ Strings ------------------------------------*/

    // Legacy and compatibility
    String.alias({
        uniqueID: 'uniqueId'
    });

    /*------------------------------------ Objects ------------------------------------*/

    var hasOwnProperty = Object.prototype.hasOwnProperty;

    Object.polyfill({

        /**
         * Clean all null or empty values from the object.
         * If a function is provided, use that for filtering.
         *
         * @param {Object} object
         * @param {Function} method
         * @returns {Object}
         */
        cleanValues: function(object, method) {
            method = method || function(value) {
                return (typeOf(value) !== 'null');
            };

            for (var key in object) {
                if (!method(object[key])) {
                    delete object[key];
                }
            }

            return object;
        },

        /**
         * Remove a property from the object as long as it's not inherited.
         *
         * @param {Object} object
         * @param {String} key
         * @returns {Object}
         */
        erase: function(object, key) {
            if (hasOwnProperty.call(object, key)) {
                delete object[key];
            }

            return object;
        },

        /**
         * Filter values using the callback function and return a new object containing the filtered values.
         *
         * @param {Object} object
         * @param {Function} fn
         * @param {Function} bind
         * @returns {Object}
         */
        filter: function(object, fn, bind) {
            var results = {};

            for (var key in object) {
                var value = object[key];

                if (hasOwnProperty.call(object, key) && fn.call(bind, value, key, object)) {
                    results[key] = value;
                }
            }

            return results;
        },

        /**
         * Return a value from an object using a dot notated or array path.
         *
         * @param {Object} source
         * @param {String|array} parts
         * @returns {*}
         */
        getFromPath: function(source, parts) {
            if (typeof parts === 'string') {
                parts = parts.split('.');
            }

            for (var i = 0, l = parts.length; i < l; i++) {
                if (hasOwnProperty.call(source, parts[i])) {
                    source = source[parts[i]];
                } else {
                    return null;
                }
            }

            return source;
        },

        /**
         * Return the key name based on the value using strict equality.
         *
         * @param {Object} object
         * @param {*} value
         * @returns {String}
         */
        keyOf: function(object, value) {
            for (var key in object) {
                if (hasOwnProperty.call(object, key) && object[key] === value) {
                    return key;
                }
            }

            return null;
        },

        /**
         * Apply a function to every member of the object and return a new object.
         *
         * @param {Object} object
         * @param {Function} fn
         * @param {Function} bind
         * @returns {Object}
         */
        map: function(object, fn, bind) {
            var results = {};

            for (var key in object) {
                if (hasOwnProperty.call(object, key)) {
                    results[key] = fn.call(bind, object[key], key, object);
                }
            }

            return results;
        },

        /**
         * Reset an object by un-linking any references between objects and arrays.
         * Basically, child objects and arrays will by pseudo cloned.
         *
         * @param {Object} object
         * @returns {Object}
         */
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
        },

        /**
         * Execute every function in the object in order of definition.
         *
         * @param {Object} object
         * @returns {Object}
         */
        run: function(object) {
            var args = Array.slice(arguments, 1);

            for (var key in object) {
                if (object[key].apply) {
                    object[key].apply(object, args);
                }
            }

            return object;
        },

        /**
         * Convert an object to an HTTP query string.
         * Will take into account nested objects and arrays.
         *
         * @param {Object} object
         * @param {String} base
         * @returns {String}
         */
        toQueryString: function(object, base) {
            var queryString = [];

            Object.forEach(object, function(value, key) {
                if (base) {
                    key = base + '[' + key + ']';
                }

                var result;

                switch (typeOf(value)) {
                    case 'object':
                        result = Object.toQueryString(value, key);
                    break;
                    case 'array':
                        var qs = {};

                        value.forEach(function(val, i) {
                            qs[i] = val;
                        });

                        result = Object.toQueryString(qs, key);
                    break;
                    default:
                        result = key + '=' + encodeURIComponent(value);
                    break;
                }

                if (value) {
                    queryString.push(result);
                }
            });

            return queryString.join('&');
        }

    });

    // Legacy and compatibility
    Object.alias({
        append: 'assign',
        subset: 'pick',
        getLength: 'size'
    });

}).call(this);