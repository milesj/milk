// TODO

(function() {

    /*------------------------------------ Class ------------------------------------*/

    /**
     * Provides an interface for classes and multiple parent inheritance.
     * Each class can accept a literal object argument that maps properties and methods to the class.
     * Also supports parent inheritance through the "Extends" mutator, and trait inheritance through "Implements".
     *
     * @type {Type}
     * @param {Object|Function} params
     * @returns {Function}
     * @constructor
     */
    var Class = new Type('Class', function(params) {

        // Accept a function as an initializer
        if (instanceOf(params, Function)) {
            params = {
                initialize: params
            };
        }

        // Instantiate a new class
        var newClass = function() {
            Object.reset(this);

            if (newClass.$prototyping) {
                return this;
            }

            this.$caller = null;

            var value = this.initialize ? this.initialize.apply(this, arguments) : this;

            this.$caller = null;

            return value;
        };

        // Inherit methods and properties
        newClass.extend(this);
        newClass.implement(params);
        newClass.prototype.parent = parent;

        return newClass;
    });

    Class.Mutators = {

        /**
         * Mutator that sets the parent class to inherit functionality from.
         * Allows for vertical inheritance.
         *
         * @param {Object} parent
         */
        Extends: function(parent) {
            this.parent = parent;

            parent.$prototyping = true;

            this.prototype = new parent();

            delete parent.$prototyping;
        },

        /**
         * Mutator that inherits functionality from multiple classes.
         * Allows for horizontal inheritance.
         *
         * @param {Array} items
         */
        Implements: function(items) {
            Array.from(items).forEach(function(item) {
                var instance = new item(), key;

                for (key in instance) {
                    implement.call(this, key, instance[key], true);
                }
            }, this);
        },

        /**
         * Mutator that automatically binds specified methods in a class to the instance of the class.
         * This method however only sets the Binds property to an array.
         *
         * @param {Array} binds
         * @returns {Array}
         */
        Binds: function(binds) {
            return Array.from(binds).concat(this.prototype.Binds || []);
        }

    };

    Class.implement({

        // Override the implement function to support class functionality
        implement: implement.overloadSetter(),

        /**
         * Default initializer for classes.
         * Will loop over any method names in the Binds mutator and bind the scope.
         */
        initialize: function() {
            Array.from(this.Binds).forEach(function(name){
                var original = this[name];

                if (original) {
                    this[name] = original.bind(this);
                }
            }, this);
        }
    });

    /**
     * Attempts to call a method on the parent class.
     *
     * @returns {Function}
     */
    function parent() {
        if (!this.$caller) {
            throw new Error('The method "parent" cannot be called.');
        }

        var name = this.$caller.$name,
            parent = this.$caller.$owner.parent,
            previous = parent ? parent.prototype[name] : null;

        if (!previous) {
            throw new Error('The method "' + name + '" has no parent.');
        }

        return previous.apply(this, arguments);
    }

    /**
     * Works like `Function.implement` but allows classes to retain the original value,
     * so that parent method calling can be achieved.
     *
     * @param {String} key
     * @param {*} value
     * @param {boolean} retain
     * @returns {Function}
     */
    function implement(key, value, retain) {
        if (Class.Mutators.hasOwnProperty(key)) {
            value = Class.Mutators[key].call(this, value);

            // Allow binds to pass
            if (!value) {
                return this;
            }
        }

        if (typeOf(value) === 'function') {
            if (value.$hidden) {
                return this;
            }

            this.prototype[key] = retain ? value : wrap(this, key, value);
        } else {
            this.prototype[key] = value;
        }

        return this;
    }

    /**
     * Wrap a method with meta data so that inheritance method calling can be achieved.
     * Will mask the internal caller references, execute the method, and reset the state before returning.
     *
     * @param {Function} self
     * @param {String} key
     * @param {Function} method
     * @returns {Function}
     */
    function wrap(self, key, method) {
        if (method.$origin) {
            method = method.$origin;
        }

        var wrapper = function() {
            if (method.$protected && !this.$caller) {
                throw new Error('The method "' + key + '" cannot be called.');
            }

            var caller = this.caller,
                current = this.$caller;

            this.caller = current;
            this.$caller = wrapper;

            var result = method.apply(this, arguments);

            this.$caller = current;
            this.caller = caller;

            return result;
        }.extend({
            $owner: self,
            $origin: method,
            $name: key
        });

        return wrapper;
    }

    /*------------------------------------ Chain ------------------------------------*/

    /**
     * A Utility Class which executes functions one after another,
     * with each function firing after completion of the previous.
     *
     * @type {Class}
     */
    var Chain = new Class({

        /** List of functions */
        $chain: [],

        /**
         * Adds functions to the end of the chain stack.
         *
         * @returns {Chain}
         */
        chain: function() {
            this.$chain.union(Array.prototype.flatten(arguments));

            return this;
        },

        /**
         * Removes the first function of the chain stack and executes it.
         * The next function will then become first in the array.
         *
         * @returns {boolean}
         */
        callChain: function() {
            return this.$chain.length ? this.$chain.shift().apply(this, arguments) : false;
        },

        /**
         * Clears the chain stack.
         *
         * @returns {Chain}
         */
        clearChain: function() {
            this.$chain = [];

            return this;
        },

        /**
         * Loop over all remaining functions in the chain and execute them all.
         * Will clear the chain once all functions have executed.
         *
         * @returns {Chain}
         */
        executeChain: function() {
            if (this.$chain.length) {
                this.$chain.forEach(function(fn) {
                    fn.apply(this, arguments);
                }, this);
            }

            this.clearChain();

            return this;
        },

        /**
         * Injects pauses between chained events.
         *
         * @param {Number} duration
         * @returns {Chain}
         */
        wait: function(duration){
            return this.chain(function() {
                this.callChain.delay(duration || 500, this);

                return this;
            }.bind(this));
        }

    });

    /*------------------------------------ Events ------------------------------------*/

    /**
     * A utility class that adds event management to the class layer.
     *
     * @type {Class}
     */
    var Events = new Class({

        /** List of events grouped by type */
        $events: {},

        /**
         * Adds an event to the event stack.
         *
         * @param {String} type
         * @param {Function} fn
         * @param {boolean} internal
         * @returns {Events}
         */
        addEvent: function(type, fn, internal) {
            type = removeOn(type);

            if (internal) {
                fn.internal = true;
            }

            this.$events[type] = (this.$events[type] || []).include(fn);

            return this;
        },

        /**
         * Add multiple events using an object.
         *
         * @param {Object} events
         * @returns {Events}
         */
        addEvents: function(events) {
            var type;

            for (type in events) {
                this.addEvent(type, events[type], false);
            }

            return this;
        },

        /**
         * Execute all events under the specific type.
         *
         * @param {String} type
         * @param {Array} args
         * @param {Number} delay
         * @returns {Events}
         */
        fireEvent: function(type, args, delay) {
            type = removeOn(type);

            var events = this.$events[type];

            if (!events) {
                return this;
            }

            args = Array.from(args);

            events.forEach(function(fn) {
                if (delay) {
                    fn.delay(delay, this, args);
                } else {
                    fn.apply(this, args);
                }
            }, this);

            return this;
        },

        /**
         * Remove an event from the specific type that matches the function signature.
         *
         * @param {String} type
         * @param {Function} fn
         * @returns {Events}
         */
        removeEvent: function(type, fn) {
            type = removeOn(type);

            var events = this.$events[type];

            if (events && !fn.internal) {
                var index =  events.indexOf(fn);

                if (index !== -1) {
                    delete events[index];
                }
            }

            return this;
        },

        /**
         * Remove multiple events using a function mapped object, or a string type.
         * Calling the method with an empty argument will remove all events.
         *
         * @param {Object|String} events
         * @returns {Events}
         */
        removeEvents: function(events) {
            var type;

            if (typeOf(events) === 'object') {
                for (type in events) {
                    this.removeEvent(type, events[type]);
                }

                return this;
            }

            if (events) {
                events = removeOn(events);
            }

            for (type in this.$events) {
                if (events && events !== type) {
                    continue;
                }

                var fns = this.$events[type];

                for (var i = fns.length; i--;) {
                    if (i in fns) {
                        this.removeEvent(type, fns[i]);
                    }
                }
            }

            return this;
        }

    });

    /**
     * Remove "on" from the beginning of a string.
     * Used to rename "onClick" events to simply "click".
     *
     * @param {String} string
     * @returns {String}
     */
    function removeOn(string) {
        return string.replace(/^on([A-Z])/, function(full, first) {
            return first.toLowerCase();
        });
    }

    /*------------------------------------ Options ------------------------------------*/

    /**
     * A utility class that adds configurable options for class instances.
     *
     * @type {Class}
     */
    var Options = new Class({

        /** Options object */
        options: {},

        /**
         * Set an object of key value pairs and merge with the current options.
         * Any function options that start with "on" will be added as a class event.
         *
         * @param {Object} options
         * @returns {Options}
         */
        setOptions: function(options) {
            options = Object.merge(this.options, options || {});

            // Add class events for on* options
            if (this.addEvent) {
                var option;

                for (option in options) {
                    if (typeOf(options[option]) !== 'function' || !(/^on[A-Z]/).test(option)) {
                        continue;
                    }

                    this.addEvent(option, options[option]);

                    delete options[option];
                }
            }

            this.options = options;

            return this;
        }
    });

    this.Class = Class;
    this.Chain = Chain;
    this.Events = Events;
    this.Options = Options;
}).call(this);