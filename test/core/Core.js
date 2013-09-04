var assert = chai.assert;

suite('Core', function() {
    setup(function() {

    });

    suite('typeOf', function() {
        test('String is string', function() {
            assert.equal(typeOf('string'), 'string');
        });
        test('Number is number', function() {
            assert.equal(typeOf(123), 'number');
        });
        test('Array is array', function() {
            assert.equal(typeOf([]), 'array');
        });
        test('Object is object', function() {
            assert.equal(typeOf({}), 'object');
        });
        test('Boolean is boolean', function() {
            assert.equal(typeOf(true), 'boolean');
            assert.equal(typeOf(false), 'boolean');
        });
        test('Function is function', function() {
            assert.equal(typeOf(function(){}), 'function');
        });
        test('null is null', function() {
            assert.equal(typeOf(null), 'null');
        });
        test('undefined is null', function() {
            assert.equal(typeOf(), 'null');
            assert.equal(typeOf(undefined), 'null');
        });
        test('NaN is null', function() {
            assert.equal(typeOf(NaN), 'null');
        });
        test('RegExp is regexp', function() {
            assert.equal(typeOf(new RegExp('^$')), 'regexp');
            assert.equal(typeOf(/^$/), 'regexp');
        });
        test('arguments is arguments', function() {
            assert.equal(typeOf(arguments), 'arguments');
        });
        test('node is element', function() {
            assert.equal(typeOf(document.createElement('div')), 'element');
        });
        test('node is textnode', function() {
            assert.equal(typeOf(document.createTextNode('text')), 'textnode');
        });
        test('node is whitespace', function() {
            assert.equal(typeOf(document.createTextNode('')), 'whitespace');
        });
        test('nodes is collection', function() {
            assert.equal(typeOf(document.querySelectorAll('div')), 'collection');
        });
    });

    suite('instanceOf', function() {
        test('string is String', function() {
            assert.ok(instanceOf('string', String));
        });
        test('number is Number', function() {
            assert.ok(instanceOf(123, Number));
        });
        test('object is Object', function() {
            assert.ok(instanceOf({}, Object));
        });
        test('boolean is Boolean', function() {
            assert.ok(instanceOf(true, Boolean));
            assert.ok(instanceOf(false, Boolean));
        });
        test('function is Function', function() {
            assert.ok(instanceOf(function() {}, Function));
        });
        // TODO class testing
    });

    suite('hexToRgb', function() {
        test('with string', function() {
            assert.deepEqual(hexToRgb('#ffffff'), [255, 255, 255]);
            assert.deepEqual(hexToRgb('000000'), [0, 0, 0]);
            assert.deepEqual(hexToRgb([0, 0, 0]), [0, 0, 0]);
        });
        test('with array', function() {
            assert.deepEqual(hexToRgb([0, 0, 0]), [0, 0, 0]);
        });
        test('null states', function() {
            assert.isNull(hexToRgb([1, 2]));
            assert.isNull(hexToRgb(null));
            assert.isNull(hexToRgb(123));
        });
    });

    suite('rgbToHex', function() {
        test('to array', function() {
            assert.deepEqual(rgbToHex([255, 255, 255]), ['ff', 'ff', 'ff']);
        });
        test('to code', function() {
            assert.deepEqual(rgbToHex([255, 255, 255], true), '#ffffff');
        });
        test('with alpha', function() {
            assert.deepEqual(rgbToHex([255, 255, 255, 0], true), 'transparent');
        });
        test('null states', function() {
            assert.isNull(rgbToHex([255, 255]));
        });
    });

    suite('Function', function() {
        var Mock = function() {
            this.data = {
                foo: 'bar'
            };
        };

        suite('overloadSetter', function() {
            Mock.prototype.set = function(key, value) {
                this.data[key] = value;
            }.overloadSetter();

            Mock.prototype.setForce = function(key, value) {
                this.data[key] = value;
            }.overloadSetter(true);

            var obj = new Mock();

            test('set single', function() {
                obj.set('key', 'value');

                assert.equal(obj.data.key, 'value');
                assert.deepEqual(obj.data, {
                    foo: 'bar',
                    key: 'value'
                });
            });
            test('set multiple', function() {
                obj.set({
                    foo: 'baz',
                    key: 'var'
                });

                assert.deepEqual(obj.data, {
                    foo: 'baz',
                    key: 'var'
                });
            });
            test('set with force object', function() {
                obj.setForce({
                    moo: 'milk'
                });

                assert.deepEqual(obj.data, {
                    foo: 'baz',
                    key: 'var',
                    moo: 'milk'
                });
            });
        });

        suite('overloadGetter', function() {
            Mock.prototype.get = function(key) {
                return this.data[key] || null;
            }.overloadGetter();

            Mock.prototype.getForce = function(key) {
                return this.data[key] || null;
            }.overloadGetter(true);

            var obj = new Mock();

            test('get single', function() {
                assert.equal(obj.get('foo'), 'bar');
                assert.equal(obj.get('key'), null);
            });
            test('get multiple', function() {
                obj.data.moo = 'milk';

                assert.deepEqual(obj.get(['foo', 'key', 'moo']), {
                    foo: 'bar',
                    key: null,
                    moo: 'milk'
                });
            });
            test('get with force array', function() {
                assert.deepEqual(obj.getForce('foo'), {
                    foo: 'bar'
                });
            });
        });

        suite('extend', function() {
            test('static extension', function() {
                assert.isUndefined(Mock.testProperty);
                assert.isUndefined(Mock.testMethod);

                Mock.extend({
                    testProperty: 'foo',
                    testMethod: function() {}
                });

                assert.isString(Mock.testProperty);
                assert.isFunction(Mock.testMethod);
            });
        });

        suite('implement', function() {
            test('prototype extension', function() {
                assert.isUndefined(Mock.prototype.protoProperty);
                assert.isUndefined(Mock.prototype.protoMethod);

                Mock.implement({
                    protoProperty: 'foo',
                    protoMethod: function() {}
                });

                assert.isString(Mock.prototype.protoProperty);
                assert.isFunction(Mock.prototype.protoMethod);
            });
        });

        suite('polyfill', function() {
            test('prototype polyfill', function() {
                var oldMethod = Mock.prototype.polyMethod = function() {},
                    newMethod = function() { return 1; };

                assert.isUndefined(Mock.prototype.polyProperty);
                assert.isFunction(Mock.prototype.polyMethod);

                Mock.polyfill({
                    polyProperty: 'foo',
                    polyMethod: newMethod
                });

                assert.isString(Mock.prototype.polyProperty);
                assert.strictEqual(Mock.prototype.polyMethod, oldMethod);
            });
        });

        suite('hide', function() {

        });

        suite('protect', function() {

        });

        suite('methods', function() {

        });

        suite('properties', function() {

        });
    });

    suite('Type', function() {

        suite('isEnumerable', function() {

        });

        suite('extend', function() {

        });

        suite('implement', function() {

        });

        suite('alias', function() {

        });

        suite('mirror', function() {

        });

        suite('is*', function() {

        });
    });

    suite('Types', function() {
        suite('Array.from', function() {
            test('should return an array', function() {
                assert.deepEqual(Array.from(1), [1]);
                assert.deepEqual(Array.from('abc'), ['abc']);
                assert.deepEqual(Array.from(true), [true]);
                assert.deepEqual(Array.from(['foo']), ['foo']);
            });
        });
    });
});