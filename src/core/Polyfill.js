// TODO

(function() {

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

            if (args != null) {
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
                return (item != null);
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
                if (this[i] != null) {
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

    Object.polyfill({

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

                switch (typeOf(value)){
                    case 'object':
                        result = Object.toQueryString(value, key);
                    break;
                    case 'array':
                        var qs = {};

                        value.forEach(function(val, i){
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
        getLength: 'size',
        keyOf: 'findKey'
    });

}).call(this);